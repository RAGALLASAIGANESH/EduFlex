// 🔥 LOAD ENV FIRST (ABSOLUTE FIRST LINE)
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const progressRoutes = require("./routes/progressRoutes");

// Connect MongoDB
connectDB();

const app = express();

// Middleware - CORS with explicit options
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://eduflex-git-main-saiganeshragalla29-8253s-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 EduFlex Backend is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quiz", require("./routes/quizRoutes"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
