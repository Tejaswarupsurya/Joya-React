const passport = require("passport");
const User = require("../models/user.js");

const {
  sendOTPEmail,
  sendWelcomeEmail,
} = require("../utils/emailService.js");
const {
  generateOTP,
  generateOTPToken,
  verifyOTPToken,
  canResendOTP,
  getRemainingCooldown,
  OTP_EXPIRY,
} = require("../utils/jwtHelper.js");

module.exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      currentUser: null,
      userWishlist: [],
    });
  }

  const userWishlist = req.user.wishlist?.map((id) => id.toString()) ?? [];

  return res.status(200).json({
    currentUser: {
      _id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      host: req.user.host,
    },
    userWishlist,
  });
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: "Welcome back to Joya!",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
};

module.exports.signup = async (req, res) => {
  const { username, email, password, confirm } = req.body;

  if (password !== confirm) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match!",
      errors: {
        confirm: "Passwords do not match!",
      },
    });
  }

  const existingEmailUser = await User.findOne({ email });

  if (existingEmailUser) {
    return res.status(409).json({
      success: false,
      message: "Email already exists. Please log in!",
      errors: {
        email: "Email already registered. Please log in!",
      },
    });
  }

  const existingUsernameUser = await User.findOne({ username });

  if (existingUsernameUser) {
    return res.status(409).json({
      success: false,
      message: "Username is already taken. Please choose another username.",
      errors: {
        username: "Username is already taken.",
      },
    });
  }

  const otp = generateOTP();
  const otpToken = generateOTPToken(email, otp);

  req.session.pendingUser = {
    username,
    email,
    password,
    otpToken,
    otpIssuedAt: Date.now(),
  };

  await sendOTPEmail(email, otp, username);

  return res.status(200).json({
    success: true,
    message: `Verification code sent to ${email}. Please check your inbox.`,
    email,
  });
};

module.exports.getPendingVerification = (req, res) => {
  if (!req.session.pendingUser) {
    return res.status(404).json({
      success: false,
      message: "No pending verification found. Please sign up first.",
    });
  }

  const { email, otpIssuedAt } = req.session.pendingUser;
  const remainingTime =
    OTP_EXPIRY - Math.floor((Date.now() - otpIssuedAt) / 1000);

  if (remainingTime <= 0) {
    delete req.session.pendingUser;
    return res.status(400).json({
      success: false,
      message: "Verification code expired. Please sign up again.",
    });
  }

  return res.status(200).json({
    success: true,
    email,
    remainingTime,
    canResend: canResendOTP(otpIssuedAt),
  });
};

module.exports.verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter the verification code.",
      });
    }

    if (!req.session.pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please sign up again.",
      });
    }

    const { username, email, password, otpToken } = req.session.pendingUser;

    const decoded = verifyOTPToken(otpToken);

    if (!decoded) {
      delete req.session.pendingUser;
      return res.status(400).json({
        success: false,
        message: "Verification code expired. Please try again.",
      });
    }

    if (decoded.otp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please try again.",
      });
    }

    const newUser = new User({ email, username, isEmailVerified: true });
    const registeredUser = await User.register(newUser, password);

    delete req.session.pendingUser;

    sendWelcomeEmail(email, username).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Auto-login error:", err);
        return res.status(200).json({
          success: true,
          message: "Account created successfully! Please log in.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Welcome to Joya! Your account has been verified.",
        user: {
          _id: registeredUser._id,
          username: registeredUser.username,
          email: registeredUser.email,
          role: registeredUser.role,
        },
      });
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(400).json({
      success: false,
      message: error?.message || "Verification failed. Please try again.",
    });
  }
};

module.exports.resendOTP = async (req, res) => {
  try {
    if (!req.session.pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please sign up again.",
      });
    }

    const { username, email, otpIssuedAt } = req.session.pendingUser;

    if (!canResendOTP(otpIssuedAt)) {
      const remaining = getRemainingCooldown(otpIssuedAt);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remaining} seconds before resending code.`,
        remainingCooldown: remaining,
      });
    }

    const otp = generateOTP();
    const otpToken = generateOTPToken(email, otp);

    req.session.pendingUser.otpToken = otpToken;
    req.session.pendingUser.otpIssuedAt = Date.now();

    await sendOTPEmail(email, otp, username);

    return res.status(200).json({
      success: true,
      message: "New verification code sent to your email!",
      remainingTime: OTP_EXPIRY,
      canResend: false,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend verification code. Please try again.",
    });
  }
};
