const Therapist = require('../models/Therapist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'healspace_jwt_secret_key_2026', {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, slug } = req.body;
    if (!name || !email || !password || !slug) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const existingTherapist = await Therapist.findOne({
      $or: [{ email: email.toLowerCase() }, { slug: slug.toLowerCase() }],
    });
    if (existingTherapist) {
      return res.status(400).json({ error: 'Email or slug is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const therapist = await Therapist.create({
      name,
      email: email.toLowerCase(),
      password_hash,
      slug: slug.toLowerCase(),
    });

    const token = generateToken(therapist._id);
    res.status(201).json({
      token,
      therapist: {
        _id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter email and password' });
    }

    const therapist = await Therapist.findOne({ email: email.toLowerCase() });
    if (!therapist) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const storedHash = therapist.password_hash || therapist.password;
    if (!storedHash) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, storedHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(therapist._id);
    res.json({
      token,
      therapist: {
        _id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  registerTherapist: register,
  loginTherapist: login,
};