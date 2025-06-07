const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { body, validationResult } = require("express-validator");
const xss = require("xss");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
require("dotenv").config();

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      mediaSrc: ["'self'", "https://assets.mixkit.co"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat-specific rate limiting (more restrictive)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 chat requests per minute
  message: {
    error: "Too many chat requests, please slow down.",
    retryAfter: "1 minute"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middlewares
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("❌ Error: API_KEY is not set in .env file");
  process.exit(1);
}

console.log("🛡️ SmartAI Server starting with enhanced security...");
console.log("🤖 Using Groq Llama-4 Scout integration...");

// Input validation middleware
const validateChatInput = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
    .escape(),
  body('temperature')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Temperature must be between 0 and 1'),
];

// Sanitize input function
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Remove potential XSS
  let sanitized = xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
  
  // Additional sanitization
  sanitized = sanitized
    .replace(/[<>]/g, '') // Remove any remaining brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
    
  return sanitized;
}

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("🔍 Health check requested from:", req.ip);
  res.json({ 
    status: "Server is running", 
    port: process.env.PORT,
    ai_provider: "Groq",
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    version: "3.0",
    security: "enhanced",
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint with enhanced security
app.post("/api/chat", chatLimiter, validateChatInput, async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("❌ Validation errors:", errors.array());
    return res.status(400).json({ 
      error: "Invalid input",
      details: errors.array().map(err => err.msg)
    });
  }

  let { message, temperature = 0.7 } = req.body;
  
  // Sanitize inputs
  message = sanitizeInput(message);
  temperature = parseFloat(temperature) || 0.7;
  
  // Additional validation
  if (!message || message.length === 0) {
    return res.status(400).json({ error: "Message is required and cannot be empty" });
  }
  
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message too long. Maximum 2000 characters allowed." });
  }

  console.log("📨 Secure chat request from:", req.ip);
  console.log("📝 Message length:", message.length);
  console.log("🌡️ Temperature:", temperature);

  try {
    console.log("🚀 Sending secure request to Groq API...");
    
    // Prepare system message with security context
    const systemMessage = {
      role: "system",
      content: `You are SmartAI, a helpful and secure AI assistant powered by Llama-4 Scout. 
      - Always provide helpful, accurate, and safe responses
      - Do not execute code or provide harmful instructions
      - If asked about sensitive topics, respond professionally and ethically
      - Maintain user privacy and do not store personal information
      - You can communicate in both English and Arabic based on user preference
      - Be friendly, professional, and informative`
    };

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages: [
          systemMessage,
          {
            role: "user",
            content: message
          }
        ],
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: Math.max(0, Math.min(1, temperature)), // Ensure temperature is in valid range
        max_tokens: 1500,
        top_p: 1,
        stream: false,
        stop: ["<script>", "</script>", "javascript:", "eval("] // Security stops
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "User-Agent": "SmartAI-SecureClient/3.0"
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log("✅ Groq API response received successfully");
    let aiReply = response.data.choices[0].message.content;
    
    // Sanitize AI response for additional security
    aiReply = sanitizeInput(aiReply);
    
    // Log for monitoring
    console.log("📊 Response length:", aiReply.length);
    console.log("🔍 Tokens used:", response.data.usage?.total_tokens || 'N/A');
    
    res.json({ 
      reply: aiReply,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      provider: "Groq",
      tokens_used: response.data.usage || null,
      response_time: Date.now(),
      security_level: "enhanced"
    });
    
  } catch (error) {
    console.error("❌ Groq API Error:", error.response?.data || error.message);
    
    // Enhanced error handling without exposing sensitive information
    let errorMessage = "An error occurred while processing your request.";
    let statusCode = 500;
    
    if (error.response?.status === 401) {
      errorMessage = "Authentication failed. Please try again later.";
      statusCode = 500; // Don't expose auth details
    } else if (error.response?.status === 429) {
      errorMessage = "Service is busy. Please try again in a moment.";
      statusCode = 429;
    } else if (error.response?.status === 400) {
      errorMessage = "Invalid request format. Please check your input.";
      statusCode = 400;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = "Request timeout. Please try again.";
      statusCode = 408;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      request_id: Math.random().toString(36).substr(2, 9) // For support tracking
    });
  }
});

// Models info endpoint
app.get("/api/models", (req, res) => {
  res.json({
    current_model: "meta-llama/llama-4-scout-17b-16e-instruct",
    provider: "Groq",
    capabilities: ["chat", "Arabic", "English", "reasoning", "secure"],
    max_tokens: 1500,
    security_features: ["input_validation", "xss_protection", "rate_limiting", "sanitization"]
  });
});

// Serve main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found",
    available_endpoints: ["/", "/health", "/api/chat", "/api/models"]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Unhandled error:", err.message);
  res.status(500).json({ 
    error: "Internal server error",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎯 SmartAI Secure Server running on http://localhost:${PORT}`);
  console.log(`🛡️ Security features: Rate limiting, XSS protection, Input validation`);
  console.log(`🤖 AI Model: Llama-4 Scout with enhanced safety`);
  console.log(`🔑 API Key: ${API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
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
  console.log('\n🛑 Shutting down SmartAI secure server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});