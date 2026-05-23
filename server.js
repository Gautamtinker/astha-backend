require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

// MONGODB CONNECTION
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });

// NOTE SCHEMA
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "love",
    },

    color: {
      type: String,
      default: "#ff69b4",
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", noteSchema);

// HEALTH
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Love Notebook API Running ❤️",
  });
});

// GET NOTES
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// CREATE NOTE
app.post("/notes", async (req, res) => {
  try {
    const note = await Note.create(req.body);

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// UPDATE NOTE
app.put("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// DELETE NOTE
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});

// HANDLE ERRORS
process.on("unhandledRejection", (err) => {
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
