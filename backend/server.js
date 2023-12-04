const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dissojak:stoondissojakb2a@stoon.r8tcyqv.mongodb.net/AiProject?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Route to transcribe audio via Rev.ai
app.post("/api/transcribe", async (req, res) => {
    try {
      const apiKey = "02SHAYxXnbSV8SmjQ5s4udXvdwbqkZHPydWUD7qOuCxy-gShPP655ElMoDo8PDWPhws0esZ3uqsEyXjNQWJV-2owPKmtA"; // Replace with your Rev.ai API key
      const audioUrl = req.body.audioUrl; // Assuming the frontend sends the audio URL
  
      const response = await axios.post(
        "https://api.rev.ai/speechtotext/v1/jobs",
        {
          source_config: {
            url: audioUrl,
          },
          metadata: "This is a test", // Optional metadata
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const jobId = response.data.id;
      res.json({ jobId });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      res.status(500).json({ error: "Transcription failed" });
    }
  });

// Define routes
// Example:
app.get("/api/data", (req, res) => {
  // Perform MongoDB operations here
  res.json({ message: "Hello from the backend!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
