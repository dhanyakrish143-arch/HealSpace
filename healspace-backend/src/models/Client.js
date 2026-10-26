const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' },
    },
    intakeStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    intakeResponses: {
      medicalHistory: { type: String, default: '' },
      allergiesOrMeds: { type: String, default: '' },
      goals: { type: String, default: '' },
      consentAgreed: { type: Boolean, default: false },
    },
    tags: {
      type: [String],
      default: ['New Client'],
    },
  },
  { timestamps: true }
);

clientSchema.index({ therapist: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Client', clientSchema);