const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { sendBookingCancelledEmail } = require("../utils/emailService.js");

module.exports.renderNewForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found!",
    });
  }

  const bookings = await Booking.find({
    listing: req.params.id,
    status: { $nin: ["cancelled", "expired"] },
  }).select("checkIn checkOut");

  const bookedDates = bookings.map((b) => ({
    from: b.checkIn.toISOString().split("T")[0],
    to: b.checkOut.toISOString().split("T")[0],
  }));

  return res.status(200).json({
    success: true,
    listing: {
      _id: listing._id,
      title: listing.title,
      price: listing.price,
      image: listing.image,
    },
    bookedDates,
  });
};

module.exports.showBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate({
      path: "listing",
      populate: {
        path: "owner",
        select: "username email",
      },
    })
    .populate("user", "username email");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found!",
    });
  }

  return res.status(200).json({
    success: true,
    booking,
  });
};

module.exports.confirmBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("user", "email username");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found!",
    });
  }

  if (booking.isExpired()) {
    booking.status = "expired";
    await booking.save();
    return res.status(400).json({
      success: false,
      message: "This booking has expired and can no longer be confirmed!",
    });
  }

  if (booking.status === "cancelled" || booking.status === "expired") {
    return res.status(400).json({
      success: false,
      message: `You can't confirm a ${booking.status} booking!`,
    });
  }

  booking.status = "confirmed";
  booking.expiresAt = null;
  await booking.save();

  return res.status(200).json({
    success: true,
    message: "Booking confirmed successfully!",
    booking,
  });
};

module.exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate("listing")
    .populate("user", "email username");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found!",
    });
  }

  booking.status = "cancelled";
  await booking.save();

  try {
    if (booking.user && booking.user.email && booking.listing) {
      await sendBookingCancelledEmail(
        booking.user.email,
        booking.user.username,
        booking,
        booking.listing
      );
    }
  } catch (emailError) {
    console.error("Failed to send booking cancellation email:", emailError);
  }

  return res.status(200).json({
    success: true,
    message: "Booking cancelled successfully!",
    booking,
  });
};
