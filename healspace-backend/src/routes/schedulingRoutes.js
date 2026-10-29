const express = require("express");
const router = express.Router();
const schedulingController = require("../controllers/schedulingController");
const dashboardController = require("../controllers/dashboardController");
const patientLookupController = require("../controllers/patientLookupController");

// Booking flow
router.get("/booked-slots", schedulingController.getBookedSlots);
router.post("/book", schedulingController.bookAppointment);

// Live Doctor Dashboard data
router.get("/appointments", dashboardController.getAllAppointments);
router.get("/analytics", dashboardController.getAnalytics);

// Dynamic Patient Retrieval for Prescriptions & Receipts
router.get("/patient-records", patientLookupController.lookupPatientRecords);

module.exports = router;
