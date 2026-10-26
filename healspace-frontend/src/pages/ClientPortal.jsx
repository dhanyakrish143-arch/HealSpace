import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow";

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("records");
  const [clientData] = useState({
    name: "Ananya Sharma",
    email: "ananya.s@gmail.com",
    phone: "+91 98452 11092",
    therapist: "Dr. Dhanya Krishna",
    dx: "F41.1 Generalized Anxiety Disorder",
    sessionCount: 4,
  });

  const [sharedNotes] = useState([
    {
      _id: "sn_1",
      title: "CBT Care Plan & Somatic Vagal Protocol",
      createdAt: "2026-10-22",
      shared_content: {
        dx: "F41.1 Generalized Anxiety Disorder",
        regimen: "1. Somatic 4-7-8 Breathing (Morning & Evening)\n2. Cognitive Thought Record (ABC Model for cognitive traps)\n3. Progressive Muscle Relaxation before bed",
        lifestyle: "Digital cutoff 45 mins prior to bedtime. 20-min morning sunlight walk.",
        next_review: "30 Oct 2026",
      },
    },
  ]);

  const [invoices] = useState([
    {
      invoice_number: "INV-2026-081",
      date: "22 Oct 2026",
      amount: 700,
      status: "PAID",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1E2922] font-sans py-8 px-4 sm:px-6 text-left">
      {/* Top Client Navigation */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#0F382A] text-[#E8F2EC] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-[#0D2F23]">HealSpace Patient Portal</span>
            <span className="text-[9px] uppercase tracking-widest text-[#556A5F] block font-bold">Confidential Access</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-xs font-bold text-[#0F382A] bg-white border border-[#DFD5C4] px-3.5 py-1.5 rounded-xl hover:bg-[#FAF7F0] transition"
          >
            Switch to Doctor View 🔐
          </Link>
          <Link
            to="/dhanya-krishna"
            className="text-xs font-bold text-white bg-[#0F382A] px-4 py-2 rounded-xl hover:bg-[#184F3B] transition"
          >
            Book New Slot
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Patient Profile Card */}
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-6 sm:p-8 shadow-xl shadow-[#C9BAA2]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE9DD]">
            <div>
              <span className="text-[10px] font-bold text-[#134935] uppercase bg-[#E3EFE7] px-2.5 py-0.5 rounded-md border border-[#BFDEC9]">
                Verified Patient Account
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0D2F23] mt-1">{clientData.name}</h2>
              <p className="text-xs text-[#556A5F] font-mono mt-0.5">{clientData.email} • {clientData.phone}</p>
            </div>
            <div className="bg-[#FAF7F0] border border-[#DFD5C4] px-4 py-2.5 rounded-2xl text-right">
              <span className="block text-[10px] font-bold text-[#7A8C82] uppercase">Attending Clinician</span>
              <span className="text-sm font-serif font-bold text-[#0D2F23]">{clientData.therapist}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 pt-4 border-b border-[#EFE9DD]">
            <button
              onClick={() => setActiveTab("records")}
              className={"text-xs font-bold uppercase tracking-wider pb-3 px-2 border-b-2 transition cursor-pointer " +
                (activeTab === "records" ? "border-[#0F382A] text-[#0F382A]" : "border-transparent text-[#7A8C82]")}
            >
              My Records & Care Plan (Rx)
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={"text-xs font-bold uppercase tracking-wider pb-3 px-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 " +
                (activeTab === "chat" ? "border-[#0F382A] text-[#0F382A]" : "border-transparent text-[#7A8C82]")}
            >
              <span>Consultation Chat</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={"text-xs font-bold uppercase tracking-wider pb-3 px-2 border-b-2 transition cursor-pointer " +
                (activeTab === "billing" ? "border-[#0F382A] text-[#0F382A]" : "border-transparent text-[#7A8C82]")}
            >
              Tax Invoices
            </button>
          </div>

          {/* TAB 1: SHARED CARE PLAN & RX */}
          {activeTab === "records" && (
            <div className="pt-6 space-y-5">
              <div>
                <h4 className="font-serif font-bold text-base text-[#0D2F23]">Active Prescription & Regimen</h4>
                <p className="text-xs text-[#556A5F]">Prescribed behavioral protocols from Dr. Dhanya Krishna.</p>
              </div>

              {sharedNotes.map((note) => (
                <div key={note._id} className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0D2F23]">{note.title}</span>
                    <span className="text-[10px] font-mono text-[#556A5F]">{note.createdAt}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-[#134935] uppercase text-[10px] block">Therapeutic Protocol:</span>
                      <p className="whitespace-pre-line text-[#1E2922] mt-0.5">{note.shared_content.regimen}</p>
                    </div>
                    <div>
                      <span className="font-bold text-[#134935] uppercase text-[10px] block">Lifestyle Directives:</span>
                      <p className="text-[#1E2922] mt-0.5">{note.shared_content.lifestyle}</p>
                    </div>
                    <div className="text-[10px] text-[#7A8C82] pt-1">
                      Next Follow-up Review: <strong className="text-[#0D2F23]">{note.shared_content.next_review}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: LIVE CONSULTATION CHAT */}
          {activeTab === "chat" && (
            <div className="pt-6 space-y-4">
              <div>
                <h4 className="font-serif font-bold text-base text-[#0D2F23]">Live Chat with Dr. Dhanya Krishna</h4>
                <p className="text-xs text-[#556A5F]">Real-time encrypted communication bridge. Messages sync instantly with the doctor's console.</p>
              </div>

              <ChatWindow
                roomId="session-ananya-sharma"
                senderName="Ananya Sharma"
                role="client"
              />
            </div>
          )}

          {/* TAB 3: BILLING & INVOICES */}
          {activeTab === "billing" && (
            <div className="pt-6 space-y-4">
              <div>
                <h4 className="font-serif font-bold text-base text-[#0D2F23]">Settled Tax Invoices</h4>
                <p className="text-xs text-[#556A5F]">Official GST-compliant receipts generated per visit.</p>
              </div>

              {invoices.map((inv) => (
                <div key={inv.invoice_number} className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#0D2F23] block">{inv.invoice_number}</span>
                    <span className="text-[#7A8C82] text-[11px]">{inv.date} • ₹{inv.amount}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1F6E4A] bg-[#E3EFE7] border border-[#BFDEC9] px-2.5 py-1 rounded-md">
                    ✓ {inv.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
