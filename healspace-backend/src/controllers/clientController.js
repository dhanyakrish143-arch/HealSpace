const Client = require('../models/Client');
const Appointment = require('../models/Appointment');

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ therapist: req.therapist._id }).sort({ updatedAt: -1 });

    const enrichedClients = await Promise.all(
      clients.map(async (c) => {
        const appointmentCount = await Appointment.countDocuments({
          therapist: req.therapist._id,
          clientEmail: c.email,
        });
        return { ...c.toObject(), totalSessions: appointmentCount };
      })
    );

    res.json(enrichedClients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, therapist: req.therapist._id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const sessionHistory = await Appointment.find({
      therapist: req.therapist._id,
      clientEmail: client.email,
    }).sort({ date: -1, time: -1 });

    res.json({ client, sessionHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { phone, emergencyContact, tags, intakeResponses, intakeStatus } = req.body;
    const updated = await Client.findOneAndUpdate(
      { _id: req.params.id, therapist: req.therapist._id },
      { phone, emergencyContact, tags, intakeResponses, intakeStatus },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};