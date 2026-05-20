"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Sparkles, MessageSquare, Loader2, X, Menu } from "lucide-react";

type AnalysisResult = {
  summary: string;
  keyPoints: string[];
  documentType: string;
  language: string;
  pageCount?: number;
  wordCount: number;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setError("");
    setAnalysis(null);
    setChatMessages([]);
    setExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", f);
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extract failed");
      setContent(data.content);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setExtracting(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
    multiple: false,
  });

  const analyze = async () => {
    if (!content) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !content) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          messages: [...chatMessages, userMsg],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      setChatMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setChatLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setContent("");
    setAnalysis(null);
    setChatMessages([]);
    setError("");
  };

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen scanlines">
      {/* Header */}
      <nav className="bg-white border-b-[3px] border-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button onClick={scrollTo("top")} className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#e5322d] border-[3px] border-black flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
            </div>
            <span className="text-xl sm:text-2xl font-pixel font-bold tracking-tight">
              SCAN<span className="text-[#e5322d]">IFY</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4 text-sm font-pixel">
            <a href="#features" onClick={scrollTo("features")} className="hover:text-[#e5322d] cursor-pointer">FEATURES</a>
            <a href="#how" onClick={scrollTo("how")} className="hover:text-[#e5322d] cursor-pointer">HOW IT WORKS</a>
            <a href="https://github.com/askudot/scanify" target="_blank" rel="noopener" className="hover:text-[#e5322d]">
              GITHUB
            </a>
            <span className="px-3 py-1 bg-black text-white text-xs">AI POWERED</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 border-[3px] border-black bg-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" strokeWidth={3} /> : <Menu className="w-5 h-5" strokeWidth={3} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t-[3px] border-black bg-white">
            <div className="flex flex-col font-pixel text-sm">
              <a href="#features" onClick={scrollTo("features")} className="px-6 py-3 border-b-2 border-gray-100 hover:bg-yellow-50">FEATURES</a>
              <a href="#how" onClick={scrollTo("how")} className="px-6 py-3 border-b-2 border-gray-100 hover:bg-yellow-50">HOW IT WORKS</a>
              <a href="https://github.com/askudot/scanify" target="_blank" rel="noopener" className="px-6 py-3 border-b-2 border-gray-100 hover:bg-yellow-50">
                GITHUB
              </a>
              <div className="px-6 py-3 bg-black text-white text-xs">AI POWERED</div>
            </div>
          </div>
        )}
      </nav>

      <div id="top" />

      {/* Hero */}
      {!file && (
        <section className="dot-grid">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
            <div className="inline-block bg-yellow-200 border-[3px] border-black px-3 sm:px-4 py-1 mb-4 sm:mb-6 font-pixel text-xs sm:text-sm">
              ⚡ AI-POWERED · 100% FREE · NO SIGNUP
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-pixel font-bold mb-4 sm:mb-6 leading-tight">
              Scan & analyze<br />
              your <span className="text-[#e5322d]">documents</span><br />
              with AI.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-pixel mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
              Upload any PDF, Word, or text file. Get instant summary, key insights, and chat with your document.
            </p>

            {/* Upload Zone */}
            <div
              {...getRootProps()}
              className={`pixel-border bg-white p-6 sm:p-12 cursor-pointer transition-all max-w-2xl mx-auto ${
                isDragActive ? "bg-yellow-50" : ""
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[#e5322d]" strokeWidth={2.5} />
              <button className="pixel-btn px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg mb-3 sm:mb-4">
                SELECT DOCUMENT
              </button>
              <p className="text-xs sm:text-sm text-gray-500 font-pixel">
                or drop file here · PDF, DOCX, TXT, MD
              </p>
            </div>
          </div>

          {/* Features section */}
          <div id="features" className="bg-white border-y-[3px] border-black py-12 sm:py-20 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <span className="inline-block bg-[#e5322d] text-white border-[3px] border-black px-4 py-1 font-pixel text-xs sm:text-sm mb-4">
                  ★ FEATURES
                </span>
                <h2 className="text-3xl sm:text-5xl font-pixel font-bold">
                  What it can <span className="text-[#e5322d]">do</span>.
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FeatureCard icon="📄" title="EXTRACT" desc="Pull clean text from PDF, Word, Markdown, and plain text files. Handles multi-page documents up to 50K characters." />
                <FeatureCard icon="✨" title="ANALYZE" desc="Get an instant AI summary, key bullet points, document type detection, and language identification." />
                <FeatureCard icon="💬" title="CHAT" desc="Ask anything about your document. AI answers based on the actual content with full context awareness." />
                <FeatureCard icon="🌐" title="MULTI-LANG" desc="Works with English, Indonesian, Chinese, and more. Auto-detects document language." />
                <FeatureCard icon="⚡" title="FAST" desc="Streaming responses, optimized extraction. Most documents analyzed in under 5 seconds." />
                <FeatureCard icon="🔒" title="PRIVATE" desc="No accounts, no tracking, no storage. Your documents are processed and discarded immediately." />
              </div>
            </div>
          </div>

          {/* How It Works section */}
          <div id="how" className="dot-grid py-12 sm:py-20 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <span className="inline-block bg-yellow-300 border-[3px] border-black px-4 py-1 font-pixel text-xs sm:text-sm mb-4">
                  ⚙ HOW IT WORKS
                </span>
                <h2 className="text-3xl sm:text-5xl font-pixel font-bold">
                  3 steps. <span className="text-[#e5322d]">That&apos;s it.</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                <StepCard num="01" title="UPLOAD" desc="Drop or pick a PDF, DOCX, TXT, or MD file. Up to 10MB." />
                <StepCard num="02" title="ANALYZE" desc="AI extracts the text and generates a summary plus key points instantly." />
                <StepCard num="03" title="CHAT" desc="Ask follow-up questions. The AI knows your document inside out." />
              </div>

              <div className="mt-12 sm:mt-16 text-center">
                <p className="font-pixel text-base sm:text-lg text-gray-600 mb-6">Ready to try it?</p>
                <button
                  onClick={scrollTo("top")}
                  className="pixel-btn px-8 py-4 text-base sm:text-lg"
                >
                  ↑ START NOW
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Document workspace */}
      {file && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* File header */}
          <div className="pixel-border bg-white p-3 sm:p-4 mb-4 sm:mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-[#e5322d] border-[3px] border-black flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-pixel font-bold text-sm sm:text-lg truncate">{file.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-mono-pixel">
                  {(file.size / 1024).toFixed(1)} KB · {content ? `${content.length.toLocaleString()} chars` : "extracting..."}
                </p>
              </div>
            </div>
            <button onClick={reset} className="p-2 hover:bg-red-50 shrink-0" aria-label="Close">
              <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
            </button>
          </div>

          {extracting && (
            <div className="pixel-border bg-white p-8 text-center">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#e5322d]" />
              <p className="mt-4 font-pixel">EXTRACTING TEXT...</p>
            </div>
          )}

          {error && (
            <div className="pixel-border bg-red-50 p-3 sm:p-4 mb-4 sm:mb-6 font-pixel text-sm sm:text-base">
              ⚠️ {error}
            </div>
          )}

          {content && !extracting && (
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left: Analysis */}
              <div className="space-y-4">
                {!analysis ? (
                  <div className="pixel-border bg-white p-6 sm:p-8 text-center">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-[#e5322d] mb-4" strokeWidth={2.5} />
                    <h3 className="text-xl sm:text-2xl font-pixel font-bold mb-2">READY TO ANALYZE</h3>
                    <p className="text-sm sm:text-base text-gray-600 font-pixel mb-6">
                      AI will summarize and extract key insights
                    </p>
                    <button
                      onClick={analyze}
                      disabled={analyzing}
                      className="pixel-btn px-6 sm:px-8 py-3 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {analyzing ? "ANALYZING..." : "✨ ANALYZE NOW"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="pixel-border bg-white p-4 sm:p-6">
                      <h3 className="font-pixel font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#e5322d]" /> SUMMARY
                      </h3>
                      <p className="text-sm leading-relaxed font-pixel">{analysis.summary}</p>
                    </div>

                    <div className="pixel-border bg-white p-4 sm:p-6">
                      <h3 className="font-pixel font-bold text-lg sm:text-xl mb-3">📌 KEY POINTS</h3>
                      <ul className="space-y-2">
                        {analysis.keyPoints.map((point, i) => (
                          <li key={i} className="text-sm font-pixel flex gap-2">
                            <span className="text-[#e5322d] shrink-0">▸</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <Stat label="TYPE" value={analysis.documentType} />
                      <Stat label="LANG" value={analysis.language} />
                      <Stat label="WORDS" value={analysis.wordCount.toLocaleString()} />
                    </div>
                  </>
                )}
              </div>

              {/* Right: Chat */}
              <div className="pixel-border bg-white flex flex-col h-[500px] sm:h-[600px]">
                <div className="border-b-[3px] border-black p-3 sm:p-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#e5322d]" strokeWidth={3} />
                  <h3 className="font-pixel font-bold text-lg sm:text-xl">CHAT WITH DOC</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-400 font-pixel mt-12 sm:mt-20">
                      <p className="text-sm sm:text-base">💬 Ask anything about this document</p>
                      <p className="text-xs mt-2">e.g. &ldquo;What is the main topic?&rdquo;</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 border-[3px] border-black ${
                        msg.role === "user" ? "bg-yellow-100 ml-4 sm:ml-8" : "bg-gray-50 mr-4 sm:mr-8"
                      }`}
                    >
                      <p className="text-xs font-pixel font-bold mb-1 text-[#e5322d]">
                        {msg.role === "user" ? "YOU" : "AI"}
                      </p>
                      <p className="text-sm font-pixel whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="p-3 bg-gray-50 border-[3px] border-black mr-4 sm:mr-8">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="border-t-[3px] border-black p-2 sm:p-3 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Type your question..."
                    className="flex-1 px-3 py-2 border-[3px] border-black font-pixel outline-none focus:bg-yellow-50 text-sm min-w-0"
                  />
                  <button
                    onClick={sendChat}
                    disabled={chatLoading || !chatInput.trim()}
                    className="pixel-btn px-3 sm:px-4 py-2 disabled:opacity-50 text-sm shrink-0"
                  >
                    SEND
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="border-t-[3px] border-black mt-12 sm:mt-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center font-pixel text-xs sm:text-sm text-gray-600">
          <p>SCANIFY · AI Document Scanner</p>
          <p className="mt-2 text-[10px] sm:text-xs">Built with Next.js · Open Source</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="pixel-border bg-white p-4 sm:p-6 text-left">
      <div className="text-3xl sm:text-4xl mb-3">{icon}</div>
      <h3 className="font-pixel font-bold text-lg sm:text-xl mb-2">{title}</h3>
      <p className="text-sm text-gray-600 font-pixel leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="pixel-border bg-white p-5 sm:p-6 text-left relative">
      <div className="absolute -top-4 -left-2 bg-[#e5322d] text-white border-[3px] border-black px-3 py-1 font-pixel text-sm">
        {num}
      </div>
      <h3 className="font-pixel font-bold text-xl sm:text-2xl mb-2 mt-2">{title}</h3>
      <p className="text-sm text-gray-600 font-pixel leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pixel-border bg-white p-2 sm:p-3 text-center">
      <p className="text-[10px] sm:text-xs font-pixel text-gray-500 mb-1">{label}</p>
      <p className="font-pixel font-bold text-xs sm:text-sm truncate">{value}</p>
    </div>
  );
}
