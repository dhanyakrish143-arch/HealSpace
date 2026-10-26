const SessionNote = require("../models/SessionNote");

// 1. Therapist creates or updates a note (private or shared)
exports.saveNote = async (req, res) => {
  try {
    const { therapist_slug = "dhanya-krishna", client_name, client_email, type, soap, shared_content } = req.body;

    const note = new SessionNote({
      therapist_slug,
      client_name,
      client_email,
      type: type || "private",
      soap: type === "private" ? soap : undefined,
      shared_content: type === "shared" ? shared_content : undefined,
    });

    await note.save();
    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ error: "Failed to store clinical documentation" });
  }
};

// 2. Therapist retrieves all notes (Includes both private & shared)
exports.getTherapistNotes = async (req, res) => {
  try {
    const notes = await SessionNote.find({ therapist_slug: "dhanya-krishna" }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch therapist notes" });
  }
};

// 3. Client Portal Route: STRICTLY filters out private notes at the DB query level
exports.getClientSharedNotes = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email parameter required for records lookup" });
    }

    // CRITICAL SECURITY RULE: Only query notes where type === 'shared'
    // Private SOAP fields are stripped by projection
    const sharedNotes = await SessionNote.find(
      { client_email: email.toLowerCase(), type: "shared" },
      "-soap"
    ).sort({ createdAt: -1 });

    res.status(200).json(sharedNotes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shared records" });
  }
};
