// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");



// ================= ENV =================
dotenv.config();

// ================= APP =================
const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: [
      "https://www.nitiias.org",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io available in controllers
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Future: join user room
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "https://www.nitiias.org",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ================= ROUTES =================
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/pyqs", require("./routes/pyqs"));
app.use("/api/upload", require("./routes/upload"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

// ================= DATABASE + SERVER =================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });