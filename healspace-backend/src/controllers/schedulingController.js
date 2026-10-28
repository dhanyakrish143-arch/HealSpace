const Appointment = require("../models/Appointment");

// 1. Get all booked/reserved slots for a specific therapist on a date
exports.getBookedSlots = async (req, res) => {
  try {
    const { therapist_slug, date } = req.query;

    if (!therapist_slug || !date) {
      return res.status(400).json({ success: false, message: "therapist_slug and date are required" });
    }

    const booked = await Appointment.find({
      therapist_slug,
      date,
      status: { $ne: "cancelled" }
    }).select("slot -_id");

    const slots = booked.map((app) => app.slot);
    return res.status(200).json({ success: true, bookedSlots: slots });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Book a slot with collision and double-booking prevention
exports.bookAppointment = async (req, res) => {
  try {
    const {
      therapist_slug,
      client_name,
      client_email,
      client_phone,
      date,
      slot,
      duration,
      format,
      presenting_concern,
      amount_paid
    } = req.body;

    if (!therapist_slug || !date || !slot || !client_name || !client_email) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details (therapist_slug, date, slot, client_name, client_email)"
      });
    }

    // Collision check: prevent two patients from booking the exact same time
    const existingAppointment = await Appointment.findOne({
      therapist_slug,
      date,
      slot,
      status: { $ne: "cancelled" }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: `The slot ${slot} on ${date} is already reserved by another patient. Please select a different time.`
      });
    }

    const newAppointment = await Appointment.create({
      therapist_slug,
      client_name,
      client_email,
      client_phone,
      date,
      slot,
      duration: duration || 45,
      format: format || "teletherapy",
      presenting_concern: presenting_concern || "",
      amount_paid: amount_paid || 700,
      status: "confirmed"
    });

    return res.status(201).json({
      success: true,
      message: "Appointment confirmed successfully",
      appointment: newAppointment
    });
  } catch (error) {
    // Catch MongoDB duplicate key error (code 11000) if two requests arrive simultaneously
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `The slot ${req.body.slot} on ${req.body.date} was just claimed. Please choose another slot.`
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};
