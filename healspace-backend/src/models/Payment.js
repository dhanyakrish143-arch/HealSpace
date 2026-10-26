const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    therapist_slug: { type: String, required: true, index: true },
    appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    client_name: { type: String, required: true },
    client_email: { type: String, required: true },
    client_phone: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    gateway_order_id: { type: String, required: true },
    gateway_payment_id: { type: String },
    gateway_signature: { type: String },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },
    invoice_number: { type: String },
    invoice_url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
