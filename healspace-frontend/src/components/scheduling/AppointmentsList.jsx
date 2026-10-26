import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import SoapNoteModal from '../notes/SoapNoteModal';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAppointmentForNote, setActiveAppointmentForNote] = useState(null);

  const fetchData = async () => {
    try {
      const [aptRes, clientRes] = await Promise.all([
        axiosInstance.get('/appointments/me'),
        axiosInstance.get('/clients'),
      ]);
      setAppointments(aptRes.data);
      setClients(clientRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.patch(`/appointments/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getClientForAppointment = (email) => {
    return clients.find((c) => c.email.toLowerCase() === email?.toLowerCase());
  };

  if (loading) return <div className="p-4 text-slate-500">Loading appointments...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Your Appointments</h2>
          <p className="text-sm text-slate-500">Manage client bookings, launch video rooms, and document SOAP notes.</p>
        </div>
        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
          {appointments.length} Total Booked
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No appointments booked yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">Client</th>
                <th className="py-3 px-2">Date & Time</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Video Room</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-2">
                    <p className="font-semibold text-slate-800">{apt.clientName}</p>
                    <p className="text-xs text-slate-500">{apt.clientEmail}</p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-medium text-slate-700">{apt.date}</p>
                    <p className="text-xs text-slate-500">{apt.time} ({apt.duration} min)</p>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {apt.meetingLink ? (
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-600 hover:underline font-mono inline-flex items-center gap-1"
                      >
                        Join Room ↗
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button
                      onClick={() => setActiveAppointmentForNote(apt)}
                      className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded hover:bg-emerald-100 font-medium"
                    >
                      📝 SOAP Note
                    </button>
                    {apt.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(apt._id, 'completed')}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt._id, 'cancelled')}
                          className="text-xs text-rose-600 hover:underline font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeAppointmentForNote && (
        <SoapNoteModal
          appointment={activeAppointmentForNote}
          client={getClientForAppointment(activeAppointmentForNote.clientEmail)}
          onClose={() => setActiveAppointmentForNote(null)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}