import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

export default function LoginPage() {
  const [email, setEmail] = useState("dhanyakrishna@1.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });
      if (res.data && res.data.token) {
        login(res.data.token, res.data.therapist);
        navigate("/dashboard");
      } else {
        setError("Unauthorized access: credentials not recognized.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Authentication failed. Please verify your practitioner passkey."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1E2922] font-sans selection:bg-[#D5E6DC] selection:text-[#0C3224] flex flex-col justify-between p-6 relative overflow-x-hidden">
      
      {/* Warm Ambient Botanical Atmosphere Glows */}
      <div className="absolute top-[-80px] right-[-100px] w-[550px] h-[550px] bg-gradient-to-bl from-[#DCECE0]/70 via-[#F3E7D5]/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-[#E6D9C8]/60 via-[#F5EFE6]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header / Public Site Return */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F382A] hover:text-[#184F3B] bg-white/80 hover:bg-white border border-[#DFD5C4] px-4 py-2 rounded-xl transition shadow-xs"
        >
          <span>← Clinic Home</span>
        </Link>
        <span className="text-[10px] font-mono text-[#556A5F] uppercase tracking-widest font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F6E4A] animate-pulse" />
          Encrypted Admin Terminal
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl border border-[#DFD5C4] p-8 sm:p-10 shadow-2xl shadow-[#C9BAA2]/30 text-left relative">
          
          {/* Header & Professional Clinical Emblem */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F382A] via-[#164836] to-[#0B2A1F] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0F382A]/25 border border-[#2D6650]/40 p-3">
              <svg 
                className="w-full h-full text-[#E2EFE7]" 
                viewBox="0 0 48 48" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.4"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Central Clinical Stem */}
                <path d="M24 6v36" />
                {/* Balanced Caduceus Wings / Botanical Care Curves */}
                <path d="M12 18c0 8 12 14 12 14s12-6 12-14" />
                <path d="M15 13c3-3 6-4 9-4s6 1 9 4" strokeWidth="2" strokeDasharray="1 3" />
                {/* Grounding Base Cross Accent */}
                <path d="M18 42h12" strokeWidth="2.8" />
                {/* Upper Star of Excellence */}
                <circle cx="24" cy="6" r="2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-[#134935] uppercase bg-[#E3EFE7] border border-[#BFDEC9] px-3 py-1 rounded-md inline-block">
                Practitioner Console
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0D2F23] mt-2">
                Dr. Dhanya Krishna
              </h2>
              <p className="text-xs text-[#556A5F] mt-1 font-light">
                Restricted clinical access for authorized practice management
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-[#FFF2F0] border border-[#F8C6C0] text-[#B92B27] text-xs p-3.5 rounded-xl font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-[#B92B27]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-[#0D2F23] uppercase tracking-wider mb-1.5">
                Official Clinical Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dhanyakrishna@1.com"
                  className="w-full bg-[#FAF7F0] border border-[#DFD5C4] focus:border-[#0F382A] focus:bg-white rounded-xl py-3 px-4 text-xs font-medium text-[#0D2F23] focus:outline-none transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-[#0D2F23] uppercase tracking-wider">
                  Security Passkey
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-[#556A5F] hover:text-[#0F382A] font-semibold transition cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F0] border border-[#DFD5C4] focus:border-[#0F382A] focus:bg-white rounded-xl py-3 px-4 text-xs font-medium text-[#0D2F23] focus:outline-none transition shadow-inner tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F382A] hover:bg-[#184F3B] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-[#0F382A]/25 hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In to Clinical Dashboard</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Security Subtext */}
          <div className="mt-8 pt-6 border-t border-[#EFE9DD] text-center space-y-2">
            <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-[#134935]">
              <span className="flex items-center gap-1">
                <span>🔒</span> 256-Bit SSL
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>🛡️</span> HIPAA Guarded
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>📋</span> Audit Logged
              </span>
            </div>
            <p className="text-[10px] text-[#7A8C82] leading-tight">
              Confidential electronic medical system. All access attempts are timestamped and monitored.
            </p>
          </div>
        </div>
      </div>

      {/* Footer System Watermark */}
      <div className="text-center text-[11px] text-[#7A8C82]">
        <p>© 2026 Dr. Dhanya Krishna Practice • Private Teletherapy Infrastructure</p>
      </div>
    </div>
  );
}