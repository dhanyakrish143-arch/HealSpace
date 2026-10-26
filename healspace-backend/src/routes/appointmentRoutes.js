const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Analytics aggregation endpoint
router.get("/analytics", appointmentController.getAnalytics);

// Booking endpoint
if (typeof appointmentController.bookAppointment === "function") {
  router.post("/book", appointmentController.bookAppointment);
} else if (typeof appointmentController.createAppointment === "function") {
  router.post("/book", appointmentController.createAppointment);
}

module.exports = router;