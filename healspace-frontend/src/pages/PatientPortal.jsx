import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DocumentRetrieval() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("krishna");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("receipt");

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5001/api/scheduling/patient-records?query=${encodeURIComponent(
          searchTerm.trim()
        )}&therapist_slug=dhanya-krishna`
      );
      if (res.data.success) {
        setResults(res.data.records);
        if (res.data.records.length > 0) {
          setSelectedRecord(res.data.records[0]);
        } else {
          setSelectedRecord(null);
        }
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 p-8 flex flex-col items-center">
      {/* Top Header Bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3.5 py-1.5 rounded-lg shadow-sm"
        >
          ← BACK TO CLINIC HOME
        </button>
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
          PATIENT DOCUMENT RETRIEVAL
        </span>
      </div>

      {/* Main Search Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center mb-6">
        <div className="w-14 h-14 bg-emerald-950 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-serif">
          Φ
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">My Prescriptions & Receipts</h1>
        <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
          Retrieve your authorized medical prescriptions (Rx), care plans, and insurance tax receipts from Dr. Dhanya Krishna.
        </p>

        <form onSubmit={handleLookup} className="mt-6 flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter your name, email, or mobile..."
            className="flex-1 text-xs p-3 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 focus:outline-none focus:border-emerald-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition"
          >
            {loading ? "SEARCHING..." : "LOOKUP"}
          </button>
        </form>
      </div>

      {/* Results View */}
      {results && results.length > 0 && selectedRecord && (
        <div className="w-full max-w-3xl bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start border-b border-stone-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                Verified Patient File
              </span>
              <h2 className="text-lg font-serif font-bold text-stone-900 mt-1">
                {selectedRecord.client_name}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {selectedRecord.client_email} • {selectedRecord.client_phone || "+91 Contact on File"}
              </p>
            </div>

            {selectedRecord.format === "teletherapy" && (
              <button
                onClick={() => navigate(`/consultation/room/?role=client${selectedRecord._id}`)}
                className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                JOIN TELETHERAPY CALL 🎥
              </button>
            )}
          </div>

          {/* Document Tabs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab("receipt")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === "receipt"
                  ? "bg-stone-900 text-white shadow"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              1. Tax Invoice / Receipt (₹{selectedRecord.amount_paid})
            </button>
            <button
              onClick={() => setActiveTab("prescription")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1 ${
                activeTab === "prescription"
                  ? "bg-stone-900 text-white shadow"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <span>💊</span>
              2. Clinical Prescription (Rx)
            </button>
          </div>

          {/* TAB 1: Invoice */}
          {activeTab === "receipt" && (
            <div className="border border-stone-200 rounded-xl p-6 bg-stone-50/50 text-xs">
              <div className="flex justify-between items-start border-b border-stone-200 pb-3 mb-4">
                <div>
                  <h3 className="font-serif font-bold text-sm text-stone-900">OFFICIAL CLINICAL TAX RECEIPT</h3>
                  <p className="text-[11px] text-stone-500">Dr. Dhanya Krishna Practice • Clinical Psychology & Telehealth</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">PAID</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-stone-200">
                <div>
                  <p className="text-stone-400 font-medium">Patient Legal Name</p>
                  <p className="font-semibold text-stone-800">{selectedRecord.client_name}</p>
                </div>
                <div>
                  <p className="text-stone-400 font-medium">Session Timestamp</p>
                  <p className="font-semibold text-stone-800">{selectedRecord.date} @ {selectedRecord.slot}</p>
                </div>
                <div>
                  <p className="text-stone-400 font-medium">Consultation Format</p>
                  <p className="font-semibold text-stone-800 capitalize">{selectedRecord.format}</p>
                </div>
                <div>
                  <p className="text-stone-400 font-medium">Settled Amount</p>
                  <p className="font-semibold text-emerald-900 font-mono">₹{selectedRecord.amount_paid}.00</p>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-4 w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-medium text-xs shadow-sm"
              >
                Download / Print Tax Receipt (PDF)
              </button>
            </div>
          )}

          {/* TAB 2: Prescription */}
          {activeTab === "prescription" && (
            <div>
              {selectedRecord.isCompleted && selectedRecord.note ? (
                <div className="border border-emerald-200 rounded-xl p-6 bg-emerald-50/20 text-xs">
                  <div className="flex justify-between items-start border-b border-emerald-200 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-bold uppercase">
                        Prescription Unlocked (Rx)
                      </span>
                      <h3 className="font-serif font-bold text-sm text-stone-900 mt-1">Clinical Care Regimen</h3>
                      <p className="text-[11px] text-stone-500">Authorized by Dr. Dhanya Krishna (RCI Licensed)</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800">Signed & Verified</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-[10px] uppercase text-stone-500 block">Assessment</span>
                      <p className="text-stone-800 mt-0.5">{selectedRecord.note.assessment}</p>
                    </div>
                    <div>
                      <span className="font-bold text-[10px] uppercase text-stone-500 block">Prescribed Regimen</span>
                      <pre className="font-mono text-xs bg-white p-3 rounded-lg border border-emerald-100 whitespace-pre-wrap text-stone-800 mt-0.5">
                        {selectedRecord.note.prescribed_regimen}
                      </pre>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="mt-4 w-full py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white rounded-lg font-medium text-xs shadow-sm"
                  >
                    Print / Save Prescription (PDF)
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-stone-300 rounded-xl p-8 bg-stone-50 text-center text-xs">
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    🔒
                  </div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">Prescription Locked</h4>
                  <p className="text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed text-[11px]">
                    Prescription will be unlocked and issued by Dr. Dhanya Krishna following your consultation session ({selectedRecord.date} @ {selectedRecord.slot}).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* No Records Found Fallback */}
      {results && results.length === 0 && (
        <div className="w-full max-w-3xl bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center">
          <h3 className="font-serif font-bold text-base text-stone-900">No Records Found</h3>
          <p className="text-xs text-stone-500 mt-1">
            No active records found matching "{searchTerm}". Please check the spelling or enter your phone/email.
          </p>
        </div>
      )}

      <p className="text-center text-[11px] text-stone-400 mt-8 font-mono">
        © 2026 Dr. Dhanya Krishna Clinical Practice • Encrypted Telehealth & In-Person Practice
      </p>
    </div>
  );
}

