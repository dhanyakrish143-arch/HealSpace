const Appointment = require("../models/Appointment");

// 1. Fetch all appointments & clients dynamically
exports.getAllAppointments = async (req, res) => {
  try {
    const therapist_slug = req.query.therapist_slug || "dhanya-krishna";
    const appointments = await Appointment.find({ therapist_slug }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. MongoDB Aggregation Analytics Engine (Module 7 Specification)
exports.getAnalytics = async (req, res) => {
  try {
    const therapist_slug = req.query.therapist_slug || "dhanya-krishna";

    const totalStats = await Appointment.aggregate([
      { $match: { therapist_slug } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount_paid" },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    const formatBreakdown = await Appointment.aggregate([
      { $match: { therapist_slug } },
      {
        $group: {
          _id: "$format",
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = totalStats[0] || { totalRevenue: 0, totalBookings: 0 };

    return res.status(200).json({
      success: true,
      analytics: {
        totalBookings: stats.totalBookings,
        grossRevenue: stats.totalRevenue,
        attendanceRate: stats.totalBookings > 0 ? "100%" : "0%",
        formats: formatBreakdown
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
