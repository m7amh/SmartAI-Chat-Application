const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("Error: API_KEY is not set in .env file");
  process.exit(1);
}

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.json({ status: "Server is running", port: process.env.PORT });
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Received POST /api/chat with message:", message);
  if (!message) {
    console.log("Error: No message provided");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Sending request to Groq API...");
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    console.log("Groq API response received");
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error.message);
    // Fallback response for testing
    // res.json({ reply: "رد مؤقت: " + message });
    res.status(500).json({ error: "Failed to fetch response from SmartAI" });
  }
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use. Run: netstat -aon | findstr :${PORT} to find the process, then taskkill /PID <pid> /F`);
    process.exit(1);
  } else {
    console.error("Server error:", err.message);
  }
});