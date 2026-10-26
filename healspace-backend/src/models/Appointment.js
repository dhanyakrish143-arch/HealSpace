const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    time: {
      type: String, // "09:00"
      required: true,
    },
    duration: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    meetingLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent therapist double-booking on same date & time (unless cancelled)
appointmentSchema.index(
  { therapist: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);