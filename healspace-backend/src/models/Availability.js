const mongoose = require('mongoose');

const weeklySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: { type: String, required: true }, // "09:00" (24h)
  endTime: { type: String, required: true },   // "17:00" (24h)
  isActive: { type: Boolean, default: true },
});

const availabilitySchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
      unique: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    slotDuration: {
      type: Number,
      enum: [30, 45, 60, 90],
      default: 60, // in minutes
    },
    bufferTime: {
      type: Number,
      default: 10, // in minutes
    },
    weeklySlots: {
      type: [weeklySlotSchema],
      default: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Friday', startTime: '09:00', endTime: '17:00', isActive: true },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: false },
        { day: 'Sunday', startTime: '10:00', endTime: '14:00', isActive: false },
      ],
    },
    blockedDates: {
      type: [String], // Array of "YYYY-MM-DD"
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);