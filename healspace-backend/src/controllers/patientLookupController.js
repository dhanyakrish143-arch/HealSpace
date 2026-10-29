const Appointment = require("../models/Appointment");
const ClinicalNote = require("../models/ClinicalNote");

// GET /api/scheduling/patient-records?query=...
exports.lookupPatientRecords = async (req, res) => {
  try {
    const { query, therapist_slug } = req.query;
    if (!query) {
      return res.status(200).json({ success: true, records: [] });
    }

    const cleanQuery = query.trim();
    const slug = therapist_slug || "dhanya-krishna";

    // Match by name, email, or phone
    const appointments = await Appointment.find({
      therapist_slug: slug,
      $or: [
        { client_name: { $regex: cleanQuery, $options: "i" } },
        { client_email: { $regex: cleanQuery, $options: "i" } },
        { client_phone: { $regex: cleanQuery, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });

    // Attach signed clinical note/Rx if available
    const records = await Promise.all(
      appointments.map(async (app) => {
        const note = await ClinicalNote.findOne({ appointment_id: app._id });
        return {
          _id: app._id,
          client_name: app.client_name,
          client_email: app.client_email,
          client_phone: app.client_phone,
          date: app.date,
          slot: app.slot,
          format: app.format,
          amount_paid: app.amount_paid || 700,
          status: app.status,
          isCompleted: app.status === "completed" && note && note.is_signed,
          note: note && note.is_signed ? note : null
        };
      })
    );

    return res.status(200).json({ success: true, records });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
