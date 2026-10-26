import FloatingChatWidget from "../../components/FloatingChatWidget";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [selectedPathway, setSelectedPathway] = useState("anxiety");

  const pathways = [
    {
      id: "anxiety",
      title: "Anxiety & Stress",
      subtitle: "Reduce worry, build coping skills, restore calm.",
      bg: "bg-[#FFF5F2] hover:bg-[#FFEBE5]",
      border: "border-[#F8D5CB]",
      activeBorder: "border-[#D95D39] ring-2 ring-[#D95D39]/20",
      iconBg: "bg-[#FBE2DA] text-[#D95D39]",
      badgeBg: "bg-[#D95D39] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      details: "Structured Cognitive Behavioral Therapy (CBT) protocols targeting intrusive cognitive loops, visceral chest pressure, and anticipatory panic triggers."
    },
    {
      id: "depression",
      title: "Depression & Mood",
      subtitle: "Rebuild motivation, improve focus, rediscover balance.",
      bg: "bg-[#F0F7F2] hover:bg-[#E4F2E8]",
      border: "border-[#C9E5D2]",
      activeBorder: "border-[#1F6E4A] ring-2 ring-[#1F6E4A]/20",
      iconBg: "bg-[#D8ECD8] text-[#1F6E4A]",
      badgeBg: "bg-[#1F6E4A] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      details: "Behavioral activation, neuro-affective stabilization, and energy replenishment protocols to lift cognitive exhaustion and emotional numbness."
    },
    {
      id: "transitions",
      title: "Life Transitions",
      subtitle: "Navigate change, build resilience, create your next chapter.",
      bg: "bg-[#F7F2FA] hover:bg-[#EFE7F6]",
      border: "border-[#DECDE9]",
      activeBorder: "border-[#6C3E93] ring-2 ring-[#6C3E93]/20",
      iconBg: "bg-[#E6D8F2] text-[#6C3E93]",
      badgeBg: "bg-[#6C3E93] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      details: "Frameworks for career redirection, burnout de-escalation, relocation stress, and identity navigation with focused psychological fortitude."
    },
    {
      id: "relationships",
      title: "Relationship & Self-esteem",
      subtitle: "Build healthier patterns, strengthen self-worth.",
      bg: "bg-[#FAF5EC] hover:bg-[#F5EBD7]",
      border: "border-[#EADBBE]",
      activeBorder: "border-[#A06914] ring-2 ring-[#A06914]/20",
      iconBg: "bg-[#EFE1C6] text-[#A06914]",
      badgeBg: "bg-[#A06914] text-white",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      details: "Attachment reconstruction, communication boundary design, and imposter syndrome deconditioning for authentic emotional reciprocity."
    }
  ];

  const reviews = [
    {
      name: "S. K. Rao",
      rating: 5,
      date: "October 2026",
      condition: "Generalized Anxiety & Panic",
      feedback: "Dr. Dhanya Krishna's CBT protocols gave me tangible coping tools within 3 sessions. The somatic breathing techniques significantly reduced my morning panic attacks.",
      type: "Virtual Consultation"
    },
    {
      name: "Meera Sen",
      rating: 5,
      date: "September 2026",
      condition: "Workplace Executive Burnout",
      feedback: "Structured, calm, and insightful. She helped me draw boundaries at work and overcome persistent imposter feelings without compromising my career progress.",
      type: "In-Person Clinic Visit"
    },
    {
      name: "A. Patel",
      rating: 5,
      date: "August 2026",
      condition: "Relational Dynamics & Grief",
      feedback: "A truly quiet, non-judgmental sanctuary. Her guidance helped me untangle complex emotional grief and rebuild internal resilience.",
      type: "Virtual Consultation"
    }
  ];

  const activeData = pathways.find((p) => p.id === selectedPathway);

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1E2922] font-sans selection:bg-[#D5E6DC] selection:text-[#0C3224] relative overflow-x-hidden">
      
      {/* Atmosphere Glows */}
      <div className="absolute top-[-80px] right-[-100px] w-[650px] h-[650px] bg-gradient-to-bl from-[#DCECE0]/70 via-[#F3E7D5]/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[35%] left-[-150px] w-[550px] h-[550px] bg-gradient-to-tr from-[#E6D9C8]/60 via-[#F5EFE6]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Clean Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#F6F1E7]/90 border-b border-[#E3D9C9] transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#0F382A] text-[#E8F2EC] flex items-center justify-center shadow-md shadow-[#0F382A]/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
            </div>
            <div className="text-left">
              <span className="font-serif font-extrabold text-xl text-[#0F382A] tracking-tight block leading-none">
                Heal<span className="italic font-normal text-[#2E7A5A]">Space</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#6D7F75] font-bold block mt-1">
                Clinical Psychology
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold tracking-wide text-[#4E6157]">
            <a href="#home" className="text-[#0F382A] font-bold transition hover:text-[#0F382A]">Home</a>
            <a href="#pathways" className="hover:text-[#0F382A] transition">Pathways</a>
            <a href="#standards" className="hover:text-[#0F382A] transition">Care Standards</a>
            <a href="#about" className="hover:text-[#0F382A] transition">About</a>
            <a href="#reviews" className="hover:text-[#0F382A] transition">Reviews</a>
            <Link to="/my-portal" className="text-[#1F6E4A] hover:text-[#0F382A] font-bold flex items-center gap-1.5 bg-[#E8F2EC] px-3.5 py-1.5 rounded-xl border border-[#BFDEC9] transition shadow-xs">
              <span>My Records (Rx)</span>
              <span>&#128138;</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dhanya-krishna"
              className="inline-flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-full bg-[#0F382A] hover:bg-[#184F3B] text-white shadow-md shadow-[#0F382A]/20 hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-4 h-4 text-[#C0DEC9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Reserve Session</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E3EFE7] border border-[#BFDEC9] text-[#134935] text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#207D58] animate-pulse" />
              Live Virtual &amp; In-Person Consultations &bull; Patient intake open
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif text-[#0D2F23] leading-[1.12] tracking-tight">
              Specialized clinical care for a{" "}
              <span className="italic font-light text-[#1B573F] underline decoration-[#BFDEC9] underline-offset-8">
                grounded, resilient mind.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#40544A] leading-relaxed max-w-xl font-normal">
              Confidential, evidence-based psychotherapy conducted directly with Dr. Dhanya Krishna. Designed to alleviate acute cognitive distress, restructure negative thought spirals, and restore emotional stability.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/dhanya-krishna"
                className="inline-flex items-center gap-2.5 bg-[#0F382A] hover:bg-[#184F3B] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-[#0F382A]/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-4 h-4 text-[#BFDEC9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Select Appointment Slot</span>
                <span>&rarr;</span>
              </Link>
              <a
                href="#pathways"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border-2 border-[#D4C8B5] bg-white/70 hover:bg-white text-[#184F3B] text-xs uppercase tracking-wider font-bold transition shadow-xs"
              >
                <svg className="w-4 h-4 text-[#1F6E4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Explore Treatment Pathways</span>
              </a>
            </div>

            <div className="pt-6 border-t border-[#DFD5C4] flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E3EFE7] border border-[#BFDEC9] flex items-center justify-center text-[#0F382A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-base font-bold text-[#0D2F23]">100%</span>
                  <span className="block text-[11px] text-[#556A5F] font-semibold uppercase tracking-wider">Confidential</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E3EFE7] border border-[#BFDEC9] flex items-center justify-center text-[#0F382A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-base font-bold text-[#0D2F23]">45-50 Min</span>
                  <span className="block text-[11px] text-[#556A5F] font-semibold uppercase tracking-wider">Session</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E3EFE7] border border-[#BFDEC9] flex items-center justify-center text-[#0F382A]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-base font-bold text-[#0D2F23]">Online / Clinic</span>
                  <span className="block text-[11px] text-[#556A5F] font-semibold uppercase tracking-wider">Formats</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Practitioner Card */}
          <div className="lg:col-span-5" id="about">
            <div className="bg-white rounded-3xl border border-[#DFD5C4] p-8 shadow-2xl shadow-[#C9BAA2]/30 relative text-left">
              
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#EFE9DD]">
                <div className="flex items-center gap-4">
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
                    <h3 className="text-2xl font-serif font-bold text-[#0D2F23] mt-1">
                      Dr. Dhanya Krishna
                    </h3>
                    <p className="text-xs text-[#556A5F] font-medium">Licensed Clinical Psychologist &amp; Counsellor</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-serif font-bold text-[#0D2F23]">{"\u20B9"}700</span>
                  <span className="block text-[10px] text-[#7A8C82] uppercase tracking-wider font-bold">per 45-min</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#134935]">
                <span className="inline-flex items-center gap-1.5 bg-[#E8F2EC] px-3 py-1 rounded-md border border-[#BFDEC9]">
                  <span className="text-[#1F6E4A]">&#10003;</span> RCI Registered
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#E8F2EC] px-3 py-1 rounded-md border border-[#BFDEC9]">
                  <span className="text-[#1F6E4A]">&#10003;</span> Valid Clinical License
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#E8F2EC] px-3 py-1 rounded-md border border-[#BFDEC9]">
                  <span className="text-[#1F6E4A]">&#10003;</span> Verified Profile
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2.5 text-left">
                <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#EBE3D3]">
                  <div className="w-7 h-7 rounded-lg bg-[#E3EFE7] text-[#0F382A] flex items-center justify-center mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#0D2F23]">Evidence-based</h5>
                  <p className="text-[10px] text-[#697B73] mt-1 leading-tight">Proven clinical methods</p>
                </div>

                <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#EBE3D3]">
                  <div className="w-7 h-7 rounded-lg bg-[#E3EFE7] text-[#0F382A] flex items-center justify-center mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#0D2F23]">Confidential</h5>
                  <p className="text-[10px] text-[#697B73] mt-1 leading-tight">1-to-1 encryption</p>
                </div>

                <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#EBE3D3]">
                  <div className="w-7 h-7 rounded-lg bg-[#E3EFE7] text-[#0F382A] flex items-center justify-center mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-[11px] text-[#0D2F23]">EHR Records</h5>
                  <p className="text-[10px] text-[#697B73] mt-1 leading-tight">Standardized SOAP files</p>
                </div>
              </div>

              <Link
                to="/dhanya-krishna"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#0F382A] hover:bg-[#184F3B] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-2xl transition shadow-lg shadow-[#0F382A]/25"
              >
                <svg className="w-4 h-4 text-[#BFDEC9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>View Real-Time Schedule</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Standards Strip */}
      <section id="standards" className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-6 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#0F382A] flex items-center justify-center shrink-0 border border-[#BFDEC9]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-[#0D2F23]">Confidential by design</h5>
              <p className="text-xs text-[#556A5F] mt-0.5">Your privacy is our priority</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#0F382A] flex items-center justify-center shrink-0 border border-[#BFDEC9]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-[#0D2F23]">Evidence-based care</h5>
              <p className="text-xs text-[#556A5F] mt-0.5">Proven methods. Better outcomes.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#0F382A] flex items-center justify-center shrink-0 border border-[#BFDEC9]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-[#0D2F23]">Virtual &amp; In-Person</h5>
              <p className="text-xs text-[#556A5F] mt-0.5">Online P2P or Indiranagar Clinic</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#0F382A] flex items-center justify-center shrink-0 border border-[#BFDEC9]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-[#0D2F23]">Transparent pricing</h5>
              <p className="text-xs text-[#556A5F] mt-0.5">{"\u20B9"}700 per 45-min consultation</p>
            </div>
          </div>

        </div>
      </section>

      {/* Pathways Grid */}
      <section id="pathways" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-left mb-10">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#1B573F] block font-mono">Clinical Care Pathways</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-1">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#0D2F23]">
              Personalized support for <span className="italic font-light">your unique journey.</span>
            </h2>
            <p className="text-xs text-[#556A5F] max-w-md font-medium">
              Evidence-based treatment pathways tailored to your needs, from anxiety and depression to stress, life transitions, and more.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((item) => {
            const isSelected = selectedPathway === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPathway(item.id)}
                className={`p-7 rounded-3xl border transition-all duration-300 cursor-pointer text-left relative flex flex-col justify-between ${item.bg} ${
                  isSelected ? `${item.activeBorder} shadow-xl scale-[1.03] bg-white` : `${item.border} shadow-sm hover:shadow-md`
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-xs ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <h4 className="font-serif font-bold text-xl text-[#0D2F23]">{item.title}</h4>
                  <p className="text-xs text-[#4A5D53] mt-2.5 leading-relaxed font-normal">{item.subtitle}</p>
                </div>

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-black/5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0D2F23]">Clinical Scope</span>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition ${
                    isSelected ? item.badgeBg : "bg-white text-slate-700"
                  }`}>
                    &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-3xl p-7 sm:p-9 border border-[#DFD5C4] shadow-md text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#134935] bg-[#E3EFE7] px-3 py-1 rounded-md border border-[#BFDEC9]">
              Active Protocol: {activeData?.title}
            </span>
            <p className="text-sm text-[#2F4137] leading-relaxed pt-2">
              {activeData?.details}
            </p>
          </div>
          <Link
            to="/dhanya-krishna"
            className="shrink-0 text-xs font-bold px-7 py-4 rounded-xl bg-[#0F382A] hover:bg-[#184F3B] text-white transition shadow-md shadow-[#0F382A]/20"
          >
            Book This Pathway &rarr;
          </Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-8 sm:p-10 shadow-xl shadow-[#C9BAA2]/25 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE9DD]">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#134935] uppercase bg-[#E3EFE7] px-2.5 py-0.5 rounded-md">
                Verified Patient Outcomes
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#0D2F23] mt-1.5">
                Client Experiences &amp; Reviews
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-500 text-sm">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span className="text-xs font-bold text-[#0D2F23]">4.98 Rating (48+ Clinical Cases)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((rev, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#DFD5C4] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0D2F23]">{rev.name}</span>
                    <span className="text-amber-500 text-xs">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  </div>
                  <span className="inline-block text-[10px] font-mono font-semibold text-[#1F6E4A] bg-[#E3EFE7] px-2 py-0.5 rounded border border-[#BFDEC9]">
                    {rev.condition}
                  </span>
                  <p className="text-xs text-[#4A5D53] font-light leading-relaxed pt-1">
                    "{rev.feedback}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFE9DD] flex items-center justify-between text-[11px] text-[#7A8C82]">
                  <span className="text-[#134935] font-medium">{rev.type}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Intake Workflow */}
      <section id="intake" className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-[#DFD5C4]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold text-[#1B573F] uppercase tracking-widest block font-mono">Admission</span>
          <h2 className="text-3xl font-serif text-[#0D2F23] mt-1 font-bold">Simple, Secure Consultation Steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-8 rounded-3xl border border-[#DFD5C4] shadow-xs hover:border-[#1F6E4A] transition">
            <span className="text-[10px] font-mono font-bold text-[#134935] bg-[#E3EFE7] px-3 py-1 rounded-md border border-[#BFDEC9]">STEP 01</span>
            <h4 className="font-serif font-bold text-[#0D2F23] text-lg mt-4">Select Slot &amp; Format</h4>
            <p className="text-xs text-[#556A5F] mt-2 leading-relaxed">
              Pick your preferred consultation time, choosing between Virtual WebRTC video or In-Person at Indiranagar clinic.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#DFD5C4] shadow-xs hover:border-[#1F6E4A] transition">
            <span className="text-[10px] font-mono font-bold text-[#134935] bg-[#E3EFE7] px-3 py-1 rounded-md border border-[#BFDEC9]">STEP 02</span>
            <h4 className="font-serif font-bold text-[#0D2F23] text-lg mt-4">Confidential Intake</h4>
            <p className="text-xs text-[#556A5F] mt-2 leading-relaxed">
              Complete your pre-consultation psychiatric screening and history digitally with end-to-end encryption.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#DFD5C4] shadow-xs hover:border-[#1F6E4A] transition">
            <span className="text-[10px] font-mono font-bold text-[#134935] bg-[#E3EFE7] px-3 py-1 rounded-md border border-[#BFDEC9]">STEP 03</span>
            <h4 className="font-serif font-bold text-[#0D2F23] text-lg mt-4">1-to-1 Clinical Visit</h4>
            <p className="text-xs text-[#556A5F] mt-2 leading-relaxed">
              Connect privately via browser WebRTC or attend your scheduled private clinic consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DFD5C4] py-12 bg-white text-xs text-[#556A5F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-sm text-[#0D2F23]">HealSpace Clinical Practice</span>
            <span>&bull;</span>
            <span className="italic font-serif text-[#1F6E4A]">Better days are possible &#9825;</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>100% Confidential Care &bull; Virtual &amp; Offline</span>
            <span>&bull;</span>
            <Link to="/login" className="text-[#0F382A] hover:underline font-bold transition">
              Practitioner Staff Access &rarr;
            </Link>
          </div>
        </div>
      </footer>
      <FloatingChatWidget />
</div>
  );
}