//mongodb Section
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const Booking = require("./models/booking.js");
const {
  listingSchema,
  signupSchema,
  reviewSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  bookingSchema,
  hostApplicationSchema,
} = require("./schema.js");

//utils Section
const ExpressError = require("./utils/ExpressError.js");

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body, {
    abortEarly: false,
  });

  if (!error) {
    return next();
  }

  const errors = {};

  error.details.forEach((detail) => {
    const field = detail.path[0];

    if (field && !errors[field]) {
      errors[field] = detail.message;
    }
  });

  return res.status(400).json({
    success: false,
    message: "Please correct the highlighted fields.",
    errors,
  });
};

module.exports.validateUpdatePassword = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({
      success: false,
      message: errmsg,
    });
  }
  next();
};

module.exports.validateReset = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({
      success: false,
      message: errmsg,
    });
  }
  next();
};

module.exports.validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errMsg);
    return res.redirect(`/listings/${req.params.id}/bookings/new`);
  } else {
    next();
  }
};
module.exports.validateHostApplication = (req, res, next) => {
  let { error } = hostApplicationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({
      success: false,
      message: errMsg,
    });
  } else {
    next();
  }
};

// Additional booking-specific middleware
module.exports.checkBookingOwnership = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "user"
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found!",
      });
    }
    if (!booking.user._id.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this booking!",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Login to continue",
    });
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const excludedPaths = ["/login", "/signup", "/forgot", "/change-password"];
module.exports.storeRedirectUrl = (req, res, next) => {
  if (
    req.method === "GET" &&
    !req.session.redirectUrl &&
    !excludedPaths.includes(req.originalUrl)
  ) {
    req.session.redirectUrl = req.originalUrl;
  }
  next();
};

module.exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      if (
        req.xhr ||
        req.headers.accept?.includes("json") ||
        req.originalUrl.startsWith("/api/")
      ) {
        return res.status(401).json({
          success: false,
          message: "Login to continue!",
        });
      }
      req.flash("error", "Login to continue!");
      return res.redirect("/login");
    }
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      if (
        req.xhr ||
        req.headers.accept?.includes("json") ||
        req.originalUrl.startsWith("/api/")
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this page!",
        });
      }
      req.flash("error", "You are not authorized to access this page!");
      return res.redirect("/");
    }
    next();
  };
};

module.exports.isDocOwner = (Model, field = "owner") => {
  return async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) {
      if (
        req.xhr ||
        req.headers.accept?.includes("json") ||
        req.originalUrl.startsWith("/api/")
      ) {
        return res.status(404).json({
          success: false,
          message: "Resource not found!",
        });
      }
      req.flash("error", "Resource not found!");
      return res.redirect("back");
    }
    if (!doc[field].equals(req.user._id) && req.user.role !== "admin") {
      if (
        req.xhr ||
        req.headers.accept?.includes("json") ||
        req.originalUrl.startsWith("/api/")
      ) {
        return res.status(403).json({
          success: false,
          message: "You don't have Access!",
        });
      }
      req.flash("error", "You don't have Access!");
      return res.redirect("back");
    }
    next();
  };
};

module.exports.isHost = (req, res, next) => {
  if (!res.locals.currUser || res.locals.currUser.role !== "host") {
    return res.status(403).json({
      success: false,
      message: "Only Hosts can create listings!",
    });
  }
  next();
};

module.exports.isHostOrAdmin = (req, res, next) => {
  if (!res.locals.currUser || res.locals.currUser.role === "user") {
    return res.status(403).json({
      success: false,
      message: "Only Hosts or Admin have access!",
    });
  }
  next();
};

module.exports.canApplyAsHost = (req, res, next) => {
  if (req.user.role === "user") return next();

  if (req.user.role === "host" && req.user.host.status === "rejected")
    return next();

  return res.status(400).json({
    success: false,
    message: "You already have an active host application!",
  });
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found!",
    });
  }
  if (
    !listing.owner.equals(res.locals.currUser._id) &&
    res.locals.currUser.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "You don't have Access!",
    });
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found!",
    });
  }

  let listing = await Listing.findById(id);
  const isAuthor = review.author.equals(res.locals.currUser._id);
  const isAdmin = res.locals.currUser.role === "admin";
  const isHostOwner = listing && listing.owner.equals(res.locals.currUser._id);

  if (!isAuthor && !isAdmin && !isHostOwner) {
    return res.status(403).json({
      success: false,
      message: "You aren't the Author of this Review!",
    });
  }
  next();
};

module.exports.isAlreadyReviewed = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  const alreadyReviewed = listing.reviews.some((r) =>
    r.author.equals(req.user._id)
  );
  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed!",
    });
  }
  next();
};

module.exports.fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ExpressError(400, "Invalid file type. Only images are allowed."),
      false
    );
  }
};

module.exports.checkRequiredFile = (req, res, next) => {
  if (!req.file || req.file.size === 0) {
    throw new ExpressError(400, "Image upload failed or file is empty.");
  }
  next();
};

module.exports.checkOptionalFile = (req, res, next) => {
  if (req.file && req.file.size === 0) {
    throw new ExpressError(400, "Uploaded file is empty.");
  }
  next();
};
