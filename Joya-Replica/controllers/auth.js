const passport = require("passport");

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
