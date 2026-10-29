const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

router.get("/appointment/:appointmentId", notesController.getNoteByAppointment);
router.post("/save", notesController.saveNote);
router.get("/rx/:appointmentId", notesController.getPrescriptionByAppointment);

module.exports = router;
