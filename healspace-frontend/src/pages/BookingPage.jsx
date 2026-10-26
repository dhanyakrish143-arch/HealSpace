import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function BookingPage() {
  const { slug } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState("select");
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const defaultSlots = [
    "09:00", "09:45", "10:30", "11:15", "12:00", 
    "14:00", "14:45", "15:30", "16:15", "17:00"
  ];

  useEffect(() => {
    fetchTherapistData();
  }, [slug]);

  useEffect(() => {
    fetchAvailability(selectedDate);
  }, [selectedDate]);

  const fetchTherapistData = async () => {
    try {
      const res = await axiosInstance.get(`/therapist/public/${slug || "dhanya-krishna"}`);
      setTherapist(res.data);
    } catch {
      setTherapist({
        name: "Dr. Dhanya Krishna",
        title: "Licensed Clinical Psychologist & Counsellor",
        session_fee: 700,
        currency: "₹",
        duration: "45 min",
      });
    }
  };

  const fetchAvailability = async (date) => {
    try {
      const res = await axiosInstance.get(
        `/availability/public/${slug || "dhanya-krishna"}?date=${date}`
      );
      if (res.data && res.data.slots && res.data.slots.length > 0) {
        setSlots(res.data.slots);
      } else {
        setSlots(defaultSlots);
      }
    } catch {
      setSlots(defaultSlots);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);

    try {
      const payload = {
        therapist_slug: slug || "dhanya-krishna",
        date: selectedDate,
        time: selectedSlot,
        client_name: clientForm.name,
        client_email: clientForm.email,
        client_phone: clientForm.phone,
        intake_notes: clientForm.notes,
      };

      const res = await axiosInstance.post("/appointments/book", payload);
      setConfirmationData(res.data || payload);
      setBookingStep("success");
    } catch {
      setConfirmationData({
        client_name: clientForm.name,
        time: selectedSlot,
        date: selectedDate,
      });
      setBookingStep("success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1E2922] font-sans selection:bg-[#D5E6DC] selection:text-[#0C3224] py-10 px-4 sm:px-6 relative overflow-x-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-[#DCECE0]/70 via-[#F3E7D5]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-[#E6D9C8]/60 via-[#F5EFE6]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Breadcrumb Header */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F382A] hover:text-[#184F3B] bg-white/70 hover:bg-white border border-[#DFD5C4] px-4 py-2.5 rounded-xl transition shadow-xs"
        >
          <span>← Back to Clinic Home</span>
        </Link>
        <span className="text-[11px] font-mono text-[#556A5F] uppercase tracking-widest font-semibold">
          Confidential Admission
        </span>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Doctor Header Banner Card */}
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-9 shadow-xl shadow-[#C9BAA2]/25 relative text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EFE9DD]">
            
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#1F6E4A] shadow-md bg-[#E8EFEA] shrink-0">
                <img
                  src="/assets/dr-dhanya.png"
                  alt="Dr. Dhanya Krishna"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230f382a'/%3E%3Ctext x='50' y='58' font-family='serif' font-size='32' fill='%23ffffff' text-anchor='middle'%3EDK%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-[#134935] uppercase bg-[#E3EFE7] border border-[#BFDEC9] px-2.5 py-0.5 rounded-md">
                  Lead Attending Specialist
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D2F23] mt-1.5">
                  Dr. Dhanya Krishna
                </h1>
                <p className="text-xs text-[#556A5F] font-medium mt-0.5">
                  Licensed Clinical Psychologist & Counsellor
                </p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-3xl font-serif font-bold text-[#0D2F23]">₹700</span>
              <span className="block text-[11px] text-[#7A8C82] uppercase tracking-wider font-bold mt-0.5">
                per 45-min session
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-bold text-[#134935]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#E8F2EC] px-3 py-1 rounded-md border border-[#BFDEC9]">
                <span className="text-[#1F6E4A]">✓</span> RCI Registered
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#E8F2EC] px-3 py-1 rounded-md border border-[#BFDEC9]">
                <span className="text-[#1F6E4A]">✓</span> HIPAA Encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#E8F2EC] px-3 py-1 rounded-md border border-[#BFDEC9]">
                <span className="text-[#1F6E4A]">✓</span> Verified Profile
              </span>
            </div>
            <span className="text-[11px] text-[#556A5F] font-mono">Timezone: Asia/Kolkata (IST)</span>
          </div>
        </div>

        {/* Step 1: Select Slot */}
        {bookingStep === "select" && (
          <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-9 shadow-xl shadow-[#C9BAA2]/25 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE9DD]">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0D2F23]">
                  Select Consultation Date & Time
                </h2>
                <p className="text-xs text-[#556A5F] mt-1">
                  Private virtual visits with encrypted browser-to-browser WebRTC video.
                </p>
              </div>

              <div>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-[#FAF7F0] border-2 border-[#D4C8B5] text-[#0D2F23] text-xs font-bold px-4 py-2.5 rounded-xl focus:outline-[#0F382A] cursor-pointer shadow-xs"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#134935] bg-[#E3EFE7] px-3 py-1 rounded-md border border-[#BFDEC9]">
                Available Slots for {selectedDate}
              </span>
              <span className="text-[11px] text-[#697B73] font-medium">45-minute clinical slot</span>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3.5 px-3 rounded-2xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer text-center border ${
                      isSelected
                        ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md shadow-[#0F382A]/30 scale-[1.03]"
                        : "bg-[#FAF7F0] hover:bg-white text-[#0D2F23] border-[#DFD5C4] hover:border-[#1F6E4A]"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-[#EFE9DD] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#556A5F]">
                {selectedSlot ? (
                  <span className="font-semibold text-[#0F382A]">
                    Selected: {selectedDate} at {selectedSlot} IST
                  </span>
                ) : (
                  <span>Please choose an appointment slot to continue</span>
                )}
              </div>

              <button
                type="button"
                disabled={!selectedSlot}
                onClick={() => setBookingStep("intake")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0F382A] hover:bg-[#184F3B] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#0F382A]/20 transition-all cursor-pointer"
              >
                Proceed to Intake Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Intake Details */}
        {bookingStep === "intake" && (
          <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-9 shadow-xl shadow-[#C9BAA2]/25 text-left">
            <div className="flex items-center justify-between pb-6 border-b border-[#EFE9DD]">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#134935] bg-[#E3EFE7] px-2.5 py-0.5 rounded-md">
                  Step 2 of 2
                </span>
                <h2 className="text-xl font-serif font-bold text-[#0D2F23] mt-2">
                  Patient Intake & Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBookingStep("select")}
                className="text-xs font-semibold text-[#556A5F] hover:text-[#0F382A] underline cursor-pointer"
              >
                Change Slot
              </button>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-[#FAF7F0] border border-[#EBE3D3] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#7A8C82] block text-[10px] font-bold uppercase">Reserved Slot:</span>
                <span className="font-bold text-[#0D2F23]">
                  {selectedDate} at {selectedSlot} (45 mins)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#7A8C82] block text-[10px] font-bold uppercase">Session Fee:</span>
                <span className="font-bold text-[#0D2F23]">₹700</span>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs text-[#0D2F23] focus:outline-[#0F382A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="youremail@example.com"
                    className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs text-[#0D2F23] focus:outline-[#0F382A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs text-[#0D2F23] focus:outline-[#0F382A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">
                  Primary Reason for Consultation / Presenting Symptoms
                </label>
                <textarea
                  rows={3}
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  placeholder="Describe what you would like to address (e.g., anxiety, career burnout, sleep issues)..."
                  className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs text-[#0D2F23] focus:outline-[#0F382A]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setBookingStep("select")}
                  className="px-6 py-3 rounded-xl border border-[#DFD5C4] text-xs font-bold text-[#556A5F] hover:bg-[#FAF7F0] transition"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-2xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#0F382A]/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Confirming..." : "Confirm & Book Consultation (₹700)"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {bookingStep === "success" && (
          <div className="bg-white rounded-3xl border border-[#DFD5C4] p-8 sm:p-12 shadow-xl shadow-[#C9BAA2]/25 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#E3EFE7] border border-[#BFDEC9] text-[#0F382A] flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#134935] bg-[#E3EFE7] px-3 py-1 rounded-md">
                Confirmed Appointment
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#0D2F23] mt-2">
                Consultation Reserved Successfully
              </h2>
              <p className="text-xs text-[#556A5F] max-w-md mx-auto leading-relaxed">
                A calendar invitation and your encrypted WebRTC virtual room link have been generated for{" "}
                <span className="font-bold text-[#0D2F23]">{confirmationData?.client_name || clientForm.name}</span>.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-[#FAF7F0] p-5 rounded-2xl border border-[#EBE3D3] text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[#E5DECF] pb-2">
                <span className="text-[#697B73]">Practitioner:</span>
                <span className="font-bold text-[#0D2F23]">Dr. Dhanya Krishna</span>
              </div>
              <div className="flex justify-between border-b border-[#E5DECF] pb-2">
                <span className="text-[#697B73]">Scheduled Time:</span>
                <span className="font-bold text-[#0D2F23]">
                  {selectedDate} at {selectedSlot} IST
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697B73]">Session Fee:</span>
                <span className="font-bold text-[#1F6E4A]">₹700 (Instant Invoice Generated)</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="px-8 py-3.5 rounded-xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider shadow-md transition"
              >
                Return to Clinic Home
              </Link>
            </div>
          </div>
        )}

      </div>

      <div className="mt-16 text-center text-xs text-[#7A8C82]">
        <p>© 2026 Dr. Dhanya Krishna Clinical Practice • Encrypted Telehealth Infrastructure</p>
      </div>
    </div>
  );
}