# 📄 Scanify

AI-Powered Document Scanner — Upload, analyze, and chat with any document instantly.

Intelligent text extraction, deep analysis, and conversational Q&A — powered by AI.

---

## 🧠 Architecture

Scanify is a full-stack AI document intelligence platform that combines **multi-format text extraction** with **AI-powered analysis** to help users understand any document — contracts, papers, reports, articles — in seconds.

```
┌─────────────────────────────────────────────────────┐
│                    Scanify UI                        │
│      Next.js 16 · TypeScript · Tailwind · Pixel UI  │
├──────────┬──────────┬──────────┬──────────┬─────────┤
│  Upload  │ Extract  │ Analyze  │   Chat   │  Stats  │
│Drag/Drop │   Text   │  AI      │ AI Q&A   │ Type +  │
│  PDF +   │  Multi-  │ Summary  │ Context  │ Lang +  │
│  DOCX +  │  Format  │ + Key    │ Aware    │  Word   │
│  TXT/MD  │ Extract  │ Points   │  Reply   │ Counts  │
├──────────┴──────────┴──────────┴──────────┴─────────┤
│                    API Layer                         │
│   /api/extract  ·  /api/analyze  ·  /api/chat       │
├──────────────────────┬──────────────────────────────┤
│  Document Parsers    │       AI Engine              │
│  pdf-parse, mammoth, │   OpenAI-compatible API       │
│  fs, OCR (planned)   │   Long-chain reasoning        │
└──────────────────────┴──────────────────────────────┘
```

### AI Agents

| Agent | Endpoint | Function |
|-------|----------|----------|
| **Extractor** | `POST /api/extract` | File buffer → clean text (PDF/DOCX/TXT/MD) |
| **Document Analyzer** | `POST /api/analyze` | Text → summary + key points + type + language |
| **Document Chat** | `POST /api/chat` | Question + doc context → contextual answer |

---

## ⛽ Token Consumption Model

Each AI call uses an OpenAI-compatible reasoning model. Estimated token usage per interaction:

| Feature | Prompt Tokens | Completion Tokens | Total/Call | Calls/Doc | Total/Doc |
|---------|--------------|-------------------|------------|-----------|-----------|
| **Document Analyze** | ~5,000-30,000 | ~400-600 | ~5,400-30,600 | 1 | ~5K-30K |
| **AI Chat (per Q)** | ~5,500 + history | ~300-500 | ~5,800/msg | 5-15 | ~29K-87K |

**Per active user session:** ~34K-117K tokens (1 doc + 5-15 questions)

**Scaling estimates:**
- 100 docs/day → ~3.4M-11.7M tokens/day → ~102M-351M tokens/month
- 1,000 docs/day → ~34M-117M tokens/day → ~1B-3.5B tokens/month

> AI features can route through any OpenAI-compatible gateway with automatic key rotation for rate limit management.

---

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + Custom Pixel-Art Theme
- **Fonts:** Pixelify Sans + VT323 (Google Fonts)
- **AI Model:** OpenAI-compatible API (configurable)
- **Document Parsers:** pdf-parse, mammoth (DOCX)
- **UI Library:** react-dropzone, lucide-react
- **Deployment:** VPS / Vercel (Node.js production server)

---

## 🚀 Features

### 📄 Document Upload
- Drag-and-drop OR click-to-select
- Supports: PDF, DOCX, TXT, MD
- Up to 10MB per file
- Real-time extraction feedback

### ✨ AI Analyzer
- 2-3 sentence summary
- 5 key bullet points
- Document type detection (Contract, Paper, Invoice, Report, Resume, etc.)
- Language identification (auto-detect ID/EN/CN/etc.)
- Word count + char count
- Powered by long-chain reasoning

### 💬 Document Chat
- Conversational Q&A about the document
- Full context awareness (50K char window)
- Maintains chat history
- Supports multilingual queries

### 🌐 Multi-Language Support
- English, Indonesian, Chinese (Simplified + Traditional)
- Auto-detects document language
- Cross-language Q&A (ask in EN about an ID document)

### ⚡ Performance
- Streaming responses
- Optimized extraction pipeline
- Most analyses complete in <5s

### 🔒 Privacy First
- No accounts required
- No persistent storage
- Documents discarded after session
- All processing server-side

---

## 📁 Project Structure

```
scanify/
├── app/
│   ├── api/
│   │   ├── extract/route.ts    # Multi-format text extraction
│   │   ├── analyze/route.ts    # AI document analysis
│   │   └── chat/route.ts       # AI chat with document context
│   ├── globals.css             # Pixel-art theme + scanlines
│   ├── layout.tsx              # Root layout + font loading
│   └── page.tsx                # Main UI (single-page app)
├── lib/
│   └── ai.ts                   # AI API wrapper
├── public/                     # Static assets
├── .env.local                  # AI API config
├── tailwind.config.js          # Tailwind + custom pixel theme
├── package.json
└── README.md
```

---

## 🛠️ Getting Started

```bash
# Clone
git clone https://github.com/askudot/scanify.git
cd scanify

# Install
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your AI API credentials

# Development
npm run dev

# Production
npm run build
npm start
```

### Environment Variables

```env
AI_BASE_URL=https://api.your-provider.com/v1   # OpenAI-compatible endpoint
AI_API_KEY=your_api_key                        # API key
AI_MODEL=your-model-name                       # Model identifier
```

---

## 🎯 Use Cases

- **Legal:** Contract analysis, clause extraction, terms summary
- **Research:** Academic paper Q&A, literature review acceleration
- **Business:** Report insights, executive summary generation
- **Education:** Study aid, textbook understanding
- **Finance:** Invoice parsing, statement breakdown
- **HR:** Resume screening, skill extraction

---

## 📊 Data Sources

- **PDF Parsing:** [pdf-parse](https://www.npmjs.com/package/pdf-parse) — PDF text extraction
- **DOCX Parsing:** [mammoth](https://www.npmjs.com/package/mammoth) — Word document → clean text
- **AI Analysis:** OpenAI-compatible reasoning model — long-chain reasoning for documents

---

## 📜 License

MIT

---

## 🔗 Links

- **GitHub:** [github.com/askudot/scanify](https://github.com/askudot/scanify)
