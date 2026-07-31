const User = require("../models/user.js");

// List all host applications (pending, approved, rejected)
module.exports.listAllApplications = async (req, res) => {
  try {
    const allApplications = await User.find({
      "host.status": { $in: ["pending", "approved", "rejected"] },
    })
      .select("username email host role")
      .sort({ "host.appliedAt": -1 })
      .lean();

    return res.status(200).json({
      success: true,
      applications: allApplications,
    });
  } catch (error) {
    console.error("Error fetching host applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load host applications. Error: " + error.message,
    });
  }
};

// Approve host application
module.exports.approveApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.host?.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Application is not in pending status.",
      });
    }

    // Update user to approved host
    user.host.status = "approved";
    user.host.approvedAt = new Date();
    user.host.isHost = true;
    user.role = "host";

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Host application for ${user.username} has been approved successfully!`,
    });
  } catch (error) {
    console.error("Error approving application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve application. Error: " + error.message,
    });
  }
};

// Reject host application
module.exports.rejectApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.host?.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Application is not in pending status.",
      });
    }

    // Update user to rejected
    user.host.status = "rejected";
    user.host.isHost = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Host application for ${user.username} has been rejected.`,
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject application. Error: " + error.message,
    });
  }
};

// Admin Email Recovery
module.exports.adminEmailRecovery = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Update email and auto-verify it
    user.email = newEmail;
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Email updated to ${newEmail} and automatically verified.`,
    });
  } catch (error) {
    console.error("Error in admin email recovery:", error);
    return res.status(500).json({ success: false, message: "Failed to update email" });
  }
};
