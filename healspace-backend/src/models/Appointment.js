const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    therapist_slug: { type: String, required: true, trim: true },
    client_name: { type: String, required: true },
    client_email: { type: String, required: true },
    client_phone: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    slot: { type: String, required: true }, // e.g., "09:00 AM"
    duration: { type: Number, default: 45 },
    format: { type: String, enum: ["clinic", "teletherapy"], default: "teletherapy" },
    presenting_concern: { type: String, default: "" },
    status: {
      type: String,
      enum: ["confirmed", "pending_payment", "cancelled", "completed"],
      default: "confirmed"
    },
    payment_id: { type: String, default: null },
    amount_paid: { type: Number, default: 700 }
  },
  { timestamps: true }
);

// Crucial: Compound index to guarantee double-booking prevention at DB level
appointmentSchema.index(
  { therapist_slug: 1, date: 1, slot: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
