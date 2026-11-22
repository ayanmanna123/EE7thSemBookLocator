import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Search,
  BookOpen,
  Key,
  RotateCcw,
  BookMarked,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Bookmark,
} from "lucide-react";
import {
  askGeminiTextbookLocator,
  getGeminiApiKey,
  setGeminiApiKey,
  hasGeminiApiKey,
} from "@/services/geminiService";

const SUGGESTED_PROMPTS = [
  "Where is regenerative braking in DC and induction motors?",
  "Where is MQTT packet format and architecture in IoT?",
  "Which page explains CRC calculation with generator polynomial?",
  "Where are VSI and CSI induction motor drives compared?",
  "Which page has steady state stability criterion in drives?",
  "Where is TCP 3-way handshake and segment header?",
  "Where is Raspberry Pi GPIO pin layout and SPI/I2C in IoT?",
  "Where are Static Scherbius and Kramer slip recovery drives?",
];

export function AiLocatorView({
  subjects = [],
  activeSubject,
  onSwitchSubject,
  onSelectPage,
  initialQuery = "",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [apiKey, setApiKeyState] = useState(getGeminiApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const inputRef = useRef(null);
  const resultsEndRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  const handleAsk = useCallback(async (promptToAsk) => {
    const q = (promptToAsk || query).trim();
    if (!q) return;

    if (!hasGeminiApiKey()) {
      setShowKeyModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await askGeminiTextbookLocator(q);
      const newEntry = {
        id: Date.now(),
        question: q,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        data: response,
      };

      setHistory((prev) => [newEntry, ...prev]);
      setQuery("");
      setTimeout(() => {
        resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Gemini Error:", err);
      setError(err.message || "Failed to communicate with Gemini API");
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Auto-run if initialQuery passed from search view
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      const timer = setTimeout(() => {
        handleAsk(initialQuery.trim());
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [handleAsk, initialQuery]);

  const handleSaveKey = () => {
    setGeminiApiKey(tempKey);
    setApiKeyState(tempKey);
    setShowKeyModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero AI Command Deck */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-card via-sky-500/5 to-indigo-500/10 p-5 sm:p-7 shadow-lg backdrop-blur-md">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-sky-500/25">
                <Bookmark className="size-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
                    Textbook Page & Chapter Pinpointer
                  </h2>
                  <span className="rounded-md bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[11px] font-extrabold text-sky-400">
                    Fast AI Locator
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Type any topic or question to pinpoint its exact Book, Chapter, Section & Page Numbers
                </p>
              </div>
            </div>

            {/* API Key Status / Setting */}
            <button
              onClick={() => {
                setTempKey(apiKey);
                setShowKeyModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Key className="size-3.5 text-amber-400" />
              <span>{hasGeminiApiKey() ? "API Connected" : "Set API Key"}</span>
              <span
                className={`size-2 rounded-full ${
                  hasGeminiApiKey() ? "bg-emerald-500" : "bg-destructive animate-ping"
                }`}
              />
            </button>
          </div>

          {/* AI Search & Prompt Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 size-5 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              placeholder="Ask where any topic is in the book... e.g., 'Where is regenerative braking in Dubey?'"
              className="w-full rounded-xl border-2 border-sky-500/40 bg-background/90 py-3.5 pl-12 pr-32 text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20 shadow-inner"
            />

            <div className="absolute right-2.5 flex items-center gap-2">
              <button
                onClick={() => handleAsk()}
                disabled={loading || !query.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer hover:scale-102 active:scale-98"
              >
                {loading ? (
                  <>
                    <RotateCcw className="size-3.5 animate-spin" />
                    <span>Finding...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    <span>Find Pages</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Suggested Starter Chips */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="size-3.5 text-amber-400" />
              <span>Quick Page Lookups:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(prompt);
                    handleAsk(prompt);
                  }}
                  className="rounded-lg border border-border/70 bg-card/70 px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive space-y-2">
          <div className="font-bold flex items-center gap-2">
            <span>⚠️ Location Lookup Error</span>
          </div>
          <p>{error}</p>
          <div className="pt-1">
            <button
              onClick={() => setShowKeyModal(true)}
              className="font-bold text-sky-400 underline cursor-pointer"
            >
              Check or update Gemini API key →
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-2xl border border-sky-500/30 bg-card/80 p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-sky-500/20" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-1/4 bg-sky-500/20 rounded" />
              <div className="h-3 w-1/3 bg-muted rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="h-28 bg-secondary/50 rounded-xl" />
            <div className="h-28 bg-secondary/50 rounded-xl" />
          </div>
        </div>
      )}

      {/* Q&A Results Stream */}
      <div className="space-y-6" ref={resultsEndRef}>
        {history.map((entry) => {
          const { question, timestamp, data } = entry;
          const { quickAnswer, citations = [], keyPages = [] } = data || {};

          return (
            <div
              key={entry.id}
              className="rounded-2xl border border-border/80 bg-card/90 p-5 sm:p-6 shadow-md space-y-5 backdrop-blur-sm"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs font-bold text-sky-400 border border-border">
                    Query
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {question}
                  </h3>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground self-start sm:self-auto">
                  {timestamp}
                </div>
              </div>

              {/* Direct 1-Line Locator Answer */}
              {quickAnswer && (
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 sm:p-3.5 text-xs sm:text-sm font-semibold text-foreground flex items-start gap-2.5">
                  <BookMarked className="size-4 text-sky-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-sky-400 mr-1.5">Textbook Location:</span>
                    <span>{quickAnswer}</span>
                  </div>
                </div>
              )}

              {/* Exact Textbook Citations (Hero Section) */}
              {citations.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Exact Textbook Reference Cards ({citations.length}):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {citations.map((cite, cIdx) => {
                      const matchedSub =
                        subjects.find((s) => s.id === cite.subjectId) || activeSubject;
                      const clr = matchedSub?.partColors?.["PART 1"] || "#38bdf8";
                      const pageNum = parseInt(cite.page, 10) || 1;

                      return (
                        <div
                          key={cIdx}
                          className="flex flex-col justify-between rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-3 hover:border-sky-400 transition-colors shadow-xs"
                          style={{ borderTopWidth: "4px", borderTopColor: clr }}
                        >
                          <div className="space-y-2.5">
                            {/* Subject badge & Large Page Number */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span
                                className="rounded-md px-2 py-0.5 text-[11px] font-black uppercase text-white shadow-xs"
                                style={{ backgroundColor: clr }}
                              >
                                {cite.subjectName || matchedSub?.name}
                              </span>

                              <span className="font-mono text-sm font-black text-sky-400 bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 rounded-lg shadow-inner">
                                Page {cite.pageRange || cite.page}
                              </span>
                            </div>

                            {/* Book Title */}
                            <div className="text-xs font-bold text-foreground">
                              {cite.bookTitle}
                            </div>

                            {/* Chapter & Section */}
                            <div className="text-xs space-y-1">
                              {cite.chapter && (
                                <div className="font-bold text-foreground flex items-center gap-1.5">
                                  <span>📖</span>
                                  <span>{cite.chapter}</span>
                                </div>
                              )}
                              {cite.section && (
                                <div className="text-sky-300 font-semibold pl-4">
                                  § {cite.section}
                                </div>
                              )}
                            </div>

                            {/* Short details of what's on this page */}
                            {(cite.details || cite.topicsCovered || cite.relevance) && (
                              <p className="text-[11px] text-muted-foreground pt-1.5 border-t border-border/40 leading-relaxed">
                                {cite.details || cite.topicsCovered || cite.relevance}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-2 border-t border-border/40 flex-wrap">
                            <button
                              onClick={() => {
                                if (cite.subjectId && cite.subjectId !== activeSubject.id) {
                                  onSwitchSubject(cite.subjectId);
                                }
                                onSelectPage(pageNum);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              <BookOpen className="size-3.5" />
                              <span>Open Page {cite.page} in Inspector →</span>
                            </button>

                            {cite.subjectId && cite.subjectId !== activeSubject.id && (
                              <button
                                onClick={() => onSwitchSubject(cite.subjectId)}
                                className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer"
                              >
                                <span>Switch Book</span>
                                <ChevronRight className="size-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-center justify-between gap-3">
                  <span>No specific reference cards were pinpointed. Try rephrasing your topic or search in the Instant Topic Finder.</span>
                  <button
                    onClick={() => handleAsk(question)}
                    className="shrink-0 rounded-lg bg-amber-500/20 px-3 py-1 font-bold text-amber-200 hover:bg-amber-500/30 transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Key Pages Highlights Checklist */}
              {keyPages.length > 0 && (
                <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                    <span>Key Page References:</span>
                  </div>
                  <ul className="space-y-1.5">
                    {keyPages.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-foreground/90 flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State / Welcome Screen */}
      {history.length === 0 && !loading && (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 text-center space-y-3">
          <div className="size-12 mx-auto rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Bookmark className="size-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-foreground">
              Instant Textbook Chapter & Page Pinpointer
            </h3>
            <p className="text-xs text-muted-foreground">
              Ask where any topic, formula, or exam question is located. Gemini AI will immediately give you the Book Title, Chapter, Section, and exact Page Numbers with a 1-click button to open them in the Page Inspector!
            </p>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Key className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Gemini API Configuration
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter your Google Gemini API Key
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Your API key is stored securely in your browser's local environment. It is used to query the Gemini 2.5 Flash model for textbook references.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy... or AQ.Ab8..."
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono text-foreground outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="rounded-lg px-3.5 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
