const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendBookingConfirmedEmail } = require("../utils/emailService.js");

// Create Stripe Checkout Session
module.exports.createCheckoutSession = async (req, res) => {
  const { listingId, checkIn, checkOut, guests } = req.body;

  try {
    // Validate input
    if (!checkIn || !checkOut || !guests || !listingId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate guests
    if (guests < 1 || guests > 6) {
      return res.status(400).json({
        success: false,
        message: "Guests must be between 1 and 6",
      });
    }

    // Get listing details
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Calculate nights and validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights < 1) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in",
      });
    }

    if (nights > 14) {
      return res.status(400).json({
        success: false,
        message: "Maximum stay is 14 nights",
      });
    }

    // Calculate total price (SINGLE SOURCE OF TRUTH)
    const totalPrice = listing.price * nights;

    // Check availability before creating booking
    await Booking.expireOldBookings();
    const existing = await Booking.find({
      listing: listingId,
      status: { $nin: ["cancelled", "expired"] },
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $lte: checkOutDate, $gt: checkInDate } },
      ],
    });

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Selected dates are not available",
      });
    }

    // Create booking with PENDING_PAYMENT status
    const booking = new Booking({
      listing: listingId,
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: "pending_payment",
    });

    await booking.save();

    const clientUrl =
      process.env.BASE_URL ||
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              description: `${nights} night${
                nights > 1 ? "s" : ""
              } • ${guests} guest${guests > 1 ? "s" : ""}`,
              images: listing.image?.url ? [listing.image.url] : [],
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        listingId: listingId,
      },
      success_url: `${clientUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payments/cancel?booking_id=${booking._id}`,
    });

    // Save session ID to booking
    booking.stripeSessionId = session.id;
    await booking.save();

    return res.status(200).json({
      success: true,
      sessionUrl: session.url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

// Stripe Webhook Handler (CRITICAL FOR PAYMENT CONFIRMATION)
module.exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Find booking by session ID
      const booking = await Booking.findOne({
        stripeSessionId: session.id,
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Check if already confirmed (idempotency)
      if (booking.status === "confirmed") {
        return res.status(200).json({ received: true });
      }

      // Confirm the booking
      booking.status = "confirmed";
      booking.stripePaymentIntentId = session.payment_intent;
      booking.expiresAt = null; // Remove expiration
      await booking.save();

      // Send booking confirmation email
      try {
        const user = await User.findById(booking.user);
        const listing = await Listing.findById(booking.listing);

        if (user && listing) {
          await sendBookingConfirmedEmail(
            user.email,
            user.username,
            booking,
            listing
          );
        }
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  }

  return res.status(200).json({ received: true });
};

// Payment Success Endpoint
module.exports.paymentSuccess = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({
      success: false,
      message: "Session ID is required",
    });
  }

  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Find booking
    const booking = await Booking.findOne({
      stripeSessionId: session_id,
    }).populate("listing");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found!",
      });
    }

    // Confirm booking status if paid & send confirmation email
    if (session.payment_status === "paid" && booking.status !== "confirmed") {
      booking.status = "confirmed";
      booking.stripePaymentIntentId = session.payment_intent;
      booking.expiresAt = null;
      await booking.save();

      try {
        const user = await User.findById(booking.user);
        if (user && booking.listing) {
          await sendBookingConfirmedEmail(
            user.email,
            user.username,
            booking,
            booking.listing
          );
        }
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      booking,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve payment details",
    });
  }
};

// Payment Cancel Endpoint
module.exports.paymentCancel = async (req, res) => {
  const { booking_id } = req.query;

  if (!booking_id) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required",
    });
  }

  try {
    const booking = await Booking.findById(booking_id).populate("listing");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found!",
      });
    }

    // Cancel the booking
    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

// Resume Checkout Session for Pending Payment Booking
module.exports.resumeCheckoutSession = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!booking.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this booking",
      });
    }

    if (booking.status !== "pending_payment") {
      return res.status(400).json({
        success: false,
        message: `Cannot pay for booking with status: ${booking.status}`,
      });
    }

    if (booking.isExpired()) {
      booking.status = "expired";
      await booking.save();
      return res.status(400).json({
        success: false,
        message: "This booking reservation has expired.",
      });
    }

    const clientUrl =
      process.env.BASE_URL ||
      process.env.CLIENT_URL ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    let sessionUrl = null;

    if (booking.stripeSessionId) {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(
          booking.stripeSessionId
        );
        if (existingSession && existingSession.status === "open") {
          sessionUrl = existingSession.url;
        }
      } catch (err) {
        // Session expired on Stripe side, will create a fresh one below
      }
    }

    if (!sessionUrl) {
      const listing = booking.listing;
      const nights = Math.ceil(
        (new Date(booking.checkOut).getTime() -
          new Date(booking.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: listing.title,
                description: `${nights} night${
                  nights > 1 ? "s" : ""
                } • ${booking.guests} guest${booking.guests > 1 ? "s" : ""}`,
                images: listing.image?.url ? [listing.image.url] : [],
              },
              unit_amount: Math.round(booking.totalPrice * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: booking._id.toString(),
          userId: req.user._id.toString(),
          listingId: listing._id.toString(),
        },
        success_url: `${clientUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/payments/cancel?booking_id=${booking._id}`,
      });

      booking.stripeSessionId = session.id;
      await booking.save();
      sessionUrl = session.url;
    }

    return res.status(200).json({
      success: true,
      sessionUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resume checkout session",
    });
  }
};
