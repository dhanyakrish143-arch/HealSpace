const jwt = require('jsonwebtoken');
const Therapist = require('../models/Therapist');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.therapist = await Therapist.findById(decoded.id).select('-password_hash');
      if (!req.therapist) {
        return res.status(401).json({ error: 'User no longer exists' });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }
  }
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

module.exports = protect;
