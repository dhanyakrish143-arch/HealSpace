const mongoose = require("mongoose");

const sessionNoteSchema = new mongoose.Schema(
  {
    therapist_slug: { type: String, required: true, index: true },
    client_name: { type: String, required: true },
    client_email: { type: String, required: true, index: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    type: {
      type: String,
      enum: ["private", "shared"],
      required: true,
      default: "private",
    },
    title: { type: String, default: "Clinical Record" },
    // Private SOAP fields (Therapist only)
    soap: {
      subjective: { type: String, default: "" },
      objective: { type: String, default: "" },
      assessment: { type: String, default: "" },
      plan: { type: String, default: "" },
    },
    // Shared therapeutic fields (Exposed to Client Portal)
    shared_content: {
      dx: { type: String, default: "" },
      regimen: { type: String, default: "" },
      lifestyle: { type: String, default: "" },
      next_review: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SessionNote", sessionNoteSchema);
