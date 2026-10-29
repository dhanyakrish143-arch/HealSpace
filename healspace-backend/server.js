require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// CORS configuration for Vite frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json());

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healspace";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Scheduling & dashboard routes
try {
  const schedulingRoutes = require("./src/routes/schedulingRoutes");
  app.use("/api/scheduling", schedulingRoutes);
} catch (e) {
  console.log("schedulingRoutes load note:", e.message);
}

// Clinical SOAP notes & Rx routes
try {
  const notesRoutes = require("./src/routes/notesRoutes");
  app.use("/api/notes", notesRoutes);
} catch (e) {
  console.log("notesRoutes load note:", e.message);
}

// Real-time Socket.io signaling
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  }
});

try {
  const setupChatSocket = require("./src/sockets/chatSocket");
  setupChatSocket(io);
} catch (e) {
  io.on("connection", (socket) => {
    console.log("Socket client connected:", socket.id);
  });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`HealSpace backend running on http://localhost:${PORT}`);
});
