const Therapist = require('../models/Therapist');

exports.getProfileBySlug = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({ slug: req.params.slug }).select('-password_hash');
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist profile not found' });
    }
    res.json(therapist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { bio, specializations, languages, sessionRate, currency } = req.body;
    const updated = await Therapist.findByIdAndUpdate(
      req.therapist._id,
      { bio, specializations, languages, sessionRate, currency },
      { returnDocument: 'after', runValidators: true }
    ).select('-password_hash');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};