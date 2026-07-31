const express = require("express");
const router = express.Router();

//cloudinary
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

//middlewares
const {
  isLoggedIn,
  canApplyAsHost,
  validateHostApplication,
} = require("../middleware.js");

//controllers
const hostController = require("../controllers/host.js");

//utils Section
const wrapAsync = require("../utils/wrapAsync.js");

//routes

//apply - host application POST (API)
function handleUpload(req, res, next) {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed.",
      });
    }
    next();
  });
}

router.post(
  "/apply",
  isLoggedIn,
  canApplyAsHost,
  handleUpload,
  validateHostApplication,
  wrapAsync(hostController.submitApplication)
);

// Host Dashboard route
router.get(
  "/host/dashboard",
  isLoggedIn,
  wrapAsync(hostController.getHostDashboard)
);

module.exports = router;
