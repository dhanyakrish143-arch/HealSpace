import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function SoapNoteModal({ appointment, client, onClose, onSaved }) {
  const [noteId, setNoteId] = useState(null);
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        if (appointment?._id) {
          const res = await axiosInstance.get(`/notes/appointment/${appointment._id}`);
          if (res.data) {
            setNoteId(res.data._id);
            setSubjective(res.data.subjective || '');
            setObjective(res.data.objective || '');
            setAssessment(res.data.assessment || '');
            setPlan(res.data.plan || '');
            setIsDraft(res.data.isDraft);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [appointment]);

  const handleSave = async (draftState) => {
    setSaving(true);
    try {
      const payload = {
        clientId: client?._id,
        appointmentId: appointment?._id,
        sessionDate: appointment?.date || new Date().toISOString().split('T')[0],
        subjective,
        objective,
        assessment,
        plan,
        isDraft: draftState,
      };

      if (noteId) {
        await axiosInstance.put(`/notes/${noteId}`, payload);
      } else {
        const res = await axiosInstance.post('/notes', payload);
        setNoteId(res.data._id);
      }

      setIsDraft(draftState);
      if (onSaved) onSaved();
      if (!draftState) onClose();
    } catch (err) {
      alert('Error saving note: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Clinical SOAP Note - ${client?.name || appointment?.clientName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 24px; }
            .title { font-size: 22px; font-weight: bold; color: #0f172a; }
            .meta { font-size: 13px; color: #64748b; margin-top: 6px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 13px; font-weight: bold; color: #059669; text-transform: uppercase; margin-bottom: 6px; }
            .section-body { font-size: 14px; line-height: 1.6; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; white-space: pre-wrap; }
            .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Clinical SOAP Note</div>
            <div class="meta">
              <strong>Client:</strong> ${client?.name || appointment?.clientName} (${client?.email || appointment?.clientEmail}) | 
              <strong>Session Date:</strong> ${appointment?.date || 'N/A'} | 
              <strong>Status:</strong> ${isDraft ? 'DRAFT' : 'FINALIZED'}
            </div>
          </div>
          <div class="section">
            <div class="section-title">S — Subjective</div>
            <div class="section-body">${subjective || 'None recorded.'}</div>
          </div>
          <div class="section">
            <div class="section-title">O — Objective</div>
            <div class="section-body">${objective || 'None recorded.'}</div>
          </div>
          <div class="section">
            <div class="section-title">A — Assessment</div>
            <div class="section-body">${assessment || 'None recorded.'}</div>
          </div>
          <div class="section">
            <div class="section-title">P — Plan</div>
            <div class="section-body">${plan || 'None recorded.'}</div>
          </div>
          <div class="footer">
            HealSpace Clinical Record • Generated ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">Clinical SOAP Note</h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDraft ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isDraft ? 'Draft' : 'Finalized'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Client: <strong className="text-slate-700">{client?.name || appointment?.clientName}</strong> • Session Date: {appointment?.date || 'Today'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl font-bold">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading note...</div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
              <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">
                S — Subjective
              </label>
              <textarea
                rows={3}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder="Client reports feeling heightened anxiety..."
                className="w-full text-sm outline-none resize-y"
              />
            </div>

            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
              <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">
                O — Objective
              </label>
              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Maintains calm posture, alert and oriented x4..."
                className="w-full text-sm outline-none resize-y"
              />
            </div>

            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
              <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">
                A — Assessment
              </label>
              <textarea
                rows={3}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Showing improved cognitive reframing..."
                className="w-full text-sm outline-none resize-y"
              />
            </div>

            <div className="border border-slate-200 rounded-xl p-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
              <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">
                P — Plan
              </label>
              <textarea
                rows={3}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Continue daily 4-7-8 breathing exercises..."
                className="w-full text-sm outline-none resize-y"
              />
            </div>
          </div>
        )}

        <div className="p-4 border-t bg-slate-50 rounded-b-2xl flex justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-300 rounded-lg"
            >
              📄 Export PDF
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(true)}
              className="px-4 py-2 text-sm font-medium border border-slate-300 hover:bg-white bg-slate-100 rounded-lg text-slate-700"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-medium rounded-lg shadow-sm"
            >
              Finalize Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}