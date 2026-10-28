const express = require("express");
const router = express.Router();
const schedulingController = require("../controllers/schedulingController");

// Query reserved slots: GET /api/scheduling/booked-slots?therapist_slug=dhanya-krishna&date=2026-10-29
router.get("/booked-slots", schedulingController.getBookedSlots);

// Book appointment: POST /api/scheduling/book
router.post("/book", schedulingController.bookAppointment);

module.exports = router;
