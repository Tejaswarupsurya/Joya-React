const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const { getAvgRating } = require("../utils/review.js");

// User Dashboard Controller
module.exports.renderDashboard = async (req, res) => {
  try {
    if (req.user?.role === "admin") {
      return res.redirect("/admin/dashboard");
    }

    if (req.user?.role === "host") {
      return res.redirect("/host/dashboard");
    }

    const userId = req.user._id;

    // First, expire any old pending bookings
    await Booking.expireOldBookings();

    // Get all bookings for the user
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "listing",
        select: "title location country image price",
        populate: {
          path: "reviews",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average rating for each listing
    bookings.forEach((booking) => {
      if (booking.listing && booking.listing.reviews) {
        booking.listing.avgRating = getAvgRating(booking.listing.reviews);
      }
    });

    // Separate bookings by status and dates
    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.checkOut) > new Date()
    );

    const pastBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.checkOut) <= new Date()
    );

    const pendingPaymentBookings = bookings.filter(
      (booking) => booking.status === "pending_payment"
    );

    const expiredBookings = bookings.filter(
      (booking) => booking.status === "expired"
    );

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    );

    // Calculate stats
    const stats = {
      total: bookings.length,
      active: activeBookings.length,
      completed: pastBookings.length,
      pending: pendingPaymentBookings.length,
      cancelled: cancelledBookings.length + expiredBookings.length,
    };

    // Get user with populated wishlist
    const userWithWishlist = await User.findById(req.user._id)
      .populate({
        path: "wishlist",
        populate: {
          path: "reviews",
        },
      })
      .lean();

    if (userWithWishlist?.wishlist) {
      userWithWishlist.wishlist.forEach((listing) => {
        if (listing.reviews) {
          listing.avgRating = getAvgRating(listing.reviews);
        }
      });
    }

    return res.status(200).json({
      success: true,
      wishlist: userWithWishlist?.wishlist || [],
      bookings: {
        active: activeBookings,
        past: pastBookings,
        pending: pendingPaymentBookings,
        cancelled: cancelledBookings,
        expired: expiredBookings,
      },
      stats,
    });
  } catch (error) {
    console.error("Error loading user dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard. Error: " + error.message,
    });
  }
};
