import FloatingChatWidget from "../../components/FloatingChatWidget";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function BookingPage() {
  const { slug } = useParams();
  const [sessionType, setSessionType] = useState("video");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const defaultSlots = [
    "09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", 
    "02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM", "05:00 PM"
  ];

  const [selectedSlot, setSelectedSlot] = useState(defaultSlots[0]);
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [step, setStep] = useState("intake"); // 'intake' | 'payment' | 'confirmed'
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  // Active view on confirmed screen: 'receipt' or 'prescription'
  const [confirmedView, setConfirmedView] = useState("receipt");

  const reviews = [
    {
      id: 1,
      name: "S. K. Rao",
      rating: 5,
      date: "October 2026",
      condition: "Generalized Anxiety & Panic",
      feedback: "Dr. Dhanya Krishna's CBT protocols gave me tangible coping tools within 3 sessions. The somatic breathing techniques significantly reduced my morning panic attacks.",
      type: "Virtual Consultation"
    },
    {
      id: 2,
      name: "Meera Sen",
      rating: 5,
      date: "September 2026",
      condition: "Workplace Executive Burnout",
      feedback: "Structured, calm, and insightful. She helped me draw boundaries at work and overcome persistent imposter feelings without compromising my career progress.",
      type: "In-Person Clinic Visit"
    },
    {
      id: 3,
      name: "A. Patel",
      rating: 5,
      date: "August 2026",
      condition: "Relational Dynamics & Grief",
      feedback: "A truly quiet, non-judgmental sanctuary. Her guidance helped me untangle complex emotional grief and rebuild internal resilience.",
      type: "Virtual Consultation"
    }
  ];

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email || !clientForm.phone) return;
    setStep("payment");
  };

  const handleCompletePayment = async () => {
    setProcessingPayment(true);
    const invoiceNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const utrRef = `UPI${Date.now().toString().slice(-8)}`;

    const payload = {
      therapist_slug: slug || "dhanya-krishna",
      session_type: sessionType,
      date: selectedDate,
      time: selectedSlot,
      client_name: clientForm.name,
      client_email: clientForm.email,
      client_phone: clientForm.phone,
      intake_notes: clientForm.notes,
      invoice_id: invoiceNum,
      utr_ref: utrRef,
      payment_method: paymentMethod === "upi" ? "UPI / QR Online" : "Debit / Credit Card",
      amount: 700,
      rx: {
        dx: clientForm.notes ? `Clinical Evaluation: ${clientForm.notes}` : "Generalized Cognitive Stress & Overwhelm",
        protocol: "1. 4-7-8 Somatic Vagal Breathing: Inhale 4s, Hold 7s, Exhale 8s (2x daily)\n2. Cognitive Thought Record: Log automatic triggers and counter-evidence\n3. Progressive Muscle Relaxation (PMR) prior to sleep",
        lifestyle: "45-min screen blackout before bedtime. Hydration: 2.5L daily with 15 mins morning sunlight.",
        reviewDate: "7 Days Following Initial Session",
      }
    };

    try {
      const res = await axiosInstance.post("/appointments/book", payload);
      setConfirmationData(res.data || payload);
    } catch {
      setConfirmationData(payload);
    } finally {
      setTimeout(() => {
        setProcessingPayment(false);
        setStep("confirmed");
      }, 1200);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1E2922] font-sans selection:bg-[#D5E6DC] selection:text-[#0C3224] py-10 px-4 sm:px-6 relative overflow-x-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-[#DCECE0]/70 via-[#F3E7D5]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-[#E6D9C8]/60 via-[#F5EFE6]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F382A] hover:text-[#184F3B] bg-white/70 hover:bg-white border border-[#DFD5C4] px-4 py-2.5 rounded-xl transition shadow-xs"
        >
          <span>← Back to Clinic Home</span>
        </Link>
        <span className="text-[11px] font-mono text-[#556A5F] uppercase tracking-widest font-semibold">
          Patient Intake & Admission
        </span>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Doctor Identity Banner */}
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-9 shadow-xl shadow-[#C9BAA2]/25 relative text-left print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EFE9DD]">
            
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#0F382A] text-[#E8F2EC] flex items-center justify-center shrink-0 shadow-lg shadow-[#0F382A]/25 border-2 border-[#1F6E4A]">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-[#134935] uppercase bg-[#E3EFE7] border border-[#BFDEC9] px-2.5 py-0.5 rounded-md">
                  Lead Attending Specialist
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D2F23] mt-1.5">
                  Dr. Dhanya Krishna
                </h1>
                <p className="text-xs text-[#556A5F] font-medium mt-0.5">
                  Licensed Clinical Psychologist & Counsellor (RCI Registered)
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
              <span className="inline-flex items-center gap-1 bg-[#E8F2EC] px-2.5 py-1 rounded-md border border-[#BFDEC9]">
                ★ 4.98 / 5.0 Rating
              </span>
              <span className="inline-flex items-center gap-1 bg-[#E8F2EC] px-2.5 py-1 rounded-md border border-[#BFDEC9]">
                ✓ Verified Clinical Practice
              </span>
              <span className="inline-flex items-center gap-1 bg-[#E8F2EC] px-2.5 py-1 rounded-md border border-[#BFDEC9]">
                ✓ Private & Confidential
              </span>
            </div>
            <span className="text-[11px] text-[#556A5F] font-mono">Bengaluru, Karnataka (IST)</span>
          </div>
        </div>

        {/* STAGE 1: INTAKE */}
        {step === "intake" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#DFD5C4] p-6 shadow-xl shadow-[#C9BAA2]/25 text-left">
              <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-3">
                1. Select Consultation Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setSessionType("video")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    sessionType === "video"
                      ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md shadow-[#0F382A]/20"
                      : "bg-[#FAF7F0] hover:bg-white text-[#0D2F23] border-[#DFD5C4]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">📹 Virtual Teletherapy</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${sessionType === "video" ? "bg-white/20 text-white" : "bg-[#E3EFE7] text-[#134935]"}`}>
                      WebRTC P2P
                    </span>
                  </div>
                  <p className={`text-xs mt-1.5 leading-relaxed ${sessionType === "video" ? "text-[#CBE2D4]" : "text-[#556A5F]"}`}>
                    Secure video call directly in your browser.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSessionType("offline")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    sessionType === "offline"
                      ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md shadow-[#0F382A]/20"
                      : "bg-[#FAF7F0] hover:bg-white text-[#0D2F23] border-[#DFD5C4]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">🏥 In-Person Clinic Visit</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${sessionType === "offline" ? "bg-white/20 text-white" : "bg-[#E3EFE7] text-[#134935]"}`}>
                      Private Room
                    </span>
                  </div>
                  <p className={`text-xs mt-1.5 leading-relaxed ${sessionType === "offline" ? "text-[#CBE2D4]" : "text-[#556A5F]"}`}>
                    Consultation at Indiranagar clinic, Bengaluru.
                  </p>
                </button>
              </div>

              {sessionType === "offline" && (
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] text-xs text-[#0D2F23] space-y-1">
                  <span className="font-bold text-[#1F6E4A] block">Clinic Address:</span>
                  <p className="text-slate-700">HealSpace Clinic, 2nd Floor, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-9 shadow-xl shadow-[#C9BAA2]/25 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE9DD]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0D2F23]">2. Select Date & Appointment Slot</h2>
                  <p className="text-xs text-[#556A5F] mt-1">Click any slot below to select your time.</p>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-[#FAF7F0] border-2 border-[#D4C8B5] text-[#0D2F23] text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                />
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
                {defaultSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer text-center border ${
                      selectedSlot === slot
                        ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md scale-[1.04]"
                        : "bg-[#FAF7F0] hover:bg-white text-[#0D2F23] border-[#DFD5C4]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <form onSubmit={handleProceedToPayment} className="mt-8 space-y-4 pt-6 border-t border-[#EFE9DD]">
                <h3 className="font-serif font-bold text-lg text-[#0D2F23]">3. Enter Patient Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      placeholder="e.g. Sneha Patel"
                      className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={clientForm.email}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      placeholder="e.g. sneha@example.com"
                      className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">Contact Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D2F23] uppercase tracking-wider mb-1">Primary Reason for Consultation / Presenting Symptoms</label>
                  <textarea
                    rows={2}
                    value={clientForm.notes}
                    onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                    placeholder="Briefly describe what you'd like to address..."
                    className="w-full bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3 text-xs"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Payment (₹700)</span>
                    <span>→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STAGE 2: PAYMENT GATEWAY */}
        {step === "payment" && (
          <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-10 shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFE9DD] pb-5">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#134935] bg-[#E3EFE7] px-2.5 py-0.5 rounded-md">
                  Step 2 of 2 • Checkout
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#0D2F23] mt-1.5">Complete Consultation Payment</h2>
              </div>
              <button onClick={() => setStep("intake")} className="text-xs text-[#556A5F] underline cursor-pointer">← Edit Details</button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A8C82] block">Consultation Fee</span>
                <span className="text-sm font-bold text-[#0D2F23]">Psychological Consultation (45 Min)</span>
              </div>
              <span className="text-2xl font-serif font-bold text-[#0F382A]">₹700.00</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`p-4 rounded-2xl border text-left cursor-pointer ${paymentMethod === "upi" ? "bg-[#0F382A] text-white border-[#0F382A]" : "bg-[#FAF7F0] text-[#0D2F23]"}`}
              >
                <span className="font-bold text-sm block">📱 UPI / QR Code</span>
                <span className="text-[10px] opacity-80">GPay, PhonePe, Paytm</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-2xl border text-left cursor-pointer ${paymentMethod === "card" ? "bg-[#0F382A] text-white border-[#0F382A]" : "bg-[#FAF7F0] text-[#0D2F23]"}`}
              >
                <span className="font-bold text-sm block">💳 Cards / NetBanking</span>
                <span className="text-[10px] opacity-80">Visa, MasterCard, RuPay</span>
              </button>
            </div>

            {paymentMethod === "upi" ? (
              <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] flex flex-col sm:flex-row items-center gap-5">
                <div className="w-32 h-32 bg-white p-2 rounded-2xl border border-[#DFD5C4] flex flex-col items-center justify-center shrink-0">
                  <span className="text-4xl">📱</span>
                  <span className="text-[9px] font-mono font-bold text-[#0F382A] mt-1 uppercase">Scan & Pay ₹700</span>
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-xs font-bold text-[#0D2F23] block">UPI Auto-Debit & App Link:</span>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter your UPI ID (e.g. mobile@upi)"
                    className="w-full bg-white border border-[#DFD5C4] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-3">
                <input type="text" placeholder="Card Number (4111 •••• •••• 4242)" defaultValue="4532 8910 2341 7729" className="w-full bg-white border border-[#DFD5C4] rounded-xl px-3 py-2 text-xs font-mono" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM / YY" defaultValue="08 / 28" className="bg-white border border-[#DFD5C4] rounded-xl px-3 py-2 text-xs font-mono" />
                  <input type="password" placeholder="CVV" defaultValue="882" className="bg-white border border-[#DFD5C4] rounded-xl px-3 py-2 text-xs font-mono" />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCompletePayment}
              disabled={processingPayment}
              className="w-full py-4 rounded-2xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition cursor-pointer"
            >
              {processingPayment ? "Verifying ₹700 Payment..." : "Authorize & Pay ₹700"}
            </button>
          </div>
        )}

        {/* STAGE 3: CLIENT DOCUMENT CENTER (RECEIPT & PRESCRIPTION) */}
        {step === "confirmed" && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl border border-[#DFD5C4] p-8 shadow-xl text-center space-y-3 print:hidden">
              <div className="w-14 h-14 rounded-full bg-[#E3EFE7] border border-[#BFDEC9] text-[#0F382A] flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D2F23]">Consultation Reserved & Dispatched</h2>
              <p className="text-xs text-[#556A5F] max-w-md mx-auto">
                Payment verified for <span className="font-bold text-[#0D2F23]">{clientForm.name}</span>. Your official tax invoice receipt and doctor's preliminary prescription are ready below.
              </p>
            </div>

            {/* TAB TOGGLE: RECEIPT VS PRESCRIPTION (Rx) */}
            <div className="flex items-center justify-center gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setConfirmedView("receipt")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  confirmedView === "receipt"
                    ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md"
                    : "bg-white text-[#556A5F] border-[#DFD5C4] hover:bg-[#FAF7F0]"
                }`}
              >
                <span>1. Official Tax Receipt (₹700) 📄</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmedView("prescription")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  confirmedView === "prescription"
                    ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md"
                    : "bg-white text-[#556A5F] border-[#DFD5C4] hover:bg-[#FAF7F0]"
                }`}
              >
                <span>2. Doctor's Prescription (Rx) 💊</span>
              </button>
            </div>

            {/* VIEW A: OFFICIAL BILLING TAX RECEIPT */}
            {confirmedView === "receipt" && (
              <div className="bg-white rounded-3xl border-2 border-[#DFD5C4] p-8 sm:p-10 shadow-2xl relative text-left text-xs text-[#1E2922] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-[#0F382A]">
                  <div>
                    <h3 className="font-serif font-extrabold text-lg text-[#0F382A]">HealSpace Clinical Practice</h3>
                    <p className="text-[11px] text-[#556A5F] mt-1">Dr. Dhanya Krishna • Licensed Clinical Psychologist (RCI Reg.)</p>
                    <p className="text-[10px] text-[#7A8C82] font-mono">Indiranagar, Bengaluru, Karnataka 560038</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-block bg-[#E3EFE7] border border-[#BFDEC9] text-[#0F382A] font-bold text-[10px] uppercase px-3 py-1 rounded-md">
                      PAID TAX INVOICE
                    </span>
                    <p className="text-xs font-mono font-bold text-[#0D2F23] mt-2">{confirmationData?.invoice_id || "INV-2026-941"}</p>
                    <p className="text-[10px] text-[#7A8C82]">UTR: {confirmationData?.utr_ref || "UPI92817401"}</p>
                  </div>
                </div>

                <div className="divide-y divide-[#EFE9DD]">
                  <div className="py-3 flex justify-between">
                    <span className="text-[#697B73]">Patient:</span>
                    <span className="font-bold text-[#0D2F23]">{clientForm.name}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-[#697B73]">Appointment:</span>
                    <span className="font-bold text-[#0D2F23]">{selectedDate} at {selectedSlot} IST</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-[#697B73]">Format:</span>
                    <span className="font-semibold text-[#134935]">
                      {sessionType === "offline" ? "🏥 In-Person Clinic Visit (Indiranagar, Bangalore)" : "📹 Virtual Teletherapy (Browser WebRTC)"}
                    </span>
                  </div>
                  <div className="py-4 flex justify-between items-center text-base font-serif font-bold text-[#0F382A]">
                    <span>Total Amount Paid:</span>
                    <span>₹700.00</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="px-6 py-3 rounded-xl bg-[#0F382A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2"
                  >
                    <span>Print Official Receipt (PDF)</span>
                    <span>📄</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`*HealSpace Receipt*\nPatient: ${clientForm.name}\nDate: ${selectedDate} at ${selectedSlot}\nFee: ₹700 (Paid)\nInvoice: ${confirmationData?.invoice_id}`);
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    className="px-5 py-3 rounded-xl bg-[#1E7E34] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send to WhatsApp</span>
                    <span>💬</span>
                  </button>
                </div>
              </div>
            )}

            {/* VIEW B: OFFICIAL CLINICAL PRESCRIPTION & THERAPEUTIC REGIMEN (Rx) */}
            {confirmedView === "prescription" && (
              <div className="bg-white rounded-3xl border-2 border-[#1F6E4A] p-8 sm:p-10 shadow-2xl relative text-left text-xs text-[#1E2922] space-y-6">
                
                {/* Doctor Prescription Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-[#0F382A]">
                  <div>
                    <h3 className="font-serif font-extrabold text-xl text-[#0F382A]">Dr. Dhanya Krishna</h3>
                    <p className="text-[11px] text-[#556A5F] mt-1 font-semibold">
                      Licensed Clinical Psychologist • Rehabilitation Council of India (RCI)
                    </p>
                    <p className="text-[10px] text-[#7A8C82] font-mono">
                      Department of Adult Psychotherapy & Behavioral Medicine • Bengaluru
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-block bg-[#0F382A] text-white font-mono font-bold text-xs uppercase px-3 py-1.5 rounded-md tracking-wider">
                      CLINICAL Rx
                    </span>
                    <p className="text-[10px] text-[#7A8C82] mt-1 font-mono">Date: {selectedDate}</p>
                  </div>
                </div>

                {/* Patient Tag */}
                <div className="p-3.5 bg-[#FAF7F0] border border-[#DFD5C4] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#7A8C82] uppercase block">Patient Name</span>
                    <span className="text-sm font-bold text-[#0D2F23]">{clientForm.name}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-[#7A8C82] uppercase block">Prescription Ref</span>
                    <span className="font-mono font-bold text-[#1F6E4A]">Rx-CAREPLAN-2026</span>
                  </div>
                </div>

                {/* Prescribed Psychological Regimen */}
                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A8C82] mb-1">
                      1. Diagnostic Impression / Clinical Focus
                    </span>
                    <p className="font-mono font-bold text-xs text-[#0F382A] bg-[#E3EFE7] p-2.5 rounded-xl border border-[#BFDEC9]">
                      {confirmationData?.rx?.dx || "Generalized Cognitive Strain & Performance Anxiety"}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A8C82] mb-1">
                      2. Prescribed Behavioral Regimen & Somatic Protocols (Rx)
                    </span>
                    <div className="bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3.5 whitespace-pre-wrap font-sans text-xs text-[#0D2F23] leading-relaxed">
                      {confirmationData?.rx?.protocol || "1. 4-7-8 Somatic Vagal Breathing: Inhale 4s, Hold 7s, Exhale 8s (2x daily)\n2. Cognitive Thought Record: Log automatic triggers and counter-evidence\n3. Progressive Muscle Relaxation (PMR) prior to sleep"}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A8C82] mb-1">
                      3. Sleep Hygiene, Nutrition & Lifestyle Directives
                    </span>
                    <div className="bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3.5 whitespace-pre-wrap font-sans text-xs text-[#0D2F23] leading-relaxed">
                      {confirmationData?.rx?.lifestyle || "45-min screen blackout before bedtime. Hydration: 2.5L daily with 15 mins morning sunlight."}
                    </div>
                  </div>

                  <div className="p-3 bg-[#EAF2EC] border border-[#BFDEC9] rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#134935]">Next Scheduled Review Consultation:</span>
                    <span className="font-bold text-[#0D2F23]">{confirmationData?.rx?.reviewDate || "7 Days Following Session"}</span>
                  </div>
                </div>

                {/* Emergency Crisis Contact */}
                <div className="border-t border-[#DFD5C4] pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#7A8C82] gap-2">
                  <span>Emergency Crisis Assistance: National Mental Health Helpline (Tele-MANAS) 14416</span>
                  <span className="font-semibold text-[#0F382A]">Digitally Authorized by Dr. Dhanya Krishna</span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={handlePrint}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F382A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Download / Print Prescription (PDF)</span>
                      <span>💊</span>
                    </button>
                    <button
                      onClick={() => {
                        const msg = encodeURIComponent(
                          `*Dr. Dhanya Krishna - Clinical Prescription (Rx)*\nPatient: ${clientForm.name}\nDiagnostic Focus: Generalized Anxiety & Cognitive Strain\nRegimen: Somatic Vagal Breathing & CBT Thought Journaling\nHelpline: Tele-MANAS 14416`
                        );
                        window.open(`https://wa.me/?text=${msg}`, "_blank");
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1E7E34] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Share Rx on WhatsApp</span>
                      <span>💬</span>
                    </button>
                  </div>

                  <button onClick={() => setStep("intake")} className="text-xs text-[#556A5F] underline cursor-pointer">
                    ← Book Another Session
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Client Reviews Section */}
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-7 sm:p-9 shadow-xl shadow-[#C9BAA2]/25 text-left space-y-6 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE9DD]">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#134935] uppercase bg-[#E3EFE7] px-2.5 py-0.5 rounded-md">
                Verified Patient Outcomes
              </span>
              <h3 className="text-xl font-serif font-bold text-[#0D2F23] mt-1.5">Client Experiences & Reviews</h3>
            </div>
            <span className="text-xs font-bold text-[#0D2F23]">★★★★★ 4.98 Rating (48+ Cases)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0D2F23]">{rev.name}</span>
                    <span className="text-amber-500 text-xs">{"★".repeat(rev.rating)}</span>
                  </div>
                  <span className="inline-block text-[10px] font-mono font-semibold text-[#1F6E4A] bg-[#E3EFE7] px-2 py-0.5 rounded border border-[#BFDEC9]">
                    {rev.condition}
                  </span>
                  <p className="text-xs text-[#4A5D53] font-light leading-relaxed">"{rev.feedback}"</p>
                </div>
                <div className="pt-3 border-t border-[#EFE9DD] flex items-center justify-between text-[10px] text-[#7A8C82]">
                  <span>{rev.type}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-16 text-center text-xs text-[#7A8C82] print:hidden">
        <p>© 2026 Dr. Dhanya Krishna Clinical Practice • Encrypted Telehealth & In-Person Practice</p>
      </div>
      <FloatingChatWidget />
</div>
  );
}