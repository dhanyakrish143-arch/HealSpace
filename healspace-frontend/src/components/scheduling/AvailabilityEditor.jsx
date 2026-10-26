import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function AvailabilityEditor() {
  const [availability, setAvailability] = useState(null);
  const [profile, setProfile] = useState({ sessionRate: 50, currency: 'USD' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/availability/me'),
      axiosInstance.get('/therapist/me').catch(() => null),
    ])
      .then(([availRes, profileRes]) => {
        setAvailability(availRes.data);
        if (profileRes?.data) {
          setProfile({
            sessionRate: profileRes.data.sessionRate || 50,
            currency: profileRes.data.currency || 'USD',
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSlotChange = (index, field, value) => {
    const updated = { ...availability };
    updated.weeklySlots[index][field] = value;
    setAvailability(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await Promise.all([
        axiosInstance.put('/availability/me', availability),
        axiosInstance.put('/therapist/me', {
          sessionRate: profile.sessionRate,
          currency: profile.currency,
        }),
      ]);
      setMessage('Settings & Session Rates saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="p-4 text-slate-500">Loading schedule...</div>;
  if (!availability) return <div className="p-4 text-red-500">Could not load schedule.</div>;

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Working Hours & Session Pricing</h2>
          <p className="text-sm text-slate-500">Configure appointment buffers, working hours, and billing rates.</p>
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition"
        >
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
          {message}
        </div>
      )}

      {/* Pricing Configuration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
        <div>
          <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Session Rate</label>
          <input
            type="number"
            min={0}
            value={profile.sessionRate}
            onChange={(e) => setProfile({ ...profile, sessionRate: Number(e.target.value) })}
            className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Billing Currency</label>
          <select
            value={profile.currency}
            onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
            className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-sm font-semibold"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      {/* Preferences row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Session Duration</label>
          <select
            value={availability.slotDuration}
            onChange={(e) => setAvailability({ ...availability, slotDuration: Number(e.target.value) })}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Buffer Between Sessions</label>
          <select
            value={availability.bufferTime}
            onChange={(e) => setAvailability({ ...availability, bufferTime: Number(e.target.value) })}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
          >
            <option value={0}>No buffer</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Timezone</label>
          <input
            type="text"
            value={availability.timezone}
            onChange={(e) => setAvailability({ ...availability, timezone: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      {/* Weekly Days List */}
      <div className="space-y-3">
        {availability.weeklySlots.map((slot, index) => (
          <div key={slot.day} className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition">
            <div className="flex items-center gap-3 w-36">
              <input
                type="checkbox"
                id={`check-${slot.day}`}
                checked={slot.isActive}
                onChange={(e) => handleSlotChange(index, 'isActive', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor={`check-${slot.day}`} className={`font-medium text-sm ${slot.isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                {slot.day}
              </label>
            </div>

            {slot.isActive ? (
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                  className="border border-slate-300 rounded-lg p-1.5"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                  className="border border-slate-300 rounded-lg p-1.5"
                />
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic font-medium">Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </form>
  );
}