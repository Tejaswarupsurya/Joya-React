const express = require("express");
const router = express.Router();

//middlewares
const {
  validateSignup,
} = require("../../middleware.js");

//controllers
const authController = require("../../controllers/auth.js");

//utils
const wrapAsync = require("../../utils/wrapAsync.js");

router.get("/me", authController.getCurrentUser);

router.post("/login", authController.login);

router.post("/signup", validateSignup, wrapAsync(authController.signup));

// Email verification routes
router.get("/pending-verification", authController.getPendingVerification);
router.post("/verify-email", wrapAsync(authController.verifyEmail));
router.post("/resend-otp", wrapAsync(authController.resendOTP));

module.exports = router;
