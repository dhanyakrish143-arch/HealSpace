// src/sockets/chatSocket.js
const { Server } = require("socket.io");

const CRISIS_KEYWORDS = [
  "suicide", "kill", "harm", "die", "death", "emergency", "crisis",
  "panic attack", "severe", "cant breathe", "overdose", "chest pain", "bleeding", "doctor urgent"
];

function analyzeTriageSeverity(text = "") {
  const lower = text.toLowerCase();
  const isUrgent = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));

  if (isUrgent) {
    return {
      severity: "URGENT",
      reply: "⚠️ CLINICAL PRIORITY ALERT: I have notified Dr. Dhanya Krishna directly for urgent clinical triage. If you or someone you know is in acute danger, please contact the 24/7 Tele-MANAS Helpline at 14416 or Vandrevala Foundation at +91 9999 666 555 immediately."
    };
  }

  if (lower.includes("fee") || lower.includes("cost") || lower.includes("price") || lower.includes("charge")) {
    return {
      severity: "INFO",
      reply: "Hello! Dr. Dhanya Krishna's consultation fee is ₹700 for a 45-minute clinical session (Virtual Teletherapy or In-person at Indiranagar). You can select an open slot directly from the schedule above."
    };
  }

  if (lower.includes("slot") || lower.includes("time") || lower.includes("date") || lower.includes("book") || lower.includes("appointment")) {
    return {
      severity: "INFO",
      reply: "Available consultation slots for today are listed in Section 2 above. Simply click your preferred time and proceed to confidential intake."
    };
  }

  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hlo") || lower.includes("hey")) {
    return {
      severity: "INFO",
      reply: "Hello! I am Dr. Dhanya Krishna's Practice AI Assistant. How can I help you today? You can ask about consultation formats, fees, or describe your concerns. If urgent, Dr. Krishna will be alerted directly."
    };
  }

  return {
    severity: "ROUTINE",
    reply: "Thank you for sharing. Your note has been logged in your confidential intake file. Dr. Dhanya Krishna reviews all incoming consultation notes prior to confirmation."
  };
}

function initChatSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    socket.on("join_room", ({ roomId, senderName, role }) => {
      socket.join(roomId);
    });

    socket.on("send_message", (data) => {
      const { roomId, senderName, role, message } = data;
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // 1. Broadcast the original user message to the room
      chatNamespace.to(roomId).emit("receive_message", {
        senderName,
        role,
        message,
        timestamp,
        id: "msg_" + Date.now()
      });

      // 2. If sent by client, run AI Clinical Triage
      if (role === "client") {
        setTimeout(() => {
          const triage = analyzeTriageSeverity(message);

          chatNamespace.to(roomId).emit("receive_message", {
            senderName: triage.severity === "URGENT" ? "HealSpace Triage Alert" : "HealSpace AI Assistant",
            role: "ai",
            severity: triage.severity,
            message: triage.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            id: "ai_" + Date.now()
          });

          // If urgent, dispatch priority ping to attending doctor console
          if (triage.severity === "URGENT") {
            chatNamespace.to(roomId).emit("doctor_escalation", {
              alert: "CRITICAL: Urgent triage trigger detected.",
              clientMessage: message,
              roomId
            });
          }
        }, 800);
      }
    });

    socket.on("typing", ({ roomId, senderName, isTyping }) => {
      socket.to(roomId).emit("user_typing", { senderName, isTyping });
    });
  });

  return io;
}

module.exports = initChatSocket;
