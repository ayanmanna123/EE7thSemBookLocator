import { useState, useEffect, useRef } from "react";
import { SUBJECTS, DEFAULT_SUBJECT_ID } from "@/config/subjects";
import { useSubjectData } from "@/hooks/useSubjectData";
import { Header } from "@/components/layout/Header";
import { SearchView } from "@/views/SearchView";
import { TocView } from "@/views/TocView";
import { PageInspectorView } from "@/views/PageInspectorView";
import { AiLocatorView } from "@/views/AiLocatorView";
import { KnowMoreModal } from "@/components/modals/KnowMoreModal";
import { BookOpen, AlertCircle, RefreshCw } from "lucide-react";

export function App() {
  const [activeSubjectId, setActiveSubjectId] = useState(DEFAULT_SUBJECT_ID);
  const activeSubject =
    SUBJECTS.find((s) => s.id === activeSubjectId) || SUBJECTS[0];

  const {
    loading,
    error,
    tocData,
    indexData,
    allSearchData,
    kpiStats,
    allSubjectsDataMap,
  } = useSubjectData(SUBJECTS, activeSubjectId);

  const [activeTab, setActiveTab] = useState("search");
  const [query, setQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState("ALL");
  const [selectedChapter, setSelectedChapter] = useState("ALL");
  const [currentLetter, setCurrentLetter] = useState("ALL");
  const [includeSubtopics, setIncludeSubtopics] = useState(true);
  const [showPageBreakdown, setShowPageBreakdown] = useState(true);
  const [inspectorPage, setInspectorPage] = useState(
    activeSubject?.defaultInspectorPage || 523
  );

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [aiInitialQuery, setAiInitialQuery] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    topicText: "",
    parentTopic: "",
  });

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setActiveTab("search");
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectPage = (pageNum) => {
    const pg = Math.max(
      1,
      Math.min(activeSubject?.totalPages || 1134, parseInt(pageNum, 10) || 1)
    );
    setInspectorPage(pg);
    setActiveTab("page");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTopic = (topicName) => {
    setActiveTab("search");
    setQuery(topicName);
    setSelectedPart("ALL");
    setSelectedChapter("ALL");
    setCurrentLetter("ALL");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterByChapter = (chapLabel) => {
    setActiveTab("search");
    setQuery("");
    setSelectedPart("ALL");
    setSelectedChapter(chapLabel);
    setCurrentLetter("ALL");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenKnowMore = (topicText, parentTopic = "") => {
    setModalState({
      isOpen: true,
      topicText,
      parentTopic,
    });
  };

  const handleQuickChipClick = (chip) => {
    setActiveTab("search");
    setQuery(chip);
    setSelectedPart("ALL");
    setSelectedChapter("ALL");
    setCurrentLetter("ALL");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubjectChange = (subjectId, keepQuery = false) => {
    setActiveSubjectId(subjectId);
    if (!keepQuery) {
      setQuery("");
    }
    setSelectedPart("ALL");
    setSelectedChapter("ALL");
    setCurrentLetter("ALL");
    const sub = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];
    setInspectorPage(sub.defaultInspectorPage || 1);
  };

  const handleAskAi = (promptText = "") => {
    setAiInitialQuery(promptText);
    setActiveTab("ai");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-sky-500/20 selection:text-sky-300">
      <Header
        subject={activeSubject}
        subjects={SUBJECTS}
        onSelectSubject={handleSubjectChange}
        kpiStats={kpiStats}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onQuickChipClick={handleQuickChipClick}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="size-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 animate-pulse flex items-center justify-center text-white shadow-xl shadow-sky-500/25">
                <BookOpen className="size-8" />
              </div>
              <div className="absolute -inset-1 rounded-2xl border-2 border-sky-400/40 animate-ping" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-foreground">
                Loading {activeSubject.name}...
              </h3>
              <p className="text-xs text-muted-foreground">
                Indexing Table of Contents, Chapters, and 4,700+ topics
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto my-16 rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
            <AlertCircle className="size-8 text-destructive mx-auto" />
            <h3 className="text-base font-bold text-foreground">
              Failed to load subject data
            </h3>
            <p className="text-xs text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === "search" && (
              <SearchView
                subject={activeSubject}
                subjects={SUBJECTS}
                allSearchData={allSearchData}
                allSubjectsDataMap={allSubjectsDataMap}
                tocData={tocData}
                query={query}
                setQuery={setQuery}
                selectedPart={selectedPart}
                setSelectedPart={setSelectedPart}
                selectedChapter={selectedChapter}
                setSelectedChapter={setSelectedChapter}
                currentLetter={currentLetter}
                setCurrentLetter={setCurrentLetter}
                includeSubtopics={includeSubtopics}
                setIncludeSubtopics={setIncludeSubtopics}
                showPageBreakdown={showPageBreakdown}
                setShowPageBreakdown={setShowPageBreakdown}
                onSelectPage={handleSelectPage}
                onSelectTopic={handleSelectTopic}
                onOpenKnowMore={handleOpenKnowMore}
                onSwitchSubject={(subId) => handleSubjectChange(subId, true)}
                onAskAi={handleAskAi}
                searchInputRef={searchInputRef}
              />
            )}

            {activeTab === "toc" && (
              <TocView
                tocData={tocData}
                subject={activeSubject}
                onFilterByChapter={handleFilterByChapter}
                onSelectPage={handleSelectPage}
              />
            )}

            {activeTab === "page" && (
              <PageInspectorView
                subject={activeSubject}
                tocData={tocData}
                indexData={indexData}
                currentPage={inspectorPage}
                setCurrentPage={setInspectorPage}
                showPageBreakdown={showPageBreakdown}
                onSelectTopic={handleSelectTopic}
                onOpenKnowMore={handleOpenKnowMore}
              />
            )}

            {activeTab === "ai" && (
              <AiLocatorView
                subjects={SUBJECTS}
                activeSubject={activeSubject}
                onSwitchSubject={(subId) => handleSubjectChange(subId, true)}
                onSelectPage={handleSelectPage}
                onSelectTopic={handleSelectTopic}
                initialQuery={aiInitialQuery}
              />
            )}
          </>
        )}
      </main>

      <KnowMoreModal
        isOpen={modalState.isOpen}
        onClose={(open) => setModalState((prev) => ({ ...prev, isOpen: open }))}
        topicText={modalState.topicText}
        parentTopic={modalState.parentTopic}
        subject={activeSubject}
        allSearchData={allSearchData}
        onOpenTopic={handleOpenKnowMore}
        onAskAi={handleAskAi}
      />

      <footer className="border-t border-border/60 bg-secondary/30 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            EE 7th Semester Multi-Subject Book Locator • Built with React, Tailwind CSS & Shadcn UI
          </div>
          <div className="font-mono text-[11px]">
            {activeSubject.name} ({activeSubject.code}) • {activeSubject.bookTitle}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
