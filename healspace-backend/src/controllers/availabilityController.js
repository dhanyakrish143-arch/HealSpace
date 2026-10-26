const Availability = require('../models/Availability');
const Therapist = require('../models/Therapist');
const Appointment = require('../models/Appointment');
const { generateSlotsForDay } = require('../utils/slotGenerator');

exports.getMyAvailability = async (req, res) => {
  try {
    let availability = await Availability.findOne({ therapist: req.therapist._id });
    if (!availability) {
      availability = await Availability.create({ therapist: req.therapist._id });
    }
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMyAvailability = async (req, res) => {
  try {
    const { timezone, slotDuration, bufferTime, weeklySlots, blockedDates } = req.body;

    const updated = await Availability.findOneAndUpdate(
      { therapist: req.therapist._id },
      { timezone, slotDuration, bufferTime, weeklySlots, blockedDates },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicSlotsByDate = async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    const therapist = await Therapist.findOne({ slug });
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    const availability = await Availability.findOne({ therapist: therapist._id });
    if (!availability) {
      return res.json({ date, slots: [] });
    }

    if (availability.blockedDates.includes(date)) {
      return res.json({ date, slots: [] });
    }

    const dayName = new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'UTC',
    });

    const dayConfig = availability.weeklySlots.find((d) => d.day === dayName);
    if (!dayConfig || !dayConfig.isActive) {
      return res.json({ date, slots: [] });
    }

    const rawSlots = generateSlotsForDay(
      dayConfig.startTime,
      dayConfig.endTime,
      availability.slotDuration,
      availability.bufferTime
    );

    const bookedAppointments = await Appointment.find({
      therapist: therapist._id,
      date,
      status: { $ne: 'cancelled' },
    }).select('time');

    const bookedTimes = new Set(bookedAppointments.map((a) => a.time));
    const availableSlots = rawSlots.filter((time) => !bookedTimes.has(time));

    res.json({
      date,
      day: dayName,
      timezone: availability.timezone,
      slotDuration: availability.slotDuration,
      slots: availableSlots,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};