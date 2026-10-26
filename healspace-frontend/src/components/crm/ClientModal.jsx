import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function ClientModal({ clientId, onClose, onUpdate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [intakeStatus, setIntakeStatus] = useState('pending');

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    axiosInstance.get(`/clients/${clientId}`)
      .then((res) => {
        setData(res.data);
        const c = res.data.client;
        setPhone(c.phone || '');
        setTags((c.tags || []).join(', '));
        setEmergencyName(c.emergencyContact?.name || '');
        setEmergencyPhone(c.emergencyContact?.phone || '');
        setEmergencyRelation(c.emergencyContact?.relation || '');
        setIntakeStatus(c.intakeStatus || 'pending');
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [clientId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/clients/${clientId}`, {
        phone,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relation: emergencyRelation,
        },
        intakeStatus,
      });
      setSaving(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      alert('Failed to save client details: ' + (err.response?.data?.error || err.message));
      setSaving(false);
    }
  };

  if (!clientId) return null;
  const intake = data?.client?.intakeResponses;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{data?.client?.name || 'Client Details'}</h2>
            <p className="text-sm text-slate-500">{data?.client?.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-center py-8 text-slate-400 text-sm">Loading client data...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Intake Status</label>
                <select
                  value={intakeStatus}
                  onChange={(e) => setIntakeStatus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Anxiety, Weekly, High Priority"
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
            </div>

            {/* Intake Responses Inspection */}
            {intake && (
              <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl p-4 space-y-2 text-xs">
                <h3 className="font-bold text-emerald-800 uppercase tracking-wider text-[11px]">Intake Responses</h3>
                <div>
                  <span className="font-semibold text-slate-600">Therapy Goals: </span>
                  <span className="text-slate-800">{intake.goals || 'None recorded'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Medical / Meds: </span>
                  <span className="text-slate-800">{intake.allergiesOrMeds || 'None recorded'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Consent Agreed: </span>
                  <span className={intake.consentAgreed ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                    {intake.consentAgreed ? 'Yes (Signed electronically)' : 'No'}
                  </span>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="border rounded p-1.5 text-xs"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="border rounded p-1.5 text-xs"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="border rounded p-1.5 text-xs"
                />
              </div>
            </div>

            {/* Past Sessions List */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Appointment History</h3>
              {data?.sessionHistory?.length === 0 ? (
                <p className="text-xs text-slate-400">No session history found.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {data?.sessionHistory?.map((s) => (
                    <div key={s._id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded">
                      <div>
                        <span className="font-semibold text-slate-700">{s.date}</span> at {s.time}
                        {s.notes && <p className="text-slate-500 italic mt-0.5 font-normal">"{s.notes}"</p>}
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Client Record'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}