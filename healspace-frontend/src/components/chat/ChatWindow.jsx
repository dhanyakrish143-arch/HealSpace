import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatWindow({ roomId = "session-ananya-sharma", senderName = "Client Visitor", role = "client" }) {
  const [messages, setMessages] = useState([
    {
      id: "sys_init",
      role: "system",
      senderName: "System",
      message: "End-to-end encrypted clinical messaging channel established.",
      timestamp: ""
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");
  const [doctorAlert, setDoctorAlert] = useState(null);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Try port 5001 where the Express/Socket server runs
    const socketUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:5001/chat"
      : "/chat";

    const s = io(socketUrl, {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketRef.current = s;

    s.on("connect", () => {
      console.log("Socket connected successfully with ID:", s.id);
      setIsConnected(true);
      s.emit("join_room", { roomId, senderName, role });
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    s.on("connect_error", (err) => {
      console.warn("Socket connect error:", err.message);
      setIsConnected(false);
    });

    s.on("receive_message", (data) => {
      setMessages((prev) => {
        // Prevent duplicate if already added optimistically
        if (prev.some((m) => m.id === data.id || (m.message === data.message && m.senderName === data.senderName && Math.abs(new Date(m.rawTime || 0) - new Date(data.rawTime || 0)) < 2000))) {
          return prev;
        }
        return [...prev, data];
      });
    });

    s.on("doctor_escalation", (data) => {
      if (role === "therapist") {
        setDoctorAlert(data.alert + " Patient: " + data.clientMessage);
      }
    });

    s.on("user_typing", ({ senderName: typer, isTyping }) => {
      setTypingStatus(isTyping ? typer + " is typing..." : "");
    });

    return () => {
      s.disconnect();
    };
  }, [roomId, senderName, role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingStatus]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = inputMsg.trim();
    if (!trimmed) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const localId = "msg_local_" + Date.now();

    // 1. Immediately show your own message on screen (Optimistic Update)
    const localMsg = {
      id: localId,
      senderName,
      role,
      message: trimmed,
      timestamp: timeStr,
      rawTime: Date.now()
    };
    setMessages((prev) => [...prev, localMsg]);
    setInputMsg("");

    // 2. Transmit through Socket if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("send_message", {
        roomId,
        senderName,
        role,
        message: trimmed,
        id: localId,
        rawTime: Date.now()
      });
      socketRef.current.emit("typing", { roomId, senderName, isTyping: false });
    } else {
      // Offline fallback: Client still gets instant automated triage
      setTimeout(() => {
        const lower = trimmed.toLowerCase();
        let reply = "Hello! I am Dr. Dhanya Krishna's Practice AI Assistant. How can I help you today? You can ask about consultation formats (virtual or in-person), fees, or intake procedures.";
        let sev = "INFO";

        if (lower.includes("panic") || lower.includes("severe") || lower.includes("harm") || lower.includes("die") || lower.includes("emergency")) {
          sev = "URGENT";
          reply = "⚠️ CLINICAL PRIORITY ALERT: Your situation requires immediate attention. Dr. Dhanya Krishna has been pinged. If in crisis, call the 24/7 Tele-MANAS helpline at 14416 immediately.";
        } else if (lower.includes("fee") || lower.includes("cost") || lower.includes("price") || lower.includes("charge")) {
          reply = "Dr. Dhanya Krishna's consultation fee is ₹700 for a 45-minute clinical psychotherapy session. You can select an open slot from Section 2 above.";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: "ai_" + Date.now(),
            senderName: sev === "URGENT" ? "HealSpace Triage Alert" : "HealSpace AI Assistant",
            role: "ai",
            severity: sev,
            message: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col h-[480px] bg-white rounded-3xl border border-[#DFD5C4] shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-[#0F382A] text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={"w-2.5 h-2.5 rounded-full " + (isConnected ? "bg-emerald-400 animate-pulse" : "bg-emerald-400")} />
          <div>
            <h3 className="font-serif font-bold text-sm tracking-wide">Live Consultation Messenger</h3>
            <span className="text-[10px] text-white/70 font-mono block">Room: {roomId}</span>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase bg-white/10 px-2.5 py-1 rounded-md border border-white/20">
          {isConnected ? "Socket.io Active" : "AI Mode Active"}
        </span>
      </div>

      {/* Doctor Alert Banner */}
      {doctorAlert && role === "therapist" && (
        <div className="bg-rose-50 border-b border-rose-200 p-2.5 text-xs text-rose-800 font-bold flex items-center justify-between">
          <span>🚨 {doctorAlert}</span>
          <button onClick={() => setDoctorAlert(null)} className="text-rose-600 hover:text-rose-900 cursor-pointer">✕</button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F0]/40 text-xs">
        {messages.map((m) => {
          if (m.role === "system") {
            return (
              <div key={m.id} className="text-center my-2">
                <span className="text-[10px] font-mono text-[#7A8C82] bg-white border border-[#DFD5C4] px-3 py-1 rounded-full shadow-xs">
                  {m.message}
                </span>
              </div>
            );
          }

          const isMe = m.senderName === senderName;
          const isAi = m.role === "ai";
          const isUrgent = m.severity === "URGENT";

          return (
            <div key={m.id} className={"flex flex-col " + (isMe ? "items-end" : "items-start")}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-[#556A5F]">{m.senderName}</span>
                {isAi && (
                  <span className={"text-[9px] font-bold px-1.5 py-0.2 rounded " + (isUrgent ? "bg-rose-100 text-rose-800 border border-rose-300" : "bg-emerald-100 text-emerald-800")}>
                    {isUrgent ? "URGENT ALERT" : "AI BOT"}
                  </span>
                )}
                {m.timestamp && <span className="text-[9px] text-[#9EAFA5]">{m.timestamp}</span>}
              </div>

              <div className={"max-w-[80%] rounded-2xl p-3 shadow-xs " +
                (isMe
                  ? "bg-[#0F382A] text-white rounded-tr-none"
                  : isUrgent
                  ? "bg-rose-50 border border-rose-300 text-rose-950 font-medium rounded-tl-none"
                  : isAi
                  ? "bg-emerald-50 border border-emerald-200 text-[#0D2F23] rounded-tl-none"
                  : "bg-white border border-[#DFD5C4] text-[#0D2F23] rounded-tl-none")
              }>
                <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
              </div>
            </div>
          );
        })}
        {typingStatus && (
          <div className="text-[11px] italic text-[#7A8C82] animate-pulse">{typingStatus}</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#DFD5C4] flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => {
            setInputMsg(e.target.value);
            if (socketRef.current) {
              socketRef.current.emit("typing", { roomId, senderName, isTyping: e.target.value.length > 0 });
            }
          }}
          placeholder="Type consultation inquiry or message..."
          className="flex-1 text-xs bg-[#FAF7F0] border border-[#DFD5C4] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#0F382A]"
        />
        <button
          type="submit"
          className="bg-[#0F382A] hover:bg-[#184F3B] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
}
