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

console.log("🤖 SmartAI Server starting with x.ai Grok-3 integration...");

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.json({ 
    status: "Server is running", 
    port: process.env.PORT,
    ai_provider: "x.ai",
    model: "grok-3-latest"
  });
});

// Main chat endpoint with x.ai integration
app.post("/api/chat", async (req, res) => {
  const { message, temperature = 0 } = req.body;
  console.log("📨 Received POST /api/chat with message:", message);
  
  if (!message) {
    console.log("❌ Error: No message provided");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("🚀 Sending request to x.ai Grok API...");
    
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        messages: [
          {
            role: "system",
            content: "You are Grok, a helpful AI assistant. You can respond in both Arabic and English based on the user's language. Be friendly, informative, and engaging."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "grok-3-latest",
        stream: false,
        temperature: temperature
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("✅ x.ai API response received successfully");
    const aiReply = response.data.choices[0].message.content;
    
    res.json({ 
      reply: aiReply,
      model: "grok-3-latest",
      provider: "x.ai",
      tokens_used: response.data.usage || null
    });
    
  } catch (error) {
    console.error("❌ x.ai API Error:", error.response?.data || error.message);
    
    // Enhanced error handling with demo mode for credits issue
    if (error.response?.data?.error?.includes("credits")) {
      console.log("💡 Credits issue detected, providing demo response...");
      res.json({ 
        reply: `🤖 **وضع تجريبي:** مرحباً! أنا Grok-3 من x.ai. رسالتك: "${message}"\n\n⚠️ ملاحظة: يحتاج حساب x.ai إلى إضافة رصيد لتفعيل الخدمة الكاملة.\n\n✅ التكامل مع x.ai يعمل بشكل صحيح وسيعمل فوراً عند إضافة الرصيد!`,
        model: "grok-3-latest (demo mode)",
        provider: "x.ai",
        demo_mode: true,
        info: "Add credits to x.ai account to enable full functionality"
      });
    } else if (error.response?.status === 401) {
      res.status(401).json({ error: "Invalid API key for x.ai" });
    } else if (error.response?.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    } else if (error.response?.status >= 500) {
      res.status(500).json({ error: "x.ai service is temporarily unavailable" });
    } else {
      res.status(500).json({ 
        error: "Failed to get response from x.ai Grok", 
        details: error.response?.data?.error || error.message 
      });
    }
  }
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🎯 SmartAI Server running on http://localhost:${PORT}`);
  console.log(`🤖 Using x.ai Grok-3 Latest model`);
  console.log(`🔑 API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
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