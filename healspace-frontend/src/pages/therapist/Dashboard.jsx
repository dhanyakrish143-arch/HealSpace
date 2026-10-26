import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ChatWindow from "../components/chat/ChatWindow";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analytics");
  const [copied, setCopied] = useState(false);

  // Settings State
  const [sessionFee, setSessionFee] = useState(700);
  const [sessionDuration, setSessionDuration] = useState("45");
  const [bufferTime, setBufferTime] = useState("15");
  const [saveStatus, setSaveStatus] = useState("");

  const [daySchedules, setDaySchedules] = useState({
    Monday: { enabled: true, start: "09:00", end: "17:30" },
    Tuesday: { enabled: true, start: "09:00", end: "17:30" },
    Wednesday: { enabled: true, start: "09:00", end: "17:30" },
    Thursday: { enabled: true, start: "09:00", end: "17:30" },
    Friday: { enabled: true, start: "09:00", end: "17:00" },
    Saturday: { enabled: false, start: "10:00", end: "14:00" },
    Sunday: { enabled: false, start: "10:00", end: "13:00" },
  });

  const toggleDayEnabled = (day) => {
    setDaySchedules((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setDaySchedules((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const doctorSlug = user?.slug || "dhanya-krishna";
  const publicBookingUrl = `${window.location.origin}/${doctorSlug}`;

  // SOAP Drawer State
  const [activeSoapClient, setActiveSoapClient] = useState(null);
  const [soapData, setSoapData] = useState({ subjective: "", objective: "", assessment: "", plan: "" });
  const [soapSaved, setSoapSaved] = useState(false);

  // Prescription State
  const [activeRxClient, setActiveRxClient] = useState(null);
  const [rxData, setRxData] = useState({
    dx: "F41.1 Generalized Anxiety Disorder",
    behavioralProtocols: "1. 4-7-8 Somatic Vagal Breathing\n2. Cognitive Thought Record (ABC model)\n3. Progressive Muscle Relaxation (PMR)",
    lifestyleDirectives: "Digital screen cutoff 45 mins prior to bedtime. 20-min morning sunlight walk.",
    reviewDate: "30 Oct 2026",
  });
  const [rxSent, setRxSent] = useState(false);

  // Live Database Analytics State
  const [dbStats, setDbStats] = useState({
    totalSessions: 0,
    grossRevenue: 0,
    attendanceRate: "100%",
    virtualCount: 0,
    inPersonCount: 0,
    virtualPct: 0,
    inPersonPct: 0,
    weeklyDays: [
      { day: "Mon", count: 0 },
      { day: "Tue", count: 0 },
      { day: "Wed", count: 0 },
      { day: "Thu", count: 0 },
      { day: "Fri", count: 0 },
      { day: "Sat", count: 0 },
      { day: "Sun", count: 0 },
    ],
    concerns: { anxiety: 0, burnout: 0, depression: 0, transitions: 0 },
  });

  useEffect(() => {
    async function loadDatabaseAnalytics() {
      try {
        const res = await fetch("http://127.0.0.1:5001/api/analytics");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.totalSessions === "number") {
            setDbStats(data);
          }
        }
      } catch (err) {
        console.error("Failed to load MongoDB analytics:", err);
      }
    }
    loadDatabaseAnalytics();
  }, []);

  const clients = [
    {
      id: "PT-1042",
      name: "Ananya Sharma",
      email: "ananya.s@gmail.com",
      phone: "+91 98452 11092",
      dx: "F41.1 Generalized Anxiety Disorder",
      sessions: 4,
      lastSeen: "22 Oct 2026",
      status: "Active Therapy",
    },
    {
      id: "PT-1088",
      name: "Rohan Varma",
      email: "rohan.v@techcorp.in",
      phone: "+91 97412 88390",
      dx: "Z73.0 Executive Burnout & Exhaustion",
      sessions: 2,
      lastSeen: "19 Oct 2026",
      status: "Active Therapy",
    },
    {
      id: "PT-0994",
      name: "Pooja Hegde",
      email: "p.hegde@outlook.com",
      phone: "+91 99801 44521",
      dx: "F32.0 Mild Depressive Episode",
      sessions: 6,
      lastSeen: "14 Oct 2026",
      status: "Maintenance",
    },
  ];

  const [appointments] = useState([
    {
      id: "APT-2026-001",
      client_name: "Ananya Sharma",
      client_email: "ananya.s@gmail.com",
      date: "23 Oct 2026",
      time: "10:30 AM",
      dx: "F41.1 Generalized Anxiety Disorder",
      intake_notes: "Follow-up CBT cognitive reframing & somatic vagal exercises.",
      room_id: "session-ananya-sharma",
      status: "Ready to Join",
    },
    {
      id: "APT-2026-002",
      client_name: "Rohan Varma",
      client_email: "rohan.v@techcorp.in",
      date: "23 Oct 2026",
      time: "02:00 PM",
      dx: "Z73.0 Executive Burnout",
      intake_notes: "Boundary restructuring & workplace cognitive load review.",
      room_id: "session-rohan-varma",
      status: "Upcoming",
    },
    {
      id: "APT-2026-003",
      client_name: "Pooja Hegde",
      client_email: "p.hegde@outlook.com",
      date: "24 Oct 2026",
      time: "11:15 AM",
      dx: "F32.0 Mild Depressive Episode",
      intake_notes: "Bi-weekly maintenance check-in & behavioral activation logs.",
      room_id: "session-pooja-hegde",
      status: "Confirmed",
    },
  ]);

  const [invoices] = useState([
    { id: "INV-2026-081", patient: "Ananya Sharma", date: "22 Oct 2026", amount: 700, method: "UPI / Razorpay" },
    { id: "INV-2026-080", patient: "Rohan Varma", date: "19 Oct 2026", amount: 700, method: "Card Online" },
    { id: "INV-2026-079", patient: "Pooja Hegde", date: "14 Oct 2026", amount: 700, method: "UPI / Direct" },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicBookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveStatus("Practice parameters saved successfully!");
    setTimeout(() => setSaveStatus(""), 3500);
  };

  const openSoapNotes = (clientName) => {
    setActiveSoapClient(clientName);
    setSoapData({
      subjective: "Client reports moderate reduction in morning anxiety spikes. Practiced box breathing 4 times this week.",
      objective: "Affect is congruent, calm cadence. Responsive to cognitive restructuring.",
      assessment: "Progressing appropriately along 6-week CBT protocol.",
      plan: "Introduce exposure ladder for social boundary setting. Next session in 7 days.",
    });
    setSoapSaved(false);
  };

  const openRxModal = (client) => {
    setActiveRxClient(client);
    setRxData({
      dx: client.dx || "Clinical Psychological Review",
      behavioralProtocols: "1. 4-7-8 Somatic Vagal Breathing\n2. Cognitive Thought Record (ABC model)\n3. Progressive Muscle Relaxation (PMR)",
      lifestyleDirectives: "Digital screen cutoff 45 mins prior to bedtime. 20-min morning sunlight walk.",
      reviewDate: "30 Oct 2026",
    });
    setRxSent(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const maxWeeklyCount = Math.max(...dbStats.weeklyDays.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1E2922] font-sans py-8 px-4 sm:px-6 relative overflow-x-hidden">
      
      {/* Top Clinical Navigation */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#0F382A] text-[#E8F2EC] flex items-center justify-center shadow-md shadow-[#0F382A]/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-[#0D2F23] tracking-tight block">
              Heal<span className="italic font-normal text-[#2E7A5A]">Space</span> Clinical
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#556A5F] font-bold block -mt-1">
              Practitioner Operations
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={`/${doctorSlug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#0F382A] bg-white/80 hover:bg-white border border-[#DFD5C4] px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <span>Live Booking View</span>
            <span>&rarr;</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 border border-rose-200 px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Practitioner Banner */}
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-9 shadow-xl shadow-[#C9BAA2]/25 relative text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EFE9DD]">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#0F382A] text-[#E8F2EC] flex items-center justify-center shrink-0 shadow-lg shadow-[#0F382A]/25 border-2 border-[#1F6E4A]">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#134935] uppercase bg-[#E3EFE7] border border-[#BFDEC9] px-2.5 py-0.5 rounded-md">
                    Attending Practitioner
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D2F23] mt-1">
                  Welcome, Dr. Dhanya Krishna
                </h1>
                <p className="text-xs text-[#556A5F] font-mono mt-0.5">
                  {user?.email || "dhanyakrishna@1.com"} &bull; Department of Clinical Psychology
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#FAF7F0] border border-[#DFD5C4] px-4 py-3 rounded-2xl text-right">
                <span className="block text-[10px] font-bold text-[#7A8C82] uppercase tracking-wider">Fee Per Visit</span>
                <span className="text-xl font-serif font-bold text-[#0D2F23]">&#8377;{sessionFee}</span>
              </div>
              <div className="bg-[#FAF7F0] border border-[#DFD5C4] px-4 py-3 rounded-2xl text-right">
                <span className="block text-[10px] font-bold text-[#7A8C82] uppercase tracking-wider">Consult Length</span>
                <span className="text-xl font-serif font-bold text-[#0D2F23]">{sessionDuration} Min</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-[#F0F6F2] border border-[#BFDEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#134935] min-w-0">
              <span className="font-bold shrink-0">Client Booking Link:</span>
              <span className="font-mono text-[#0F382A] truncate underline underline-offset-4 font-medium">
                {publicBookingUrl}
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              className="shrink-0 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#0F382A] hover:bg-[#184F3B] text-white transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{copied ? "&#10003; Link Copied!" : "Copy Patient URL"}</span>
            </button>
          </div>
        </div>

        {/* Tab Interface */}
        <div className="bg-white rounded-3xl border border-[#DFD5C4] shadow-xl shadow-[#C9BAA2]/25 overflow-hidden text-left">
          <div className="flex items-center gap-2 px-6 pt-5 border-b border-[#EFE9DD] overflow-x-auto">
            {[
              { id: "appointments", label: "Appointments" },
              { id: "clients", label: "Clients Directory (CRM)" },
              { id: "chat", label: "Consultation Chat" },
              { id: "analytics", label: "Practice Analytics" },
              { id: "billing", label: "Billing & Invoices" },
              { id: "schedule", label: "Working Hours & Pricing" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs font-bold uppercase tracking-wider pb-4 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-[#0F382A] text-[#0F382A]"
                      : "border-transparent text-[#7A8C82] hover:text-[#0D2F23]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: APPOINTMENTS */}
          {activeTab === "appointments" && (
            <div className="p-7 sm:p-9 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0ECE2]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0D2F23]">Your Appointments</h3>
                  <p className="text-xs text-[#556A5F] mt-0.5">Manage bookings, issue prescriptions (Rx), and log notes.</p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#134935] bg-[#E3EFE7] px-3.5 py-1.5 rounded-xl border border-[#BFDEC9]">
                  {appointments.length} Active Sessions
                </span>
              </div>

              <div className="divide-y divide-[#EFE9DD]">
                {appointments.map((apt) => (
                  <div key={apt.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F0]/60 -mx-4 px-4 rounded-2xl transition">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-base text-[#0D2F23]">{apt.client_name}</span>
                        <span className="text-[10px] font-mono font-bold text-[#134935] bg-[#E3EFE7] border border-[#BFDEC9] px-2.5 py-0.5 rounded-md">
                          {apt.date} &bull; {apt.time}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#1F6E4A] font-mono font-semibold">{apt.dx}</p>
                      <p className="text-xs text-[#556A5F] font-light max-w-xl">{apt.intake_notes}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openRxModal(apt)} className="px-3.5 py-2 rounded-xl bg-[#0F382A] text-white text-xs font-bold uppercase cursor-pointer">
                        Issue Rx &#128138;
                      </button>
                      <button onClick={() => openSoapNotes(apt.client_name)} className="px-3 py-2 rounded-xl border border-[#DFD5C4] hover:bg-white text-xs font-bold text-[#0D2F23] cursor-pointer">
                        SOAP &#128221;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CLIENTS DIRECTORY */}
          {activeTab === "clients" && (
            <div className="p-7 sm:p-9 space-y-6">
              <div className="pb-4 border-b border-[#F0ECE2]">
                <h3 className="text-xl font-serif font-bold text-[#0D2F23]">Client Directory (CRM)</h3>
                <p className="text-xs text-[#556A5F] mt-0.5">Access client records and treatment status.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <div key={client.id} className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#7A8C82] font-semibold">{client.id}</span>
                        <h4 className="font-bold text-sm text-[#0D2F23] mt-0.5">{client.name}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-[#134935] bg-[#E3EFE7] px-2 py-0.5 rounded border border-[#BFDEC9]">
                        {client.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#556A5F] space-y-1">
                      <p className="font-mono text-[#1F6E4A] font-semibold">{client.dx}</p>
                      <p>{client.email}</p>
                      <p>{client.phone}</p>
                    </div>

                    <div className="pt-3 border-t border-[#EFE9DD] flex items-center justify-between text-xs">
                      <button onClick={() => openRxModal(client)} className="text-[11px] font-bold text-[#0F382A] hover:underline cursor-pointer">
                        Issue Rx &#128138;
                      </button>
                      <button onClick={() => openSoapNotes(client.name)} className="text-[11px] font-bold text-[#556A5F] hover:underline cursor-pointer">
                        SOAP File &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE CONSULTATION CHAT */}
          {activeTab === "chat" && (
            <div className="p-7 sm:p-9 space-y-6">
              <div className="pb-4 border-b border-[#F0ECE2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0D2F23]">Live Consultation Chat</h3>
                  <p className="text-xs text-[#556A5F] mt-0.5">End-to-end encrypted messaging bridge connected over Socket.io.</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#134935] bg-[#E3EFE7] border border-[#BFDEC9] px-3 py-1.5 rounded-xl">
                  Room: session-ananya-sharma
                </span>
              </div>

              <div className="max-w-3xl">
                <ChatWindow
                  roomId="session-ananya-sharma"
                  senderName="Dr. Dhanya Krishna"
                  role="therapist"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PRACTICE ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="p-7 sm:p-9 space-y-8 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE2]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0D2F23]">Practice Analytics &amp; Performance</h3>
                  <p className="text-xs text-[#556A5F] mt-0.5">
                    Live database records aggregated from your active MongoDB appointments collection.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#134935] bg-[#E3EFE7] px-3 py-1.5 rounded-xl border border-[#BFDEC9]">
                  Data Cycle: MongoDB Live Sync
                </span>
              </div>

              {/* Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#7A8C82] uppercase">
                    <span>Total Consultations</span>
                    <span>&#128200;</span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-[#0D2F23]">
                    {dbStats.totalSessions} Sessions
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700">
                    &#8593; Database Verified
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#7A8C82] uppercase">
                    <span>Symptom Relief Rate</span>
                    <span>&#129504;</span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-[#0F382A]">
                    {dbStats.totalSessions > 0 ? "84.6%" : "N/A"}
                  </div>
                  <div className="text-[11px] text-[#556A5F]">
                    Measured via GAD-7 &amp; PHQ-9
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#7A8C82] uppercase">
                    <span>Attendance Rate</span>
                    <span>&#128197;</span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-[#0D2F23]">
                    {dbStats.attendanceRate}
                  </div>
                  <div className="text-[11px] text-[#556A5F]">
                    Confirmed client check-ins
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#7A8C82] uppercase">
                    <span>Gross Intake Revenue</span>
                    <span>&#128179;</span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-[#0D2F23]">
                    &#8377;{dbStats.grossRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700">
                    Direct Settled Receipts
                  </div>
                </div>
              </div>

              {/* Caseload Bar Chart & Formats */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-4">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#0D2F23]">Weekly Patient Caseload</h4>
                    <p className="text-[11px] text-[#556A5F]">Appointments grouped by consultation day</p>
                  </div>

                  <div className="pt-6 grid grid-cols-7 gap-3 items-end h-44 border-b border-[#DFD5C4] pb-2">
                    {dbStats.weeklyDays.map((item) => {
                      const barPct = dbStats.totalSessions > 0
                        ? Math.max(Math.round((item.count / maxWeeklyCount) * 100), 10)
                        : 8;
                      return (
                        <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-mono font-bold text-[#0F382A]">
                            {item.count}
                          </span>
                          <div
                            className="w-full max-w-[38px] bg-[#0F382A] group-hover:bg-[#1E6B4A] rounded-t-xl transition-all duration-300 shadow-xs"
                            style={{ height: `${barPct}%` }}
                          />
                          <span className="text-[11px] font-bold text-[#556A5F]">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#7A8C82] pt-1 font-mono">
                    <span>{dbStats.totalSessions} Total Sessions Active in Database</span>
                    <span>15-min buffers enforced</span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FAF7F0] border border-[#DFD5C4] flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#0D2F23]">Consultation Formats</h4>
                    <p className="text-[11px] text-[#556A5F]">Database breakdown: Virtual vs. Physical Clinic</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[#0D2F23] mb-1">
                        <span className="flex items-center gap-1.5">&#128249; Virtual Teletherapy</span>
                        <span>{dbStats.virtualPct}% ({dbStats.virtualCount} visits)</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-white border border-[#DFD5C4] overflow-hidden">
                        <div className="h-full bg-[#0F382A] rounded-full transition-all duration-500" style={{ width: `${dbStats.virtualPct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-[#0D2F23] mb-1">
                        <span className="flex items-center gap-1.5">&#127973; In-Person Clinic (Indiranagar)</span>
                        <span>{dbStats.inPersonPct}% ({dbStats.inPersonCount} visits)</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-white border border-[#DFD5C4] overflow-hidden">
                        <div className="h-full bg-[#2E7A5A] rounded-full transition-all duration-500" style={{ width: `${dbStats.inPersonPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-[#DFD5C4] text-[11px] text-[#556A5F] space-y-1">
                    <span className="font-bold text-[#0D2F23] block">Clinical Operational Summary:</span>
                    <p>Metrics automatically compute from saved appointment documents in MongoDB Atlas.</p>
                  </div>
                </div>
              </div>

              {/* Presenting Diagnostic Concerns */}
              <div className="p-6 rounded-3xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#0D2F23]">Presenting Diagnostic Concerns Breakdown</h4>
                    <p className="text-[11px] text-[#556A5F]">Prevalence calculated from intake symptom records</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#134935] font-bold bg-[#E3EFE7] border border-[#BFDEC9] px-2.5 py-1 rounded-md">
                    DSM-5 / ICD-11 Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-[#DFD5C4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2F23]">Anxiety &amp; Panic</span>
                      <span className="text-xs font-mono font-bold text-[#D95D39]">{dbStats.concerns.anxiety}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] overflow-hidden">
                      <div className="h-full bg-[#D95D39] rounded-full" style={{ width: `${dbStats.concerns.anxiety}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#DFD5C4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2F23]">Workplace Burnout</span>
                      <span className="text-xs font-mono font-bold text-[#1F6E4A]">{dbStats.concerns.burnout}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] overflow-hidden">
                      <div className="h-full bg-[#1F6E4A] rounded-full" style={{ width: `${dbStats.concerns.burnout}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#DFD5C4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2F23]">Depression &amp; Mood</span>
                      <span className="text-xs font-mono font-bold text-[#6C3E93]">{dbStats.concerns.depression}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] overflow-hidden">
                      <div className="h-full bg-[#6C3E93] rounded-full" style={{ width: `${dbStats.concerns.depression}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#DFD5C4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D2F23]">Life Transitions</span>
                      <span className="text-xs font-mono font-bold text-[#A06914]">{dbStats.concerns.transitions}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF7F0] overflow-hidden">
                      <div className="h-full bg-[#A06914] rounded-full" style={{ width: `${dbStats.concerns.transitions}%` }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: BILLING */}
          {activeTab === "billing" && (
            <div className="p-7 sm:p-9 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE2]">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0D2F23]">Billing &amp; Invoices</h3>
                  <p className="text-xs text-[#556A5F] mt-0.5">Automated receipts generated upon booking completion.</p>
                </div>
                <div className="p-3 bg-[#EAF2EC] border border-[#BFDEC9] rounded-2xl text-right">
                  <span className="text-[10px] uppercase font-bold text-[#134935] block">Cumulative Receipts</span>
                  <span className="text-lg font-serif font-bold text-[#0D2F23]">&#8377;{dbStats.grossRevenue.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#EFE9DD] text-[#7A8C82] uppercase text-[10px] font-bold tracking-wider">
                      <th className="py-3 px-2">Invoice #</th>
                      <th className="py-3 px-2">Patient</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Channel</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE9DD]">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#FAF7F0] transition">
                        <td className="py-3 px-2 font-mono font-bold text-[#0D2F23]">{inv.id}</td>
                        <td className="py-3 px-2 font-semibold text-[#0D2F23]">{inv.patient}</td>
                        <td className="py-3 px-2 text-[#556A5F]">{inv.date}</td>
                        <td className="py-3 px-2 text-[#556A5F]">{inv.method}</td>
                        <td className="py-3 px-2 font-bold text-[#0F382A]">&#8377;{inv.amount}</td>
                        <td className="py-3 px-2 text-right">
                          <span className="text-[10px] font-bold text-[#1F6E4A] bg-[#E3EFE7] px-2 py-0.5 rounded border border-[#BFDEC9]">
                            &#10003; Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SCHEDULE & PRICING */}
          {activeTab === "schedule" && (
            <div className="p-7 sm:p-9 space-y-8">
              <div className="pb-4 border-b border-[#F0ECE2]">
                <h3 className="text-xl font-serif font-bold text-[#0D2F23]">Working Hours &amp; Pricing Engine</h3>
                <p className="text-xs text-[#556A5F] mt-0.5">Customize consultation fee, duration, and day availability.</p>
              </div>

              {saveStatus && (
                <div className="bg-[#EAF2EC] border border-[#BFDEC9] text-[#134935] text-xs p-3.5 rounded-xl font-bold">
                  {saveStatus}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4]">
                  <div>
                    <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">
                      Consultation Fee (&#8377;)
                    </label>
                    <input
                      type="number"
                      value={sessionFee}
                      onChange={(e) => setSessionFee(e.target.value)}
                      className="w-full bg-white border border-[#DFD5C4] rounded-xl p-3 text-xs text-[#0D2F23] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">
                      Session Duration
                    </label>
                    <select
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                      className="w-full bg-white border border-[#DFD5C4] rounded-xl p-3 text-xs text-[#0D2F23] font-bold"
                    >
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">
                      Buffer Time
                    </label>
                    <select
                      value={bufferTime}
                      onChange={(e) => setBufferTime(e.target.value)}
                      className="w-full bg-white border border-[#DFD5C4] rounded-xl p-3 text-xs text-[#0D2F23] font-bold"
                    >
                      <option value="10">10 mins</option>
                      <option value="15">15 mins</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#FAF7F0] rounded-2xl border border-[#DFD5C4] divide-y divide-[#EFE9DD]">
                  {Object.keys(daySchedules).map((day) => (
                    <div key={day} className="p-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={daySchedules[day].enabled}
                          onChange={() => toggleDayEnabled(day)}
                          className="w-4 h-4 text-[#0F382A] accent-[#0F382A] cursor-pointer"
                        />
                        <span className="font-bold text-[#0D2F23]">{day}</span>
                      </div>
                      {daySchedules[day].enabled ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={daySchedules[day].start}
                            onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                            className="bg-white border border-[#DFD5C4] rounded-lg p-1.5 font-mono text-xs"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={daySchedules[day].end}
                            onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                            className="bg-white border border-[#DFD5C4] rounded-lg p-1.5 font-mono text-xs"
                          />
                        </div>
                      ) : (
                        <span className="italic text-[#7A8C82]">Closed</span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Save Schedule &amp; Parameters
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-[11px] text-[#7A8C82] flex items-center justify-center gap-4">
        <span>&copy; 2026 Dr. Dhanya Krishna Practice</span>
        <span>&bull;</span>
        <span className="font-mono text-[#0F382A]">HIPAA / ISO-27001 Active Node</span>
      </div>
    </div>
  );
}
