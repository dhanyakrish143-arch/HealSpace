const ClinicalNote = require("../models/ClinicalNote");
const Appointment = require("../models/Appointment");

// Get or initialize note for a specific appointment
exports.getNoteByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    let note = await ClinicalNote.findOne({ appointment_id: appointmentId });
    
    if (!note) {
      const app = await Appointment.findById(appointmentId);
      if (!app) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }
      note = {
        appointment_id: app._id,
        therapist_slug: app.therapist_slug,
        client_name: app.client_name,
        client_email: app.client_email,
        subjective: `Patient presented expressing concerns regarding: ${app.presenting_concern || "General anxiety/stress"}.`,
        objective: "Alert, fully oriented, engaged cooperatively in clinical interview.",
        assessment: "Situational adjustment difficulty with anxiety symptoms (ICD-10 F41.1 / GAD evaluation).",
        plan: "Introduce grounding protocols, cognitive reframing, and weekly progress check-in.",
        prescribed_regimen: "1. 4-7-8 Somatic Vagal Breathing: Inhale 4s, Hold 7s, Exhale 8s (2x daily)\n2. Cognitive Thought Record Log for autonomic triggers\n3. Progressive Muscle Relaxation (PMR) prior to sleep",
        is_signed: false
      };
    }

    return res.status(200).json({ success: true, note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Save and digitally sign note -> Unlocks patient prescription
exports.saveNote = async (req, res) => {
  try {
    const {
      appointment_id,
      therapist_slug,
      client_name,
      client_email,
      subjective,
      objective,
      assessment,
      plan,
      prescribed_regimen,
      is_signed
    } = req.body;

    const note = await ClinicalNote.findOneAndUpdate(
      { appointment_id },
      {
        appointment_id,
        therapist_slug: therapist_slug || "dhanya-krishna",
        client_name,
        client_email,
        subjective,
        objective,
        assessment,
        plan,
        prescribed_regimen,
        is_signed: Boolean(is_signed),
        signed_at: is_signed ? new Date() : null
      },
      { upsert: true, new: true }
    );

    // If signed, transition appointment status to "completed" so Rx unlocks
    if (is_signed) {
      await Appointment.findByIdAndUpdate(appointment_id, { status: "completed" });
    }

    return res.status(200).json({ success: true, note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch clinical prescription for patient portal
exports.getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const note = await ClinicalNote.findOne({ appointment_id: appointmentId });
    const isUnlocked = appointment.status === "completed" && note && note.is_signed;

    return res.status(200).json({
      success: true,
      isUnlocked,
      appointment,
      prescription: isUnlocked ? note : null
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
