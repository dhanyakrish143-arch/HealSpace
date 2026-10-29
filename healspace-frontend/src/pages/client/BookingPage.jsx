import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ALL_SLOTS = [
  "09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM",
  "02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM", "05:00 PM"
];

// Clean self-contained inline SVG icons
const CheckCircleIcon = () => (
  <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 inline-block mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default function BookingPage() {
  const navigate = useNavigate();
  const therapistSlug = "dhanya-krishna";
  const [selectedDate, setSelectedDate] = useState("2026-10-29");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [mode, setMode] = useState("teletherapy");

  // Patient Intake States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [concern, setConcern] = useState("");

  // Confirmation & UI state
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [activeTab, setActiveTab] = useState("receipt");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Safe navigation back to home or therapist microsite
  const handleBackToHome = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchBookedSlots(selectedDate);
  }, [selectedDate]);

  const fetchBookedSlots = async (date) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/scheduling/booked-slots?therapist_slug=${therapistSlug}&date=${date}`
      );
      if (res.data.success) {
        setBookedSlots(res.data.bookedSlots || []);
      }
    } catch (err) {
      console.error("Could not fetch booked slots", err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg("Please select an available appointment time.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:5001/api/scheduling/book", {
        therapist_slug: therapistSlug,
        client_name: fullName,
        client_email: email,
        client_phone: phone,
        date: selectedDate,
        slot: selectedSlot,
        format: mode,
        presenting_concern: concern,
        amount_paid: 700
      });

      if (res.data.success) {
        setBookingConfirmed(res.data.appointment);
        fetchBookedSlots(selectedDate);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMsg(err.response.data.message);
        fetchBookedSlots(selectedDate);
        setSelectedSlot("");
      } else {
        setErrorMsg("Failed to complete booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-stone-800 py-10 px-4 flex flex-col items-center">
        {/* Top Navigation Bar */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-6">
          <button
            onClick={handleBackToHome}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3.5 py-1.5 rounded-lg shadow-sm transition hover:bg-stone-50"
          >
            ← BACK TO CLINIC HOME
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            PATIENT INTAKE & ADMISSION
          </span>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Consultation Reserved & Dispatched</h2>
          <p className="text-sm text-stone-600 mt-2">
            Payment verified for <span className="font-semibold text-stone-800">{bookingConfirmed.client_name}</span>.
            Your session is confirmed for <span className="font-semibold">{bookingConfirmed.date}</span> at <span className="font-semibold">{bookingConfirmed.slot}</span>.
          </p>

          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab("receipt")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition ${
                activeTab === "receipt"
                  ? "bg-stone-900 text-white shadow"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              1. Official Tax Receipt (₹700)
            </button>
            <button
              onClick={() => setActiveTab("prescription")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase flex items-center gap-1 transition ${
                activeTab === "prescription"
                  ? "bg-stone-900 text-white shadow"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <LockIcon />
              2. Doctor's Prescription (Rx)
            </button>
          </div>

          {activeTab === "receipt" && (
            <div className="mt-6 border border-stone-200 rounded-xl p-6 text-left bg-stone-50/50">
              <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-stone-900">TAX INVOICE / RECEIPT</h3>
                  <p className="text-xs text-stone-500">Dr. Dhanya Krishna Practice • GST Exempt Clinical Telehealth</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded">PAID</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs py-4 border-b border-stone-200">
                <div>
                  <p className="text-stone-500">Patient Name</p>
                  <p className="font-semibold text-stone-800">{bookingConfirmed.client_name}</p>
                </div>
                <div>
                  <p className="text-stone-500">Scheduled Date & Time</p>
                  <p className="font-semibold text-stone-800">{bookingConfirmed.date} @ {bookingConfirmed.slot}</p>
                </div>
                <div>
                  <p className="text-stone-500">Consultation Format</p>
                  <p className="font-semibold text-stone-800 capitalize">{bookingConfirmed.format}</p>
                </div>
                <div>
                  <p className="text-stone-500">Consultation Fee</p>
                  <p className="font-semibold text-stone-800">₹{bookingConfirmed.amount_paid}.00</p>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="mt-4 w-full py-2 bg-stone-800 text-white rounded-lg text-xs font-medium hover:bg-stone-700"
              >
                Download / Print Receipt (PDF)
              </button>
            </div>
          )}

          {activeTab === "prescription" && (
            <div className="mt-6 border border-dashed border-stone-300 rounded-xl p-8 bg-stone-50 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <LockIcon />
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-base">Prescription Locked</h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
                In compliance with clinical ethics and telehealth regulations, your personalized Clinical Care Plan and Prescription (Rx) will be unlocked and issued after your consultation with Dr. Dhanya Krishna.
              </p>
              <div className="mt-4 inline-block bg-white border border-stone-200 px-4 py-2 rounded-lg text-xs text-stone-600">
                Status: <span className="text-amber-700 font-semibold">Pending Clinical Session ({bookingConfirmed.date} @ {bookingConfirmed.slot})</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setBookingConfirmed(null);
              setSelectedSlot("");
            }}
            className="mt-6 text-xs text-stone-500 underline hover:text-stone-800 block mx-auto"
          >
            ← Book another session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 py-10 px-4 flex flex-col items-center">
      {/* Top Navigation Bar with Back Button */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <button
          onClick={handleBackToHome}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3.5 py-1.5 rounded-lg shadow-sm transition hover:bg-stone-50"
        >
          ← BACK TO CLINIC HOME
        </button>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          PATIENT INTAKE & ADMISSION
        </span>
      </div>

      {/* Header Profile Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xl font-serif">
              DK
            </div>
            <div>
              <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Lead Attending Specialist
              </span>
              <h1 className="text-xl font-serif font-bold text-stone-900 mt-1">Dr. Dhanya Krishna</h1>
              <p className="text-xs text-stone-500">Licensed Clinical Psychologist & Counsellor (RCI Registered)</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-stone-900">₹700</span>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Per 45-Min Session</p>
          </div>
        </div>
      </div>

      {/* Main Intake & Booking Form */}
      <form onSubmit={handleBooking} className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-stone-200 p-8 space-y-8">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {errorMsg}
          </div>
        )}

        {/* 1. Consultation Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
            1. Select Consultation Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode("teletherapy")}
              className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                mode === "teletherapy"
                  ? "border-emerald-800 bg-emerald-900 text-white shadow"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              <VideoIcon />
              <div>
                <p className="text-xs font-bold">Virtual Teletherapy</p>
                <p className={`text-[10px] ${mode === "teletherapy" ? "text-emerald-200" : "text-stone-400"}`}>
                  Secure video call in browser
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("clinic")}
              className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                mode === "clinic"
                  ? "border-emerald-800 bg-emerald-900 text-white shadow"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              <BuildingIcon />
              <div>
                <p className="text-xs font-bold">In-Person Clinic Visit</p>
                <p className={`text-[10px] ${mode === "clinic" ? "text-emerald-200" : "text-stone-400"}`}>
                  Indiranagar Clinic, Bengaluru
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Date & Time Selection with Live Collision Disabling */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
              2. Select Date & Appointment Slot
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot("");
              }}
              className="text-xs border border-stone-200 rounded-lg px-3 py-1 font-medium bg-stone-50 text-stone-700 focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {ALL_SLOTS.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = selectedSlot === slot;

              return (
                <button
                  type="button"
                  key={slot}
                  disabled={isBooked}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border transition ${
                    isBooked
                      ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed line-through"
                      : isSelected
                      ? "bg-emerald-900 text-white border-emerald-900 shadow"
                      : "bg-white border-stone-200 text-stone-700 hover:border-emerald-700 hover:bg-emerald-50/30"
                  }`}
                  title={isBooked ? "This slot is already booked" : "Available"}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            * Slots with strike-through lines are already reserved by other patients.
          </p>
        </div>

        {/* 3. Patient Details */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
            3. Enter Patient Details
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sneha Patel"
                className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sneha@example.com"
                className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Contact Phone / WhatsApp *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Primary Reason for Consultation / Presenting Concerns
            </label>
            <textarea
              rows={3}
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="Briefly describe what you'd like to address..."
              className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !selectedSlot}
          className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            loading || !selectedSlot
              ? "bg-stone-300 text-stone-500 cursor-not-allowed"
              : "bg-emerald-950 text-white hover:bg-emerald-900 shadow-sm"
          }`}
        >
          {loading ? "Confirming Slot..." : `Proceed to Payment (₹700) →`}
        </button>
      </form>
    </div>
  );
}
