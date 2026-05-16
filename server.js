require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("\n📝 Troubleshooting steps:");
    console.log("1. Check your MongoDB connection string in .env");
    console.log(
      "2. Make sure your IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for development)",
    );
    console.log("3. Verify your username and password are correct");
    console.log("4. The connection string should look like:");
    console.log(
      "   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>",
    );
    console.log(
      "\n💡 Get your connection string from: https://cloud.mongodb.com → Connect → Drivers",
    );
  });

// Note Schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["love", "memory", "promise", "future", "other"],
    default: "love",
  },
  color: {
    type: String,
    default: "#ff69b4",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", noteSchema);

// API Routes

// Get all notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single note
app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new note
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content, category, color } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

    const note = new Note({
      title,
      content,
      category: category || "love",
      color: color || "#ff69b4",
    });

    await note.save();
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update note
app.put("/api/notes/:id", async (req, res) => {
  try {
    const { title, content, category, color } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        color,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true },
    );

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete note
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running! ❤️",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💕 Astha Love Website API is ready!`);
  console.log(
    `📝 API endpoints available at http://localhost:${PORT}/api/notes`,
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
