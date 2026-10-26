const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getMyAvailability,
  updateMyAvailability,
  getPublicSlotsByDate,
} = require('../controllers/availabilityController');

router.get('/me', protect, getMyAvailability);
router.put('/me', protect, updateMyAvailability);
router.get('/public/:slug', getPublicSlotsByDate);

module.exports = router;