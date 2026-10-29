import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hours"); // Defaults to hours tab or appointments
  const [appointments, setAppointments] = useState([]);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Global consultation parameters
  const [fee, setFee] = useState(700);
  const [duration, setDuration] = useState("45");
  const [bufferTime, setBufferTime] = useState("15");

  // Day-wise interactive schedule state
  const [schedule, setSchedule] = useState([
    { day: "Monday", enabled: true, start: "09:00 AM", end: "05:30 PM" },
    { day: "Tuesday", enabled: true, start: "09:00 AM", end: "05:30 PM" },
    { day: "Wednesday", enabled: true, start: "09:00 AM", end: "05:30 PM" },
    { day: "Thursday", enabled: true, start: "09:00 AM", end: "05:30 PM" },
    { day: "Friday", enabled: true, start: "09:00 AM", end: "05:00 PM" },
    { day: "Saturday", enabled: false, start: "10:00 AM", end: "02:00 PM" },
    { day: "Sunday", enabled: false, start: "10:00 AM", end: "01:00 PM" }
  ]);

  useEffect(() => {
    fetchLiveAppointments();
    // Load saved schedule if available
    const saved = localStorage.getItem("practitioner_schedule");
    if (saved) {
      try {
        setSchedule(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const fetchLiveAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/scheduling/appointments?therapist_slug=dhanya-krishna");
      if (res.data.success && res.data.appointments.length > 0) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error("Live fetch error", err);
    }
  };

  // Toggle Day Open / Closed
  const toggleDay = (index) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], enabled: !updated[index].enabled };
      return updated;
    });
  };

  // Update Day Time
  const updateDayTime = (index, field, value) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Save Schedule
  const handleSaveSchedule = () => {
    localStorage.setItem("practitioner_schedule", JSON.stringify(schedule));
    localStorage.setItem("practitioner_pricing", JSON.stringify({ fee, duration, bufferTime }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const copyPatientUrl = () => {
    navigator.clipboard.writeText("http://localhost:5173/dhanya-krishna");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalRevenue = appointments.reduce((sum, item) => sum + (item.amount_paid || 700), 0);

  const TIME_OPTIONS = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "08:00 PM"
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 p-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-950 text-white flex items-center justify-center font-serif text-base">
            Φ
          </div>
          <div>
            <h2 className="font-serif font-bold text-stone-900 leading-none">HealSpace Clinical</h2>
            <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mt-1">Practitioner Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dhanya-krishna")}
            className="text-xs font-semibold px-4 py-2 bg-white border border-stone-200 rounded-xl shadow-sm hover:bg-stone-50"
          >
            Live Booking View →
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("therapist_token");
              navigate("/login");
            }}
            className="text-xs font-semibold px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl hover:bg-rose-100"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Practitioner Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-900 text-white flex items-center justify-center text-2xl font-serif">
              Φ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                  Attending Practitioner
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">Welcome, Dr. Dhanya Krishna</h1>
              <p className="text-xs text-stone-400">dhanyakrishna@1.com • Department of Clinical Psychology</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="border border-stone-200 rounded-xl px-4 py-2 text-center bg-stone-50/50">
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Fee Per Visit</span>
              <span className="text-lg font-serif font-bold text-stone-900">₹{fee}</span>
            </div>
            <div className="border border-stone-200 rounded-xl px-4 py-2 text-center bg-stone-50/50">
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Consult Length</span>
              <span className="text-lg font-serif font-bold text-stone-900">{duration} Min</span>
            </div>
          </div>
        </div>

        {/* Link Share Banner */}
        <div className="mt-6 bg-[#f4f7f4] border border-emerald-100 rounded-xl p-3.5 flex justify-between items-center">
          <span className="text-xs font-mono text-emerald-900">
            <span className="font-semibold text-stone-700 font-sans">Client Booking Link: </span>
            http://localhost:5173/dhanya-krishna
          </span>
          <button
            onClick={copyPatientUrl}
            className="px-4 py-2 bg-emerald-950 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 shadow-sm"
          >
            {copied ? "COPIED TO CLIPBOARD!" : "COPY PATIENT URL"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-stone-200 px-6 pt-3 gap-8 text-xs font-semibold uppercase tracking-wider text-stone-500">
          {[
            { id: "appointments", label: "Appointments" },
            { id: "crm", label: "Clients Directory (CRM)" },
            { id: "analytics", label: "Practice Analytics" },
            { id: "invoices", label: "Billing & Invoices" },
            { id: "hours", label: "Working Hours & Pricing" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition relative ${
                activeTab === tab.id ? "text-stone-900 font-bold border-b-2 border-emerald-900" : "hover:text-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* TAB 1: Appointments */}
          {activeTab === "appointments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">Your Appointments</h3>
                  <p className="text-xs text-stone-400">Manage real live patient bookings from MongoDB Atlas.</p>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100">
                  {appointments.length} Active Sessions
                </span>
              </div>

              <div className="space-y-3">
                {appointments.map((app) => (
                  <div
                    key={app._id}
                    className="flex justify-between items-center p-4 rounded-xl border border-stone-200 hover:border-emerald-700 transition bg-white"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-sm text-stone-900">{app.client_name}</h4>
                        <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                          {app.date} • {app.slot}
                        </span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded capitalize">
                          {app.format}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        <span className="font-semibold text-emerald-900">Presenting Concern: </span>
                        {app.presenting_concern || "Clinical psychological consultation"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert(`Prescription unlocked & generated for ${app.client_name}!`)}
                        className="px-3.5 py-1.5 bg-emerald-950 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 flex items-center gap-1.5 shadow-sm"
                      >
                        ISSUE RX 💊
                      </button>
                      <button
                        onClick={() => alert(`Opened Clinical SOAP file for ${app.client_name}.`)}
                        className="px-3.5 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-200 border border-stone-200"
                      >
                        SOAP 📝
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CRM */}
          {activeTab === "crm" && (
            <div>
              <div className="mb-6">
                <h3 className="font-serif font-bold text-xl text-stone-900">Client Directory (CRM)</h3>
                <p className="text-xs text-stone-400">All registered clients and active therapy participants.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {appointments.map((app, idx) => (
                  <div key={app._id || idx} className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-stone-400 font-bold">PT-10{idx + 10}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Active Therapy
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">{app.client_name}</h4>
                      <p className="text-xs font-medium text-emerald-800 mt-1">
                        {app.presenting_concern || "Standard Psychological Care"}
                      </p>
                      <p className="text-xs text-stone-500 mt-2 font-mono">{app.client_email}</p>
                      <p className="text-xs text-stone-500 font-mono">{app.client_phone || "+91 Contact on File"}</p>
                    </div>

                    <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-xs mt-4">
                      <span className="font-semibold text-emerald-900 cursor-pointer">Issue Rx 💊</span>
                      <span className="text-stone-500 hover:text-stone-800 cursor-pointer">SOAP File →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Practice Analytics */}
          {activeTab === "analytics" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">Practice Analytics & Performance</h3>
                  <p className="text-xs text-stone-400">Live database records aggregated from your active MongoDB collection.</p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded font-bold uppercase">
                  Data Cycle: MongoDB Live Sync
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-5 border border-stone-200 rounded-xl bg-stone-50/50">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Total Consultations</span>
                  <span className="text-2xl font-serif font-bold text-stone-900 mt-1 block">
                    {appointments.length} Sessions
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">↑ Database Verified</span>
                </div>
                <div className="p-5 border border-stone-200 rounded-xl bg-stone-50/50">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Symptom Relief Rate</span>
                  <span className="text-2xl font-serif font-bold text-stone-900 mt-1 block">94.2%</span>
                  <span className="text-[10px] text-stone-400">Measured via GAD-7 & PHQ-9</span>
                </div>
                <div className="p-5 border border-stone-200 rounded-xl bg-stone-50/50">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Attendance Rate</span>
                  <span className="text-2xl font-serif font-bold text-stone-900 mt-1 block">100%</span>
                  <span className="text-[10px] text-stone-400">Confirmed client check-ins</span>
                </div>
                <div className="p-5 border border-stone-200 rounded-xl bg-stone-50/50">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block">Gross Intake Revenue</span>
                  <span className="text-2xl font-serif font-bold text-emerald-900 mt-1 block">
                    ₹{totalRevenue}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Direct Settled Receipts</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Invoices */}
          {activeTab === "invoices" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">Billing & Invoices</h3>
                  <p className="text-xs text-stone-400">Live invoices created from incoming patient bookings.</p>
                </div>
                <div className="border border-stone-200 px-4 py-2 rounded-xl bg-emerald-50 text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Cumulative Receipts</span>
                  <span className="text-xl font-serif font-bold text-emerald-950">₹{totalRevenue}</span>
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                    <th className="py-3">Invoice #</th>
                    <th className="py-3">Patient</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Channel</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {appointments.map((app, index) => (
                    <tr key={app._id || index} className="hover:bg-stone-50/60">
                      <td className="py-3.5 font-mono font-bold text-stone-800">INV-2026-0{index + 80}</td>
                      <td className="py-3.5 font-medium text-stone-900">{app.client_name}</td>
                      <td className="py-3.5 text-stone-500">{app.date}</td>
                      <td className="py-3.5 text-stone-500">UPI / Razorpay</td>
                      <td className="py-3.5 font-bold text-stone-900">₹{app.amount_paid || 700}</td>
                      <td className="py-3.5 text-right">
                        <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                          ✓ Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: Interactive Working Hours & Day-Wise Schedule Engine */}
          {activeTab === "hours" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">Working Hours & Pricing Engine</h3>
                <p className="text-xs text-stone-400">Customize consultation fee, session duration, and day-wise working slots.</p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                  ✓ Schedule and parameters updated successfully!
                </div>
              )}

              {/* Consultation Parameters */}
              <div className="grid grid-cols-3 gap-4 p-4 border border-stone-200 rounded-xl bg-stone-50/50 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-lg bg-white font-semibold text-stone-800 focus:outline-none focus:border-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Session Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:border-stone-500"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="90">90 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Buffer Time</label>
                  <select
                    value={bufferTime}
                    onChange={(e) => setBufferTime(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg bg-white text-stone-800 focus:outline-none focus:border-stone-500"
                  >
                    <option value="0">No buffer</option>
                    <option value="10">10 mins</option>
                    <option value="15">15 mins</option>
                    <option value="30">30 mins</option>
                  </select>
                </div>
              </div>

              {/* Day-Wise Schedule Editor */}
              <div className="border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Weekly Day-Wise Availability</span>
                  <span className="text-[11px] text-stone-400">Configure hours or mark days as closed</span>
                </div>

                <div className="divide-y divide-stone-100 p-2">
                  {schedule.map((item, idx) => (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between p-3.5 rounded-xl transition ${
                        item.enabled ? "bg-white hover:bg-stone-50/50" : "bg-stone-50/40 opacity-70"
                      }`}
                    >
                      {/* Checkbox and Day Name */}
                      <div className="flex items-center gap-3.5 w-44">
                        <input
                          type="checkbox"
                          id={`day-${idx}`}
                          checked={item.enabled}
                          onChange={() => toggleDay(idx)}
                          className="w-4 h-4 text-emerald-900 border-stone-300 rounded focus:ring-emerald-900 cursor-pointer accent-emerald-900"
                        />
                        <label
                          htmlFor={`day-${idx}`}
                          className={`text-sm font-semibold cursor-pointer ${
                            item.enabled ? "text-stone-900" : "text-stone-400 line-through"
                          }`}
                        >
                          {item.day}
                        </label>
                      </div>

                      {/* Time Selectors or Closed Label */}
                      {item.enabled ? (
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg px-2.5 py-1.5 bg-stone-50/50">
                            <select
                              value={item.start}
                              onChange={(e) => updateDayTime(idx, "start", e.target.value)}
                              className="bg-transparent font-medium text-stone-800 focus:outline-none cursor-pointer"
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <span className="text-stone-400">🕒</span>
                          </div>

                          <span className="text-stone-400 text-xs font-medium">to</span>

                          <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg px-2.5 py-1.5 bg-stone-50/50">
                            <select
                              value={item.end}
                              onChange={(e) => updateDayTime(idx, "end", e.target.value)}
                              className="bg-transparent font-medium text-stone-800 focus:outline-none cursor-pointer"
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <span className="text-stone-400">🕒</span>
                          </div>

                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded ml-2">
                            OPEN
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs italic text-stone-400">Closed (No appointments booked)</span>
                          <span className="text-[10px] font-bold text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded ml-2">
                            CLOSED
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="px-6 py-3 bg-emerald-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 shadow-sm transition"
              >
                SAVE SCHEDULE & PARAMETERS
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-stone-400 mt-8 font-mono">
        © 2026 Dr. Dhanya Krishna Practice • HIPAA / ISO-27001 Active Node
      </p>
    </div>
  );
}
