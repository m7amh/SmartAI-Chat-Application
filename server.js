const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("Error: API_KEY is not set in .env file");
  process.exit(1);
}

console.log("🤖 SmartAI Server starting with Groq Llama-4 Scout integration...");

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.json({ 
    status: "Server is running", 
    port: process.env.PORT,
    ai_provider: "Groq",
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    version: "2.0"
  });
});

// Main chat endpoint with Groq Llama-4 Scout integration
app.post("/api/chat", async (req, res) => {
  const { message, temperature = 0.7 } = req.body;
  console.log("📨 Received POST /api/chat with message:", message);
  
  if (!message || message.trim() === "") {
    console.log("❌ Error: No message provided");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("🚀 Sending request to Groq Llama-4 Scout API...");
    
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant powered by Llama-4 Scout. You can respond fluently in both Arabic and English. Be friendly, informative, and engaging. When responding in Arabic, use proper Arabic grammar and natural expressions."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: temperature,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("✅ Groq API response received successfully");
    const aiReply = response.data.choices[0].message.content;
    
    res.json({ 
      reply: aiReply,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      provider: "Groq",
      tokens_used: response.data.usage || null,
      response_time: Date.now()
    });
    
  } catch (error) {
    console.error("❌ Groq API Error:", error.response?.data || error.message);
    
    // Enhanced error handling
    if (error.response?.status === 401) {
      res.status(401).json({ error: "Invalid API key for Groq" });
    } else if (error.response?.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    } else if (error.response?.status === 400) {
      res.status(400).json({ error: "Bad request. Please check your message format." });
    } else if (error.response?.status >= 500) {
      res.status(500).json({ error: "Groq service is temporarily unavailable" });
    } else {
      res.status(500).json({ 
        error: "Failed to get response from Groq Llama-4 Scout", 
        details: error.response?.data?.error || error.message 
      });
    }
  }
});

// Get chat models endpoint
app.get("/api/models", (req, res) => {
  res.json({
    current_model: "meta-llama/llama-4-scout-17b-16e-instruct",
    provider: "Groq",
    capabilities: ["chat", "Arabic", "English", "reasoning"],
    max_tokens: 1000
  });
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🎯 SmartAI Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using Groq Llama-4 Scout model`);
  console.log(`🔑 API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌟 Enhanced with Arabic/English support`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use.`);
    console.error(`   Run: lsof -ti:${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", err.message);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down SmartAI server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});