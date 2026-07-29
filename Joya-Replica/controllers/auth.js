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