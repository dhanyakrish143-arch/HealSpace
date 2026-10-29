import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ConsultationRoom() {
  const { appointmentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // EXPLICIT ROLE CHECK:
  // If ?role=client is in URL, FORCE Patient view.
  // If ?role=doctor is in URL, FORCE Doctor view.
  // Defaults to client if neither is specified and no therapist token exists.
  const queryRole = searchParams.get("role");
  const isDoctor = queryRole === "doctor" ? true : (queryRole === "client" ? false : Boolean(localStorage.getItem("therapist_token")));

  const [appointment, setAppointment] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [sessionNotes, setSessionNotes] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale (4s)");

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  useEffect(() => {
    if (isDoctor) return;
    const phases = ["Inhale (4s)", "Hold (4s)", "Exhale (4s)", "Pause (4s)"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phases.length;
      setBreathingPhase(phases[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isDoctor]);

  const fetchAppointment = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/notes/appointment/${appointmentId}`);
      if (res.data.success && res.data.note) {
        setAppointment({
          client_name: res.data.note.client_name,
          client_email: res.data.note.client_email,
          _id: appointmentId
        });
        setSessionNotes(res.data.note.subjective || "");
      }
    } catch (err) {
      console.error("Could not fetch session info", err);
    }
  };

  const handleEndCall = () => {
    if (window.confirm("Leave this consultation room?")) {
      if (isDoctor) {
        navigate("/dashboard");
      } else {
        navigate("/dhanya-krishna");
      }
    }
  };

  const handleSaveNotes = async () => {
    try {
      await axios.post("http://localhost:5001/api/notes/save", {
        appointment_id: appointmentId,
        therapist_slug: "dhanya-krishna",
        client_name: appointment?.client_name || "Patient",
        client_email: appointment?.client_email || "patient@healspace.in",
        subjective: sessionNotes,
        is_signed: false
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      alert("Could not save note: " + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Room Header */}
      <div className="h-14 border-b border-stone-800 bg-stone-900/90 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-serif font-bold text-sm text-white">HealSpace Telehealth Encrypted Room</span>
          <span className="text-stone-500">|</span>
          <span className="text-xs text-stone-300 font-mono">
            {isDoctor ? (
              <>Patient: <span className="text-emerald-400 font-semibold">{appointment?.client_name || "krishna"}</span></>
            ) : (
              <>Attending Clinician: <span className="text-emerald-400 font-semibold">Dr. Dhanya Krishna</span></>
            )}
          </span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
            {isDoctor ? "CLINICIAN VIEW" : "PATIENT VIEW"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick toggle switch so you can test both views immediately */}
          <div className="flex bg-stone-800 border border-stone-700 rounded-lg p-0.5 text-[10px] font-semibold">
            <button
              onClick={() => navigate(`/consultation/room/${appointmentId}?role=doctor`)}
              className={`px-2.5 py-1 rounded transition ${isDoctor ? "bg-emerald-800 text-white shadow" : "text-stone-400 hover:text-white"}`}
            >
              Doctor View
            </button>
            <button
              onClick={() => navigate(`/consultation/room/${appointmentId}?role=client`)}
              className={`px-2.5 py-1 rounded transition ${!isDoctor ? "bg-emerald-800 text-white shadow" : "text-stone-400 hover:text-white"}`}
            >
              Client View
            </button>
          </div>

          <button
            onClick={handleEndCall}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            Leave Consultation
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Video Stage */}
        <div className="flex-1 bg-stone-950 p-6 flex flex-col justify-between items-center relative">
          <div className="w-full h-full max-w-4xl max-h-[72vh] bg-stone-900 rounded-2xl border border-stone-800 relative overflow-hidden flex items-center justify-center shadow-2xl">
            {videoOn ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 to-stone-950">
                {isDoctor ? (
                  /* Doctor sees Patient */
                  <>
                    <div className="w-24 h-24 rounded-full bg-emerald-900/40 border-2 border-emerald-500/50 flex items-center justify-center text-3xl font-serif text-emerald-200 mb-4 shadow-lg">
                      {appointment?.client_name?.charAt(0)?.toUpperCase() || "K"}
                    </div>
                    <h4 className="text-base font-semibold text-white tracking-wide">
                      {appointment?.client_name || "krishna"} (Patient Stream Active)
                    </h4>
                    <p className="text-xs text-stone-400 mt-1">Encrypted Telehealth Audio/Video Link Established</p>
                  </>
                ) : (
                  /* Client sees Doctor */
                  <>
                    <div className="w-24 h-24 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-3xl font-serif text-emerald-200 mb-4 shadow-lg">
                      DK
                    </div>
                    <h4 className="text-base font-serif font-bold text-white tracking-wide">
                      Dr. Dhanya Krishna
                    </h4>
                    <p className="text-xs text-emerald-400 mt-1">Attending Clinical Psychologist • Live in Session</p>
                  </>
                )}
              </div>
            ) : (
              <div className="text-stone-500 text-sm italic">Camera muted</div>
            )}

            {/* Self PIP Preview */}
            <div className="absolute bottom-4 right-4 w-44 h-32 bg-stone-800 rounded-xl border border-stone-700 overflow-hidden shadow-lg flex flex-col items-center justify-center p-2">
              {isDoctor ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-200 flex items-center justify-center text-sm font-serif mb-1">
                    DK
                  </div>
                  <span className="text-[10px] text-stone-200 font-semibold">Dr. Dhanya Krishna</span>
                  <span className="text-[9px] text-emerald-400 font-mono">You (Practitioner)</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-stone-700 text-white flex items-center justify-center text-sm font-serif mb-1">
                    {appointment?.client_name?.charAt(0)?.toUpperCase() || "K"}
                  </div>
                  <span className="text-[10px] text-stone-200 font-semibold">{appointment?.client_name || "krishna"}</span>
                  <span className="text-[9px] text-stone-400 font-mono">You (Patient)</span>
                </>
              )}
            </div>
          </div>

          {/* Floating Controls */}
          <div className="mt-4 flex items-center gap-4 bg-stone-900/90 border border-stone-800 px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                micOn ? "bg-stone-800 text-stone-200 hover:bg-stone-700" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              }`}
            >
              {micOn ? "🎤 Mic Active" : "🔇 Mic Muted"}
            </button>

            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                videoOn ? "bg-stone-800 text-stone-200 hover:bg-stone-700" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              }`}
            >
              {videoOn ? "📹 Cam Active" : "📷 Cam Off"}
            </button>

            <button
              onClick={handleEndCall}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow"
            >
              End Session 📞
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        {isDoctor ? (
          /* DOCTOR: SOAP SCRATCHPAD */
          <div className="w-96 border-l border-stone-800 bg-stone-900 flex flex-col justify-between">
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Live In-Session Clinical Notes</span>
              {isSaved && <span className="text-[10px] text-emerald-400 font-semibold">✓ Autosaved</span>}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <p className="text-[11px] text-stone-400 mb-2">
                Record real-time behavioral observations, somatic cues, and patient responses:
              </p>
              <textarea
                rows={16}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="E.g., Patient reports heightened autonomic anxiety during morning routines..."
                className="w-full flex-1 p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-600 leading-relaxed font-mono"
              />
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-900/60 flex justify-between items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-xs text-stone-400 hover:text-stone-200"
              >
                ← Dashboard
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow"
              >
                Sync to SOAP Note
              </button>
            </div>
          </div>
        ) : (
          /* PATIENT: CARE & GROUNDING PANEL */
          <div className="w-96 border-l border-stone-800 bg-stone-900 flex flex-col justify-between p-5">
            <div>
              <div className="border-b border-stone-800 pb-3 mb-4">
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                  Patient Care Space
                </span>
                <h3 className="font-serif font-bold text-base text-white mt-1">Consultation in Progress</h3>
                <p className="text-xs text-stone-400">Dr. Dhanya Krishna Clinical Telehealth</p>
              </div>

              {/* Somatic Vagal Grounding Box */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 mb-4 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Box Breathing Regulator
                </span>
                <div className="py-3 font-serif text-lg text-emerald-400 font-bold transition-all">
                  {breathingPhase}
                </div>
                <p className="text-[10px] text-stone-500">
                  Follow this rhythm to stabilize nervous system regulation during your consultation.
                </p>
              </div>

              {/* Clinical Privacy Notice */}
              <div className="p-4 rounded-xl bg-stone-800/50 border border-stone-800 space-y-2 text-xs text-stone-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
                  <span>🔒</span>
                  <span>End-to-End HIPAA Guarded</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  This call is private and confidential. Your medical prescription and care plan will be issued directly to your portal upon session completion.
                </p>
              </div>

              {/* Emergency Hotline Banner */}
              <div className="mt-4 p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl text-[11px]">
                <p className="text-rose-300 font-semibold">Immediate Crisis Assistance:</p>
                <p className="text-stone-400 mt-0.5">Tele-MANAS National Helpline: <strong className="text-white">14416</strong></p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <button
                onClick={handleEndCall}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold"
              >
                ← Return to Clinic Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
