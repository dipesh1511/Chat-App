const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// Import and use routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/interview", interviewRoutes);

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

connectDB().then(() => {
  server.listen(port, () => {
    console.log("Server running on port 5000");
  });
});
