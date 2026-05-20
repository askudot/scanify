# 📄 Scanify

> AI-powered document scanner. Upload, analyze, and chat with your documents instantly.

![Scanify](https://img.shields.io/badge/Next.js-16-black?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square) ![AI](https://img.shields.io/badge/AI-powered-red?style=flat-square)

## ✨ Features

- 📄 **Extract** — Pull clean text from PDF, DOCX, TXT, MD
- ✨ **Analyze** — AI summary, key points, document type & language detection
- 💬 **Chat** — Ask anything about your document with full context
- 🌐 **Multi-language** — English, Indonesian, Chinese, and more
- ⚡ **Fast** — Most documents analyzed in under 5 seconds
- 🔒 **Private** — No accounts, no tracking, no storage

## 🎨 Design

Pixel-art aesthetic inspired by retro UI design with modern responsiveness. Built with Pixelify Sans + VT323 fonts and pixel-style borders/shadows.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + custom pixel-art theme
- **AI**: OpenAI-compatible API (works with any provider)
- **Document parsing**: pdf-parse, mammoth
- **UI**: react-dropzone, lucide-react

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/askudot/scanify.git
cd scanify

# Install
npm install

# Configure (.env.local)
AI_API_KEY=your_api_key
AI_BASE_URL=https://api.your-provider.com/v1
AI_MODEL=your-model-name

# Dev
npm run dev

# Production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
scanify/
├── app/
│   ├── api/
│   │   ├── extract/    # File text extraction
│   │   ├── analyze/    # Document analysis
│   │   └── chat/       # Chat with document
│   ├── globals.css     # Pixel-art theme
│   ├── layout.tsx      # Root layout + fonts
│   └── page.tsx        # Main UI
├── lib/
│   └── ai.ts           # AI client setup
└── public/
```

## 🔌 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/extract` | POST | Extract text from uploaded file |
| `/api/analyze` | POST | Generate summary + key points |
| `/api/chat` | POST | Chat with document context |

## 🎯 Use Cases

- **Legal**: Contract analysis, clause extraction
- **Research**: Paper summarization, Q&A
- **Business**: Report insights, data extraction
- **Education**: Study aid, document understanding
- **Finance**: Invoice parsing, statement analysis

## 📝 License

MIT © [askudot](https://github.com/askudot)

## 🌟 Demo

Live: [scanify.vercel.app](https://scanify.vercel.app)
