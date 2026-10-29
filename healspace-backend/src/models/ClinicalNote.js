const mongoose = require("mongoose");

const ClinicalNoteSchema = new mongoose.Schema(
  {
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    },
    therapist_slug: {
      type: String,
      required: true,
      index: true
    },
    client_name: {
      type: String,
      required: true
    },
    client_email: {
      type: String,
      required: true,
      index: true
    },
    subjective: {
      type: String,
      default: ""
    },
    objective: {
      type: String,
      default: ""
    },
    assessment: {
      type: String,
      default: ""
    },
    plan: {
      type: String,
      default: ""
    },
    prescribed_regimen: {
      type: String,
      default: "1. 4-7-8 Somatic Vagal Breathing (2x daily)\n2. Thought Record Log for autonomic stress triggers"
    },
    is_signed: {
      type: Boolean,
      default: false
    },
    signed_at: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClinicalNote", ClinicalNoteSchema);
