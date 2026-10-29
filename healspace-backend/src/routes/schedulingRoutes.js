const express = require("express");
const router = express.Router();
const schedulingController = require("../controllers/schedulingController");
const dashboardController = require("../controllers/dashboardController");

// Booking flow
router.get("/booked-slots", schedulingController.getBookedSlots);
router.post("/book", schedulingController.bookAppointment);

// Live Doctor Dashboard data
router.get("/appointments", dashboardController.getAllAppointments);
router.get("/analytics", dashboardController.getAnalytics);

module.exports = router;
