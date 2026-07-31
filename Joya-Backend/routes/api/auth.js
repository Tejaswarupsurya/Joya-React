const express = require("express");
const router = express.Router();

//middlewares
const {
  isLoggedIn,
  validateReset,
  validateSignup,
  validateUpdatePassword,
} = require("../../middleware.js");

//controllers
const authController = require("../../controllers/auth.js");

//utils
const wrapAsync = require("../../utils/wrapAsync.js");

router.get("/me", authController.getCurrentUser);

router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/signup", validateSignup, wrapAsync(authController.signup));

// Email verification routes
router.get("/pending-verification", authController.getPendingVerification);
router.post("/verify-email", wrapAsync(authController.verifyEmail));
router.post("/resend-otp", wrapAsync(authController.resendOTP));

// Forgot password routes
router.post("/send-forgot-otp", wrapAsync(authController.sendForgotOTP));
router.post("/forgot-password", validateReset, wrapAsync(authController.forgotPassword));

// Password and Email update routes (Requires authentication)
router.post("/update-password", isLoggedIn, validateUpdatePassword, wrapAsync(authController.updatePassword));
router.post("/change-email", isLoggedIn, wrapAsync(authController.changeEmail));

module.exports = router;
