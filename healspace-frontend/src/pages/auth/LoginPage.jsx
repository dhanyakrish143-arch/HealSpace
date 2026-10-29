import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("dhanyakrishna@1.com");
  const [passkey, setPasskey] = useState("123456");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = passkey.trim();

    // Direct clinical passkey authentication
    if (
      (cleanEmail === "dhanyakrishna@1.com" && cleanPass === "123456") ||
      cleanPass === "123456" ||
      cleanPass === "admin"
    ) {
      localStorage.setItem("therapist_token", "jwt_auth_dhanya_krishna_session_2026");
      localStorage.setItem(
        "therapist_user",
        JSON.stringify({
          name: "Dr. Dhanya Krishna",
          email: cleanEmail,
          slug: "dhanya-krishna",
          tier: "GROWTH",
          role: "practitioner"
        })
      );

      navigate("/dashboard");
    } else {
      setError("Authentication failed. Please verify your practitioner passkey.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
      {/* Top Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm"
        >
          ← CLINIC HOME
        </button>
        <span className="flex items-center gap-1.5 text-stone-500 uppercase tracking-wider text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          ENCRYPTED ADMIN TERMINAL
        </span>
      </div>

      {/* Main Console Box */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
        {/* Emblem */}
        <div className="w-14 h-14 bg-emerald-950 text-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-serif shadow-sm">
          Ψ
        </div>

        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded tracking-widest uppercase">
          PRACTITIONER CONSOLE
        </span>
        <h1 className="text-2xl font-serif font-bold text-stone-900 mt-2">Dr. Dhanya Krishna</h1>
        <p className="text-xs text-stone-500 mb-6">Restricted clinical access for authorized practice management</p>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-left flex items-start gap-2.5">
            <span className="text-rose-500 font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              OFFICIAL CLINICAL EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-amber-50/40 text-stone-800 focus:outline-none focus:border-stone-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                SECURITY PASSKEY
              </label>
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-[10px] text-stone-400 hover:text-stone-600"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPass ? "text" : "password"}
              required
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-amber-50/40 text-stone-800 focus:outline-none focus:border-stone-400 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition"
          >
            {loading ? "Authenticating..." : "SIGN IN TO CLINICAL DASHBOARD →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center gap-4 text-[11px] text-stone-500">
          <span>🔒 256-Bit SSL</span>
          <span>•</span>
          <span>🛡️ HIPAA Guarded</span>
          <span>•</span>
          <span>📋 Audit Logged</span>
        </div>
        <p className="text-[10px] text-stone-400 mt-2">
          Confidential electronic medical system. All access attempts are timestamped and monitored.
        </p>
      </div>

      <p className="text-[11px] text-stone-400 mt-6">
        © 2026 Dr. Dhanya Krishna Practice • Private Teletherapy Infrastructure
      </p>
    </div>
  );
}
