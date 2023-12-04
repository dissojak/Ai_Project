const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { exec } = require("child_process");
const TC = require("./Controllers/transcribeController.js");
const SAC= require("./Controllers/SeparateAudioController.js");
const RC = require("./Controllers/RevController.js");
const HttpError = require("./models/http-error.js");



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dissojak:stoondissojakb2a@stoon.r8tcyqv.mongodb.net/AiProject?retryWrites=true&w=majority"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Route to transcribe audio via Rev.ai
app.post("/api/transcribe", async (req, res) => {
  try {
    const apiKey =
      "02SHAYxXnbSV8SmjQ5s4udXvdwbqkZHPydWUD7qOuCxy-gShPP655ElMoDo8PDWPhws0esZ3uqsEyXjNQWJV-2owPKmtA";
    const audioUrl = req.body.audioUrl;
    const { jobId } = await TC.transcribeAudio(apiKey, audioUrl);

    res.json({ jobId });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// Separate audio from video

app.post("/api/separate-audio", SAC.separateAudio);
app.post("/api/addrev", RC.AddRev);
app.get("/api/getTextById/:id", RC.getTextById);


// routes
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
