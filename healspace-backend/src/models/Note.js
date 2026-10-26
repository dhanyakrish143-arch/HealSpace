const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    sessionDate: {
      type: String,
      required: true,
    },
    subjective: {
      type: String,
      default: '',
    },
    objective: {
      type: String,
      default: '',
    },
    assessment: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      default: '',
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);