import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  BookOpen,
  Video,
  Code,
  FileText,
  GraduationCap,
  Sparkles,
  Key,
  RotateCcw,
  BookMarked,
  CheckCircle2,
  Bookmark,
  Trash2,
  Clock,
  History as HistoryIcon,
} from "lucide-react";
import {
  askGeminiTextbookLocator,
  getGeminiApiKey,
  setGeminiApiKey,
  hasGeminiApiKey,
} from "@/services/geminiService";

function ExternalResourceGrid({ topic, subject }) {
  if (!topic || !topic.trim()) return null;
  const cleanTopic = topic.trim();

  const searchUrls = subject?.getSearchUrls
    ? subject.getSearchUrls(cleanTopic)
    : {
        cleanTopic,
        expanded: cleanTopic,
        google: `https://www.google.com/search?q=${encodeURIComponent(`${cleanTopic} ${subject?.name || ""}`)}`,
        wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(cleanTopic)}`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cleanTopic} lecture`)}`,
        gfg: `https://www.google.com/search?q=${encodeURIComponent(`site:geeksforgeeks.org ${cleanTopic}`)}`,
        scholar: `https://scholar.google.com/scholar?q=${encodeURIComponent(cleanTopic)}`,
        ietf: `https://www.google.com/search?q=${encodeURIComponent(`site:datatracker.ietf.org ${cleanTopic}`)}`,
      };

  const standardsLabel =
    subject?.id === "electric-drives" ? "NPTEL / Video Lectures" : "IETF / RFC Standards";

  return (
    <div className="space-y-2 pt-1">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-sky-400" />
        <span>Quick Web & Video Learning Options:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <a
          href={searchUrls.google}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${cleanTopic} on Google Search`}
          className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/50 dark:bg-card/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5 shadow-2xs"
        >
          <Search className="size-4.5 shrink-0 text-sky-500" />
          <span>Google Search</span>
        </a>

        <a
          href={searchUrls.wikipedia}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${cleanTopic} on Wikipedia`}
          className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/50 dark:bg-card/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5 shadow-2xs"
        >
          <BookOpen className="size-4.5 shrink-0 text-emerald-500" />
          <span>Wikipedia</span>
        </a>

        <a
          href={searchUrls.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${cleanTopic} on YouTube Lectures`}
          className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/50 dark:bg-card/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5 shadow-2xs"
        >
          <Video className="size-4.5 shrink-0 text-rose-500" />
          <span>YouTube Lectures</span>
        </a>

        <a
          href={searchUrls.gfg}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${cleanTopic} on GeeksforGeeks`}
          className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/50 dark:bg-card/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5 shadow-2xs"
        >
          <Code className="size-4.5 shrink-0 text-amber-500" />
          <span>GeeksforGeeks</span>
        </a>

        <a
          href={searchUrls.ietf}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${cleanTopic} on ${standardsLabel}`}
          className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/50 dark:bg-card/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5 shadow-2xs"
        >
          <FileText className="size-4.5 shrink-0 text-purple-500" />
          <span>{standardsLabel}</span>
        </a>

        <a
          href={searchUrls.scholar}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Search ${cleanTopic} on Google Scholar`}
          className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-secondary/50 dark:bg-card/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5 shadow-2xs"
        >
          <GraduationCap className="size-4.5 shrink-0 text-blue-500" />
          <span>Google Scholar</span>
        </a>
      </div>
    </div>
  );
}

const AI_HISTORY_STORAGE_KEY = "ee7th_ai_locator_queries";

function getStoredHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AI_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load stored queries from localStorage:", e);
    return [];
  }
}

export function AiLocatorView({
  subjects = [],
  activeSubject,
  allSearchData = [],
  allSubjectsDataMap,
  tocData: _tocData,
  onSwitchSubject,
  onSelectPage,
  initialQuery = "",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(getStoredHistory);
  const [apiKey, setApiKeyState] = useState(getGeminiApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [agentSteps, setAgentSteps] = useState([]);
  const [currentSearchingTopic, setCurrentSearchingTopic] = useState("");

  const inputRef = useRef(null);
  const resultsEndRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  // Sync all queries to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(
        AI_HISTORY_STORAGE_KEY,
        JSON.stringify(history.slice(0, 50))
      );
    } catch (e) {
      console.error("Failed to save queries to localStorage:", e);
    }
  }, [history]);

  const handleAsk = useCallback(async (promptToAsk) => {
    const q = (promptToAsk || query).trim();
    if (!q) return;

    if (!hasGeminiApiKey()) {
      setShowKeyModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setAgentSteps([]);
    setCurrentSearchingTopic(q);

    try {
      const response = await askGeminiTextbookLocator(
        q,
        activeSubject,
        allSearchData,
        allSubjectsDataMap,
        (stepInfo) => {
          setAgentSteps((prev) => [...prev, stepInfo]);
        }
      );
      const newEntry = {
        id: Date.now(),
        question: q,
        subjectId: activeSubject?.id,
        subjectTitle: activeSubject?.name || activeSubject?.title,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toLocaleDateString([], {
          month: "short",
          day: "numeric",
        }),
        data: response,
      };

      setHistory((prev) => [
        newEntry,
        ...prev.filter(
          (item) => item.question.trim().toLowerCase() !== q.toLowerCase()
        ),
      ]);
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
  }, [query, activeSubject, allSearchData, allSubjectsDataMap]);

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

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all stored queries from local storage?")) {
      setHistory([]);
      try {
        localStorage.removeItem(AI_HISTORY_STORAGE_KEY);
      } catch {
        /* ignore storage clear error */
      }
    }
  };

  const handleDeleteEntry = (idToDelete) => {
    setHistory((prev) => prev.filter((item) => item.id !== idToDelete));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero AI Command Deck */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-card via-sky-500/5 to-indigo-500/10 p-5 sm:p-7 shadow-lg backdrop-blur-md">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-md shadow-sky-500/20 border border-border overflow-hidden">
                <img
                  src="/logo.svg"
                  alt="EE Book Locator Logo"
                  className="size-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
                  Textbook Page & Chapter Pinpointer
                </h2>
                {activeSubject && (
                  <p className="text-xs text-muted-foreground font-medium pt-0.5">
                    Focused on: <span className="text-sky-500 dark:text-sky-400 font-bold">{activeSubject.name}</span>{" "}
                    <span className="text-muted-foreground/75 font-mono">({activeSubject.bookTitle})</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              {/* Quick Subject Switcher */}
              {subjects && subjects.length > 1 && (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background/70 border border-border/80">
                  {subjects.map((sub) => {
                    const isSelected = activeSubject?.id === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => onSwitchSubject?.(sub.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-sky-500 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        }`}
                        title={sub.name}
                      >
                        {sub.shortName || sub.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* API Key Status / Setting */}
              <button
                onClick={() => {
                  setTempKey(apiKey);
                  setShowKeyModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
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
              placeholder={`Ask where any topic is in ${activeSubject?.name || "the textbook"}... e.g., 'Where is regenerative braking?'`}
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
                    <RotateCcw className="size-4 shrink-0 animate-spin" />
                    <span>Finding...</span>
                  </>
                ) : (
                  <span>Find Pages</span>
                )}
              </button>
            </div>
          </div>

          {/* Stored Queries in LocalStorage Quick Chips */}
          {history.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <HistoryIcon className="size-3.5 text-sky-400" />
                <span>Recent Stored Queries ({history.length}):</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {history.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setQuery(item.question);
                    }}
                    className="group inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/5 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-sky-500/15 hover:border-sky-400 transition-colors cursor-pointer text-left"
                    title="Click to fill into search box"
                  >
                    <span className="truncate max-w-[220px]">{item.question}</span>
                    <span className="text-[10px] text-sky-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      ↑
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
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

      {/* Live Agentic Search Timeline & Progress */}
      {loading && (
        <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-br from-card via-sky-500/5 to-indigo-500/10 p-5 sm:p-6 shadow-xl space-y-4 backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-border/50 pb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-black tracking-tight text-foreground">
              AI Agentic Search Active
            </span>
            {currentSearchingTopic && (
              <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-0.5 rounded-md truncate max-w-[250px]">
                "{currentSearchingTopic}"
              </span>
            )}
          </div>

          {/* Quick Learning & Web Resource Options while searching */}
          {currentSearchingTopic && (
            <ExternalResourceGrid topic={currentSearchingTopic} subject={activeSubject} />
          )}

          {/* Steps Stream */}
          <div className="space-y-2">
            {agentSteps.length === 0 ? (
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground p-3 rounded-xl bg-background/50 border border-border/60 animate-pulse">
                <RotateCcw className="size-3.5 animate-spin text-sky-400 shrink-0" />
                <span>AI analyzing question and formulating initial textbook search concepts...</span>
              </div>
            ) : (
              agentSteps.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-xs rounded-xl p-3 bg-card/80 border border-border/70 shadow-xs transition-all"
                >
                  <span className="text-base select-none mt-0.5">
                    {s.type === "tool_call"
                      ? "🔍"
                      : s.type === "tool_result"
                      ? "✅"
                      : s.type === "tool_miss"
                      ? "🔄"
                      : s.type === "synthesizing"
                      ? "✨"
                      : s.type === "cache_hit"
                      ? "⚡"
                      : "🧠"}
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {s.step && (
                        <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                          Step {s.step}
                        </span>
                      )}
                      <span className="font-semibold text-foreground">{s.text}</span>
                    </div>
                    {s.matches && s.matches.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Matches:</span>
                        {s.matches.slice(0, 4).map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="text-[10px] font-mono font-medium bg-secondary/80 text-foreground px-2 py-0.5 rounded-md border border-border/70"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Stored Query History Control Bar */}
      {history.length > 0 && (
        <div className="flex items-center justify-between gap-3 px-1 pt-1">
          <div className="flex items-center gap-2">
            <HistoryIcon className="size-4 text-sky-400" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Stored Queries in Local Storage ({history.length})
            </span>
          </div>

          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
            title="Clear all stored queries from local storage"
          >
            <Trash2 className="size-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      )}

      {/* Q&A Results Stream */}
      <div className="space-y-6" ref={resultsEndRef}>
        {history.map((entry) => {
          const { question, timestamp, date, data } = entry;
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
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3 text-muted-foreground/70" />
                    <span>{date ? `${date}, ` : ""}{timestamp}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Delete this query from local storage"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Agentic Tool-Search Verification Badge */}
              {data?.searchedTerms && data.searchedTerms.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-xs rounded-xl bg-sky-500/5 border border-sky-500/20 px-3 py-2">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <span>⚡ Verified via Real Index Data:</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {data.searchedTerms.map((term, tIdx) => (
                      <span
                        key={tIdx}
                        className="font-mono text-[11px] font-semibold bg-background px-2 py-0.5 rounded-md border border-border text-foreground shadow-xs"
                      >
                        "{term}"
                      </span>
                    ))}
                    {data.stepCount && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ({data.stepCount} tool {data.stepCount === 1 ? "call" : "calls"})
                      </span>
                    )}
                  </div>
                </div>
              )}

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

              {/* Quick Learning & Web Resource Options */}
              <ExternalResourceGrid topic={question} subject={activeSubject} />

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
                              className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              Open Page {cite.page} in Inspector →
                            </button>

                            {cite.subjectId && cite.subjectId !== activeSubject.id && (
                              <button
                                onClick={() => onSwitchSubject(cite.subjectId)}
                                className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer"
                              >
                                Switch Book →
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
