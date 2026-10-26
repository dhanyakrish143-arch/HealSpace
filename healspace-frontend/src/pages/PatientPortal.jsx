import ChatWindow from "../../components/chat/ChatWindow";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PatientPortal() {
  const [lookupQuery, setLookupQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);
  const [viewMode, setViewMode] = useState("prescription");

  const records = [
    {
      name: "Sneha Patel",
      phone: "9876543210",
      email: "sneha@example.com",
      invoice_id: "INV-2026-841",
      utr_ref: "UPI68559856",
      date: "23 Oct 2026",
      time: "03:30 PM",
      format: "Virtual Teletherapy (WebRTC)",
      amount: 700,
      rx: {
        id: "Rx-2026-104",
        dx: "F41.1 Generalized Anxiety & Performance Overwhelm",
        protocol: "1. 4-7-8 Somatic Vagal Breathing (5 mins morning & evening)\n2. Cognitive Thought Record: Document catastrophic loops & formulate rational counters\n3. Progressive Muscle Relaxation (PMR) protocol",
        lifestyle: "Digital cutoff 45 mins prior to sleep. Daily 20-min brisk morning walk.",
        reviewDate: "30 Oct 2026",
      }
    },
    {
      name: "Ananya Sharma",
      phone: "9845211092",
      email: "ananya.s@gmail.com",
      invoice_id: "INV-2026-081",
      utr_ref: "UPI92817401",
      date: "23 Oct 2026",
      time: "10:30 AM",
      format: "Virtual Teletherapy (WebRTC)",
      amount: 700,
      rx: {
        id: "Rx-2026-092",
        dx: "F41.1 Generalized Anxiety Disorder",
        protocol: "1. Diaphragmatic paced breathing exercises\n2. Graded exposure ladder for public discourse triggers\n3. Interoceptive exposure training",
        lifestyle: "Limit caffeine to 1 cup prior to 11 AM. 15 mins daily morning sunlight.",
        reviewDate: "30 Oct 2026",
      }
    }
  ];

  const handleLookup = (e) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = lookupQuery.trim().toLowerCase();
    const found = records.find(
      (r) =>
        r.phone.includes(cleanQuery) ||
        r.email.toLowerCase().includes(cleanQuery) ||
        r.name.toLowerCase().includes(cleanQuery)
    );
    setActiveRecord(found || null);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1E2922] font-sans py-10 px-4 sm:px-6 relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F382A] hover:text-[#184F3B] bg-white/80 hover:bg-white border border-[#DFD5C4] px-4 py-2.5 rounded-xl transition shadow-xs"
        >
          <span>← Back to Clinic Home</span>
        </Link>
        <span className="text-[11px] font-mono text-[#556A5F] uppercase tracking-widest font-semibold">
          Patient Document Retrieval
        </span>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-8 shadow-xl text-center space-y-3 print:hidden">
          <div className="w-12 h-12 rounded-full bg-[#0F382A] text-white flex items-center justify-center mx-auto shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D2F23]">
            My Prescriptions & Receipts
          </h1>
          <p className="text-xs text-[#556A5F] max-w-md mx-auto">
            Retrieve your authorized medical prescriptions (Rx), care plans, and insurance tax receipts from Dr. Dhanya Krishna.
          </p>

          <form onSubmit={handleLookup} className="pt-4 max-w-md mx-auto flex gap-2">
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter phone number, email, or name..."
              className="flex-1 bg-[#FAF7F0] border border-[#DFD5C4] focus:border-[#0F382A] rounded-xl px-4 py-3 text-xs text-[#0D2F23] focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
            >
              Lookup
            </button>
          </form>
        </div>

        {searched && !activeRecord && (
          <div className="bg-white rounded-3xl border border-[#DFD5C4] p-8 text-center space-y-2">
            <p className="font-serif font-bold text-base text-[#0D2F23]">No Records Found</p>
            <p className="text-xs text-[#556A5F]">
              No active records found matching "{lookupQuery}". Try searching with "Sneha Patel" or "9876543210".
            </p>
          </div>
        )}

        {activeRecord && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setViewMode("prescription")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  viewMode === "prescription"
                    ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md"
                    : "bg-white text-[#556A5F] border-[#DFD5C4] hover:bg-[#FAF7F0]"
                }`}
              >
                <span>Doctor's Prescription (Rx) 💊</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("receipt")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                  viewMode === "receipt"
                    ? "bg-[#0F382A] text-white border-[#0F382A] shadow-md"
                    : "bg-white text-[#556A5F] border-[#DFD5C4] hover:bg-[#FAF7F0]"
                }`}
              >
                <span>Tax Invoice Receipt (₹700) 📄</span>
              </button>
            </div>

            {viewMode === "prescription" && (
              <div className="bg-white rounded-3xl border-2 border-[#1F6E4A] p-8 sm:p-10 shadow-2xl relative text-left text-xs text-[#1E2922] space-y-6">
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
                    <span className="inline-block bg-[#0F382A] text-white font-mono font-bold text-xs uppercase px-3 py-1.5 rounded-md">
                      CLINICAL Rx
                    </span>
                    <p className="text-[10px] text-[#7A8C82] mt-1 font-mono">{activeRecord.rx.id}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF7F0] border border-[#DFD5C4] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#7A8C82] uppercase block">Patient Name</span>
                    <span className="text-sm font-bold text-[#0D2F23]">{activeRecord.name}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-[#7A8C82] uppercase block">Consultation Date</span>
                    <span className="font-mono font-bold text-[#1F6E4A]">{activeRecord.date} at {activeRecord.time}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A8C82] mb-1">
                      1. Diagnostic Impression / Clinical Focus
                    </span>
                    <p className="font-mono font-bold text-xs text-[#0F382A] bg-[#E3EFE7] p-2.5 rounded-xl border border-[#BFDEC9]">
                      {activeRecord.rx.dx}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A8C82] mb-1">
                      2. Prescribed Behavioral Regimen & Somatic Protocols (Rx)
                    </span>
                    <div className="bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3.5 whitespace-pre-wrap font-sans text-xs text-[#0D2F23] leading-relaxed">
                      {activeRecord.rx.protocol}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7A8C82] mb-1">
                      3. Sleep Hygiene, Nutrition & Lifestyle Directives
                    </span>
                    <div className="bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl p-3.5 whitespace-pre-wrap font-sans text-xs text-[#0D2F23] leading-relaxed">
                      {activeRecord.rx.lifestyle}
                    </div>
                  </div>

                  <div className="p-3 bg-[#EAF2EC] border border-[#BFDEC9] rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#134935]">Next Scheduled Review Consultation:</span>
                    <span className="font-bold text-[#0D2F23]">{activeRecord.rx.reviewDate}</span>
                  </div>
                </div>

                <div className="border-t border-[#DFD5C4] pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#7A8C82] gap-2">
                  <span>Emergency Crisis Assistance: National Mental Health Helpline (Tele-MANAS) 14416</span>
                  <span className="font-semibold text-[#0F382A]">Digitally Authorized by Dr. Dhanya Krishna</span>
                </div>

                <div className="pt-2 flex items-center gap-3 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2"
                  >
                    <span>Download / Print Rx (PDF)</span>
                    <span>💊</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `*Dr. Dhanya Krishna - Clinical Prescription (${activeRecord.rx.id})*\nPatient: ${activeRecord.name}\nDiagnostic Focus: ${activeRecord.rx.dx}\nRegimen: Somatic Vagal Breathing & Thought Journaling\nCrisis Helpline: 14416`
                      );
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    className="px-5 py-3 rounded-xl bg-[#1E7E34] hover:bg-[#155D27] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Share on WhatsApp</span>
                    <span>💬</span>
                  </button>
                </div>
              </div>
            )}

            {viewMode === "receipt" && (
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
                    <p className="text-xs font-mono font-bold text-[#0D2F23] mt-2">{activeRecord.invoice_id}</p>
                    <p className="text-[10px] text-[#7A8C82]">UTR: {activeRecord.utr_ref}</p>
                  </div>
                </div>

                <div className="divide-y divide-[#EFE9DD]">
                  <div className="py-3 flex justify-between">
                    <span className="text-[#697B73]">Patient:</span>
                    <span className="font-bold text-[#0D2F23]">{activeRecord.name}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-[#697B73]">Appointment Date:</span>
                    <span className="font-bold text-[#0D2F23]">{activeRecord.date} at {activeRecord.time} IST</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-[#697B73]">Format:</span>
                    <span className="font-semibold text-[#134935]">{activeRecord.format}</span>
                  </div>
                  <div className="py-4 flex justify-between items-center text-base font-serif font-bold text-[#0F382A]">
                    <span>Total Amount Paid:</span>
                    <span>₹{activeRecord.amount}.00</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-xl bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2"
                  >
                    <span>Print Receipt (PDF)</span>
                    <span>📄</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`*HealSpace Receipt*\nPatient: ${activeRecord.name}\nDate: ${activeRecord.date}\nAmount: ₹700 (Paid)\nInvoice: ${activeRecord.invoice_id}`);
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    className="px-5 py-3 rounded-xl bg-[#1E7E34] text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Share on WhatsApp</span>
                    <span>💬</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-16 text-center text-xs text-[#7A8C82] print:hidden">
        <p>© 2026 Dr. Dhanya Krishna Clinical Practice • Encrypted Telehealth & In-Person Practice</p>
      </div>
    </div>
  );
}