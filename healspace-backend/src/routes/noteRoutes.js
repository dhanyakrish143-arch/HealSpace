const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

// Therapist routes
router.post("/save", noteController.saveNote);
router.get("/therapist", noteController.getTherapistNotes);

// Public / Client portal route (Hardened role-restricted projection)
router.get("/client-shared", noteController.getClientSharedNotes);

module.exports = router;
