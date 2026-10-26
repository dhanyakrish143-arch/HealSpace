const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    specializations: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    sessionRate: {
      type: Number,
      default: 50, // default price per session
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'INR', 'EUR', 'GBP'],
    },
    tier: {
      type: String,
      enum: ['free', 'pro', 'elite'],
      default: 'free',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Therapist', therapistSchema);