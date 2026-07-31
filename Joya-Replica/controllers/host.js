const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const { getAvgRating } = require("../utils/review.js");

module.exports.submitApplication = async (req, res) => {
  try {
    const { fullName, phone, aadhaar } = req.body;
    const userId = req.user._id;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload your profile photo.",
      });
    }

    // Find the user and update host information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Update host application data
    user.host = {
      fullName,
      phone,
      aadhaar,
      avatar: {
        url: req.file.path,
        filename: req.file.filename,
      },
      status: "pending",
      appliedAt: new Date(),
    };

    // Set role to host (pending review)
    user.role = "host";
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Host application submitted successfully! We'll review your application within 2-3 business days.",
    });
  } catch (error) {
    console.error("Host application error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your application. Please try again.",
    });
  }
};

// Host Dashboard Controller
module.exports.getHostDashboard = async (req, res) => {
  try {
    const hostId = req.user._id;

    // First, expire any old pending bookings
    await Booking.expireOldBookings();

    // Get host's listings
    const listings = await Listing.find({ owner: hostId })
      .populate("reviews")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average rating for each listing
    listings.forEach((listing) => {
      if (listing.reviews) {
        listing.avgRating = getAvgRating(listing.reviews);
      }
    });

    // Get all bookings for host's listings
    const listingIds = listings.map((listing) => listing._id);
    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate("listing", "title location country image price")
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate time periods
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Separate bookings by status and time
    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" && new Date(booking.checkOut) > now
    );

    const completedBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" && new Date(booking.checkOut) <= now
    );

    const pendingPaymentBookings = bookings.filter(
      (booking) => booking.status === "pending_payment"
    );

    const thisMonthBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" && new Date(booking.createdAt) >= startOfMonth
    );

    // Calculate earnings
    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );
    const monthlyEarnings = thisMonthBookings.reduce(
      (sum, booking) => sum + (booking.totalPrice || 0),
      0
    );

    // Calculate occupancy rate
    const totalDaysBooked = completedBookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const days = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + (days > 0 ? days : 0);
    }, 0);

    const occupancyRate =
      listings.length > 0
        ? Math.round((totalDaysBooked / (listings.length * 30)) * 100)
        : 0;

    // Prepare stats
    const stats = {
      totalListings: listings.length,
      activeBookings: activeBookings.length,
      pendingBookings: pendingPaymentBookings.length,
      completedBookings: completedBookings.length,
      totalEarnings,
      monthlyEarnings,
      occupancyRate,
    };

    // Get all booking activities sorted by date
    const recentActivities = bookings;

    return res.status(200).json({
      success: true,
      listings,
      bookings: {
        active: activeBookings,
        pending: pendingPaymentBookings,
        completed: completedBookings,
        recent: recentActivities,
      },
      stats,
    });
  } catch (error) {
    console.error("Error loading host dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load host dashboard. Error: " + error.message,
    });
  }
};
