const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const therapistRoutes = require('./src/routes/therapistRoutes');
const availabilityRoutes = require('./src/routes/availabilityRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/therapist', therapistRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HealSpace API is live' });
});

module.exports = app;