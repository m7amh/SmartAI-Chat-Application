[i](https://media.licdn.com/dms/image/v2/D5616AQGgS1A3hri6JA/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1734720311745?e=1754524800&v=beta&t=o0-K0w1YbQu4RFsveK_c954U_ZEkN8u-oqBroIOsDRo)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue)](https://expressjs.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama--4%20Scout-purple)](https://groq.com/)
[![Security](https://img.shields.io/badge/Security-Enhanced-red)](https://helmetjs.github.io/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

SmartAI is a sophisticated, secure chat application powered by **Groq's Llama-4 Scout** model. Built with enhanced security features, multi-language support, and a modern responsive interface, it provides an exceptional AI conversation experience.

![SmartAI Interface](https://github.com/user-attachments/assets/2c3d2567-d0ed-4111-b06d-03d11877fa67)# 🤖 SmartAI - Advanced AI Chat Assistant

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Conversations** - Powered by Groq Llama-4 Scout 17B model
- **Bilingual Support** - Seamless switching between English and Arabic
- **Voice Recognition** - Speech-to-text input with multi-language support
- **Real-time Chat** - Instant responses with typing indicators
- **Message History** - Persistent chat storage with export functionality

### 🎨 User Experience  
- **Multiple Themes** - Light, Dark, Blue, Green, and Purple themes
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Accessibility** - WCAG compliant with keyboard navigation
- **RTL Support** - Full right-to-left text support for Arabic
- **Progressive Enhancement** - Works across all modern browsers

### 🛡️ Security & Performance
- **Enhanced Security** - Helmet.js with custom CSP policies
- **Rate Limiting** - DDoS protection with configurable limits  
- **Input Sanitization** - XSS protection and data validation
- **CORS Protection** - Secure cross-origin resource sharing
- **Performance Optimization** - Compressed responses and caching

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0.0 or higher
- **npm** or **yarn** package manager
- **Groq API Key** ([Get yours here](https://groq.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smartai-chat.git
cd smartai-chat
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env file and add your Groq API key
```

4. **Start the application**
```bash
npm start
```

5. **Open your browser**
```
http://localhost:4000
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `API_KEY` | Your Groq API key | - | ✅ |
| `PORT` | Server port number | `4000` | ❌ |
| `NODE_ENV` | Environment mode | `development` | ❌ |

### Example `.env` file:
```env
API_KEY=your_groq_api_key_here
PORT=4000
NODE_ENV=production
```

## 📡 API Endpoints

### Chat Endpoint
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "temperature": 0.7
}
```

**Response:**
```json
{
  "reply": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "model": "meta-llama/llama-4-scout-17b-16e-instruct",
  "provider": "Groq",
  "tokens_used": {
    "prompt_tokens": 15,
    "completion_tokens": 20,
    "total_tokens": 35
  },
  "response_time": 1623456789000,
  "security_level": "enhanced"
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "Server is running",
  "port": "4000",
  "ai_provider": "Groq",
  "model": "meta-llama/llama-4-scout-17b-16e-instruct",
  "version": "3.0",
  "security": "enhanced",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Models Information
```http
GET /api/models
```

## 🎮 Usage Guide

### Basic Chat
1. Type your message in the input field
2. Press **Enter** or click **Send**
3. Wait for AI response
4. Continue the conversation!

### Voice Input
1. Click the **microphone icon** 🎤
2. Allow microphone permissions
3. Speak your message clearly
4. Click **stop** when finished
5. Review and send the transcribed text

### Settings Customization
1. Click the **Settings** button ⚙️
2. Choose your preferred theme
3. Adjust creativity level (temperature)
4. Configure audio and voice settings
5. Save your preferences

### Language Switching
- Click the **العربية/English** button to toggle languages
- Interface automatically adapts to RTL/LTR layouts
- Voice recognition switches language accordingly

## 🔧 Development

### Project Structure
```
smartai-chat/
├── server.js          # Express server with security middleware
├── index.html         # Single-page application UI
├── package.json       # Dependencies and scripts
├── .env              # Environment configuration
├── README.md         # This file
└── node_modules/     # Installed packages
```

### Available Scripts

```bash
# Start the server
npm start

# Run in development mode with auto-restart
npm run dev

# Run security audit
npm audit

# Check for outdated packages
npm outdated
```

### Security Features

- **Content Security Policy (CSP)** - Prevents XSS attacks
- **Rate Limiting** - 100 requests per 15 minutes globally, 10 chat requests per minute
- **Input Validation** - Server-side validation with express-validator
- **Helmet.js** - Comprehensive security headers
- **HTTPS Enforcement** - Production-ready security configurations
- **Sanitization** - HTML and script injection prevention

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 70+ | ✅ Full Support |
| Firefox | 65+ | ✅ Full Support |
| Safari | 12+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |
| Mobile Safari | 12+ | ✅ Full Support |
| Chrome Mobile | 70+ | ✅ Full Support |

## 🚨 Troubleshooting

### Common Issues

**Problem: Buttons not responding**
```bash
# Check if server is running
curl http://localhost:4000/health

# Check browser console for errors
# Ensure CSP allows inline event handlers
```

**Problem: Voice recognition not working**
```bash
# Check browser permissions
# Ensure HTTPS in production
# Verify microphone access
```

**Problem: API errors**
```bash
# Verify Groq API key in .env
# Check network connectivity
# Review rate limiting status
```

### Performance Optimization

1. **Enable gzip compression** for production
2. **Use CDN** for static assets
3. **Implement caching** strategies
4. **Monitor API usage** and costs
5. **Set up proper logging** and monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use **ESLint** for JavaScript linting
- Follow **Prettier** formatting rules
- Add **JSDoc** comments for functions
- Write **meaningful commit messages**

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing the Llama-4 Scout API
- **Express.js** community for the robust framework
- **Helmet.js** for security middleware
- **Font Awesome** for beautiful icons
- **Google Fonts** for typography

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/m7amh)
- **Discussions**: [GitHub Discussions](https://github.com/m7amh)
- **Email**: mohamed2291971@gmail.com.com
- **Documentation**: [linkedin](https://www.linkedin.com/in/mohamed--abdelrahman--awad/)

---

<div align="center">

**Built with ❤️ by the SmartAI Team**

[Website](https://smartai-chat.com) • [Documentation](https://docs.smartai-chat.com) • [Community](https://community.smartai-chat.com)

</div>
