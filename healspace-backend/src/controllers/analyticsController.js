const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');
const Client = require('../models/Client');

// GET /api/analytics/dashboard (Therapist practice KPIs & chart data)
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const therapistId = req.therapist._id;

    // Parallel fetch for KPIs
    const [appointments, payments, totalClients] = await Promise.all([
      Appointment.find({ therapist: therapistId }),
      Payment.find({ therapist: therapistId, status: 'paid' }),
      Client.countDocuments({ therapist: therapistId }),
    ]);

    const totalBookings = appointments.length;
    const completedSessions = appointments.filter((a) => a.status === 'completed').length;
    const cancelledSessions = appointments.filter((a) => a.status === 'cancelled').length;
    const confirmedUpcoming = appointments.filter((a) => a.status === 'confirmed').length;

    const cancellationRate = totalBookings > 0 
      ? Math.round((cancelledSessions / totalBookings) * 100) 
      : 0;

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const avgRevenuePerClient = totalClients > 0 
      ? Math.round(totalRevenue / totalClients) 
      : 0;

    // Day of week distribution for chart
    const dayCounts = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
    
    appointments.forEach((apt) => {
      const dayName = new Date(apt.date + 'T00:00:00Z').toLocaleDateString('en-US', {
        weekday: 'long',
        timeZone: 'UTC',
      });
      if (dayCounts[dayName] !== undefined) {
        dayCounts[dayName]++;
      }
    });

    const weeklyVolume = Object.keys(dayCounts).map((day) => ({
      day: day.slice(0, 3), // "Mon", "Tue"
      fullName: day,
      count: dayCounts[day],
    }));

    res.json({
      summary: {
        totalBookings,
        completedSessions,
        confirmedUpcoming,
        cancelledSessions,
        cancellationRate,
        totalClients,
        totalRevenue,
        avgRevenuePerClient,
        currency: req.therapist.currency || 'USD',
      },
      weeklyVolume,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};