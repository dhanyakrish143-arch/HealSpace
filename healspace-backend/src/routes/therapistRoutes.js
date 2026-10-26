const express = require('express');
const router = express.Router();
const { getProfileBySlug, updateProfile } = require('../controllers/therapistController');
const protect = require('../middleware/authMiddleware');

router.get('/:slug', getProfileBySlug);
router.put('/me', protect, updateProfile);

module.exports = router;
