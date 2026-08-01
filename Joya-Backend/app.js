if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//Express Section
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");

const port = process.env.PORT || 3000;

// Trust the first proxy (Nginx on EC2) so req.secure works correctly
// This is required for secure session cookies behind a reverse proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  }),
);

// IMPORTANT: Stripe webhook MUST come BEFORE express.json() middleware
// Webhook needs raw body for signature verification
app.use("/payments/webhook", express.raw({ type: "application/json" }));

// JSON and URL encoding for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(compression());

//utils
const ExpressError = require("./utils/ExpressError.js");
const { scheduleCleanup } = require("./utils/bookingCleanup.js");

//passport Section
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Getting Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const authApiRouter = require("./routes/api/auth.js");
const bookingRouter = require("./routes/booking");
const hostRouter = require("./routes/host");
const adminRouter = require("./routes/admin");
const wishlistRouter = require("./routes/wishlist");
const paymentRouter = require("./routes/payment");

// mongoAtlas & mongodb Section
const isTestEnv = process.env.NODE_ENV === "test";
const dbUrl =
  process.env.ATLASDB_URL ||
  process.env.MONGODB_URL ||
  (process.env.NODE_ENV === "production"
    ? null
    : "mongodb://127.0.0.1:27017/joya");
const mongoose = require("mongoose");

async function main() {
  if (!dbUrl) {
    throw new Error("Missing database URL. Set ATLASDB_URL (or MONGODB_URL).");
  }
  await mongoose.connect(dbUrl);
}

if (!isTestEnv) {
  main()
    .then(() => {
      console.log("Database connected successfully");
      // Start the booking expiration cleanup scheduler
      scheduleCleanup();
    })
    .catch((err) => {
      console.log("Database connection failed", err);
    });
}

//Mongo-Connect & Express-Session
const sessionOptions = {
  secret: process.env.SECRET || "dev-secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // In production (cross-site: Vercel → EC2), cookies must be secure
    // and sameSite must be "none" so the browser sends them cross-origin
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

// Use connect-mongo only when we have a DB URL and we're not in tests.
if (!isTestEnv && dbUrl) {
  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET || "dev-secret",
    },
    touchAfter: 24 * 3600,
  });

  store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
  });

  sessionOptions.store = store;
}
app.use(session(sessionOptions));

//Using Passport (Authentication & Authorization)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routes Section
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/api/listings", listingRouter);
app.use("/api/auth", authApiRouter);
app.use("/api/listings/:id/reviews", reviewRouter);
app.use("/api/listings/:id/bookings", bookingRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/payments", paymentRouter);
app.use("/payments", paymentRouter);
app.use("/api", userRouter);
app.use("/api", hostRouter);
app.use("/api", adminRouter);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const { statusCode = 500, message = "Something went wrong" } = err;

  return res.status(statusCode).json({
    success: false,
    message,
  });
});

// Export app for testing
module.exports = app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
