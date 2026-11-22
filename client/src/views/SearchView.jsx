import { useState, useMemo, useEffect } from "react";
import { Search, X, Sparkles, History as HistoryIcon, ArrowRight } from "lucide-react";
import { PartRibbon } from "@/components/layout/PartRibbon";
import { SpotlightCard } from "@/components/cards/SpotlightCard";
import { TopicCard } from "@/components/cards/TopicCard";
import { scoreEntry } from "@/lib/searchUtils";

const SEARCH_HISTORY_KEY = "ee7th_recent_searches";

function getRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function SearchView({
  subject,
  subjects = [],
  allSearchData = [],
  allSubjectsDataMap = new Map(),
  tocData,
  query,
  setQuery,
  selectedPart,
  setSelectedPart,
  selectedChapter,
  setSelectedChapter,
  includeSubtopics,
  setIncludeSubtopics,
  showPageBreakdown,
  setShowPageBreakdown,
  onSelectPage,
  onSelectTopic,
  onOpenKnowMore,
  onSwitchSubject,
  onAskAi,
  searchInputRef,
}) {
  const [currentLimit, setCurrentLimit] = useState(75);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);

  // Auto-persist search queries to localStorage when user types a search term
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      const timer = setTimeout(() => {
        setRecentSearches((prev) => {
          const next = [
            trimmed,
            ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase()),
          ].slice(0, 8);
          try {
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
          } catch {
            /* ignore storage error */
          }
          return next;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
      /* ignore storage clear error */
    }
  };

  const isQuestionLike = useMemo(() => {
    const q = query.trim();
    if (!q) return false;
    return (
      q.includes("?") ||
      q.split(/\s+/).length >= 4 ||
      /^(how|why|what|where|when|explain|describe|difference|compare|which|tell|find)\b/i.test(q)
    );
  }, [query]);

  // 1. Current Subject Filtered Results
  const filteredResults = useMemo(() => {
    let list = allSearchData;

    if (selectedPart !== "ALL") {
      list = list.filter((item) => (item.parts || []).includes(selectedPart));
    }

    if (selectedChapter !== "ALL") {
      list = list.filter((item) => (item.chapters || []).includes(selectedChapter));
    }

    const q = query.trim();
    if (q) {
      const scored = [];
      for (const item of list) {
        const s = scoreEntry(item, q, includeSubtopics);
        if (s > 0) scored.push({ item, s });
      }
      scored.sort((a, b) => b.s - a.s || (a.item.topic || "").localeCompare(b.item.topic || ""));
      return scored.map((x) => x.item);
    }

    return list;
  }, [allSearchData, selectedPart, selectedChapter, query, includeSubtopics]);

  // 2. Cross-Subject Search Matches (Searches across other registered subjects)
  const otherSubjectsMatches = useMemo(() => {
    const q = query.trim();
    if (!q) return [];

    const matches = [];
    for (const otherSub of subjects) {
      if (otherSub.id === subject.id) continue;
      const otherData = allSubjectsDataMap.get(otherSub.id);
      if (!otherData || !otherData.allSearchData) continue;

      const scored = [];
      for (const item of otherData.allSearchData) {
        const s = scoreEntry(item, q, includeSubtopics);
        if (s > 0) scored.push({ item, s });
      }

      if (scored.length > 0) {
        scored.sort((a, b) => b.s - a.s || (a.item.topic || "").localeCompare(b.item.topic || ""));
        matches.push({
          subject: otherSub,
          results: scored.map((x) => x.item),
          count: scored.length,
        });
      }
    }
    return matches;
  }, [query, allSubjectsDataMap, subject.id, subjects, includeSubtopics]);

  const displayedList = useMemo(() => {
    return filteredResults.slice(0, currentLimit);
  }, [filteredResults, currentLimit]);

  const topMatch = query.trim() ? filteredResults[0] : null;

  // Available chapters filtered by selected part
  const availableChapters = useMemo(() => {
    const allChaps = tocData?.chapters || [];
    if (selectedPart === "ALL") return allChaps;
    const pt = (tocData?.parts || []).find(
      (p) => `${p.id}: ${p.title}` === selectedPart || p.id === selectedPart
    );
    if (!pt) return allChaps;
    return allChaps.filter(
      (ch) =>
        ch.part_id === pt.id ||
        `${ch.part_id}: ${ch.part_title}` === selectedPart
    );
  }, [tocData, selectedPart]);

  const handleClear = () => {
    setQuery("");
    setCurrentLimit(75);
    searchInputRef?.current?.focus();
  };

  const handlePartFilterChange = (val) => {
    setSelectedPart(val);
    setSelectedChapter("ALL");
    setCurrentLimit(75);
  };

  const handleChapterFilterChange = (val) => {
    setSelectedChapter(val);
    if (val !== "ALL") {
      const ch = (tocData?.chapters || []).find(
        (c) => `${c.id}: ${c.title}` === val || c.id === val
      );
      if (ch && ch.part_id) {
        const pt = (tocData?.parts || []).find((p) => p.id === ch.part_id);
        if (pt) {
          setSelectedPart(`${pt.id}: ${pt.title}`);
        }
      }
    }
    setCurrentLimit(75);
  };

  return (
    <div className="space-y-6">
      {/* Search Input & Command Hub */}
      <div className="rounded-2xl border border-border/80 bg-card/85 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Main Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 size-4.5 shrink-0 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentLimit(75);
            }}
            placeholder={`Search any topic (e.g., ATM, ARP, CRC, TCP, firewall, Raspberry Pi, MQTT) or page number...`}
            className="w-full rounded-xl border-2 border-border/80 bg-background/90 py-3.5 pl-11 pr-32 text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-sky-500 focus:ring-3 focus:ring-sky-500/20"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {query.trim() && (
              <button
                onClick={() => onOpenKnowMore(query.trim(), "")}
                className="hidden sm:inline-flex items-center rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                title="Search this query across the web"
              >
                <span>Web Search</span>
              </button>
            )}

            {!query.trim() && (
              <kbd className="hidden sm:inline-block rounded border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
                Press /
              </kbd>
            )}

            {query.trim() && (
              <button
                onClick={handleClear}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="size-4 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* AI Question Prompt Banner */}
        {isQuestionLike && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-sky-500/40 bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-transparent p-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 shrink-0 text-amber-400 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-foreground">Have a concept or question? </span>
                <span className="text-muted-foreground">
                  Ask Gemini AI to locate its exact textbook chapters, sections, and page references!
                </span>
              </div>
            </div>
            <button
              onClick={() => onAskAi?.(query.trim())}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>Ask AI Locator →</span>
            </button>
          </div>
        )}

        {/* Recent Search Queries (from Local Storage) */}
        {!query.trim() && recentSearches.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="flex items-center gap-1 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">
              <HistoryIcon className="size-3.5 shrink-0 text-sky-400" />
              Recent Searches:
            </span>
            {recentSearches.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(s)}
                className="rounded-md border border-border/80 bg-secondary/50 px-2 py-0.5 text-xs font-medium text-foreground hover:border-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
            <button
              onClick={handleClearRecentSearches}
              className="text-[11px] text-muted-foreground/60 hover:text-destructive transition-colors cursor-pointer ml-1"
              title="Clear recent searches from local storage"
            >
              Clear
            </button>
          </div>
        )}

        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-border/50">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Parts Dropdown */}
            <select
              value={selectedPart}
              onChange={(e) => handlePartFilterChange(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="ALL">
                All Book Parts ({tocData?.parts?.length || 0} Parts)
              </option>
              {(tocData?.parts || []).map((pt) => {
                const label = `${pt.id}: ${pt.title}`;
                return (
                  <option key={pt.id} value={label}>
                    {label} (pp. {pt.start_page}–{pt.end_page})
                  </option>
                );
              })}
            </select>

            {/* Chapters Dropdown */}
            <select
              value={selectedChapter}
              onChange={(e) => handleChapterFilterChange(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-sky-400 cursor-pointer max-w-[280px]"
            >
              <option value="ALL">
                {selectedPart === "ALL"
                  ? `All Chapters (${tocData?.chapters?.length || 0} Chapters)`
                  : `All Chapters in this Part (${availableChapters.length} Chapters)`}
              </option>
              {availableChapters.map((ch) => {
                const label = `${ch.id}: ${ch.title}`;
                return (
                  <option key={ch.id} value={label}>
                    {label} (pp. {ch.start_page}–{ch.end_page})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search Toggles */}
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
              <input
                type="checkbox"
                checked={includeSubtopics}
                onChange={(e) => setIncludeSubtopics(e.target.checked)}
                className="size-3.5 rounded border-border text-sky-500 focus:ring-sky-400"
              />
              <span>Search inside subtopics</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
              <input
                type="checkbox"
                checked={showPageBreakdown}
                onChange={(e) => setShowPageBreakdown(e.target.checked)}
                className="size-3.5 rounded border-border text-sky-500 focus:ring-sky-400"
              />
              <span>Show Part → Chapter → Section breakdown</span>
            </label>
          </div>
        </div>
      </div>

      {/* Part Visual Ribbon */}
      <PartRibbon
        tocData={tocData}
        selectedPart={selectedPart}
        onSelectPart={handlePartFilterChange}
        partColors={subject?.partColors}
        totalPages={subject?.totalPages}
      />

      {/* Spotlight Top Match Banner */}
      {topMatch && (
        <SpotlightCard
          entry={topMatch}
          query={query}
          subject={subject}
          onSelectPage={onSelectPage}
          onOpenKnowMore={onOpenKnowMore}
        />
      )}

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground px-1">
        <div>
          {query.trim() ? (
            <span>
              Found <strong className="text-foreground">{filteredResults.length.toLocaleString()}</strong>{" "}
              matching result{filteredResults.length === 1 ? "" : "s"} in{" "}
              <strong className="text-sky-400">{subject.name}</strong> for "
              <strong className="text-foreground">{query.trim()}</strong>"
            </span>
          ) : (
            <span>
              Showing <strong className="text-foreground">{displayedList.length.toLocaleString()}</strong> of{" "}
              <strong className="text-foreground">{filteredResults.length.toLocaleString()}</strong> index entries
            </span>
          )}
        </div>

        {/* Other subjects indicator pills */}
        {otherSubjectsMatches.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {otherSubjectsMatches.map(({ subject: matchSub, count }) => (
              <button
                key={matchSub.id}
                onClick={() => onSwitchSubject(matchSub.id)}
                className="inline-flex items-center gap-1 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer"
                title={`Switch to ${matchSub.name}`}
              >
                <span>💡 {count} match{count === 1 ? "" : "es"} in {matchSub.name}</span>
                <ArrowRight className="size-3.5 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. CASE: Current subject has 0 results, but other subjects DO have results! */}
      {filteredResults.length === 0 && otherSubjectsMatches.length > 0 && (
        <div className="space-y-6 pt-2">
          {/* Banner notification */}
          <div className="rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-500/15 via-sky-500/10 to-transparent p-5 sm:p-6 shadow-md backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                  🔍 Found in Other Subject
                </span>
                <h3 className="text-base sm:text-lg font-bold text-foreground mt-2">
                  No index topics found in <span className="text-sky-400">{subject.name}</span> for "
                  <span className="text-amber-400">{query.trim()}</span>"
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  However, we found matching results in another textbook below:
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {otherSubjectsMatches.map(({ subject: matchSub, count }) => (
                  <button
                    key={matchSub.id}
                    onClick={() => onSwitchSubject(matchSub.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:opacity-90 transition-all cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <span>Switch to {matchSub.name} ({count} match{count === 1 ? "" : "es"})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Render the matching topic cards from the other subjects */}
          {otherSubjectsMatches.map(({ subject: matchSub, results }) => (
            <div key={matchSub.id} className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1 border-b border-border/60 pb-2">
                <div className="font-bold text-foreground flex items-center gap-2">
                  <span>📚 Results from {matchSub.name} ({matchSub.bookTitle}):</span>
                  <span className="rounded bg-indigo-500/15 px-2 py-0.5 text-[11px] font-bold text-indigo-300 border border-indigo-500/25">
                    {results.length} match{results.length === 1 ? "" : "es"}
                  </span>
                </div>
                <button
                  onClick={() => onSwitchSubject(matchSub.id)}
                  className="text-xs font-bold text-sky-400 hover:underline cursor-pointer"
                >
                  Make {matchSub.name} active →
                </button>
              </div>

              <div className="space-y-4">
                {results.slice(0, 30).map((entry, idx) => (
                  <TopicCard
                    key={idx}
                    entry={entry}
                    query={query}
                    subject={matchSub}
                    showPageBreakdown={showPageBreakdown}
                    onSelectPage={(pageNum) => {
                      onSwitchSubject(matchSub.id);
                      onSelectPage(pageNum);
                    }}
                    onSelectTopic={onSelectTopic}
                    onOpenKnowMore={onOpenKnowMore}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. CASE: 0 results anywhere */}
      {filteredResults.length === 0 && otherSubjectsMatches.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-10 text-center space-y-4">
          <div className="size-14 mx-auto rounded-xl bg-white p-1.5 border border-border shadow-sm flex items-center justify-center">
            <img src="/logo.svg" alt="EE Book Locator" className="size-full object-contain" />
          </div>
          <div className="text-base font-bold text-foreground">
            No textbook index entry found matching "{query}"
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You can ask Gemini AI to analyze your question across all 3 textbooks or search web resources:
          </p>
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <button
              onClick={() => onAskAi?.(query.trim())}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all cursor-pointer hover:scale-102 active:scale-98"
            >
              <Sparkles className="size-4 animate-pulse" />
              <span>Ask Gemini AI: "Where is this in the textbooks?"</span>
            </button>

            <button
              onClick={() => onOpenKnowMore(query, "")}
              className="inline-flex items-center rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <span>Search on Web Resources →</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. CASE: Display active subject results */}
      {displayedList.length > 0 && (
        <div className="space-y-4">
          {displayedList.map((entry, idx) => (
            <TopicCard
              key={idx}
              entry={entry}
              query={query}
              subject={subject}
              showPageBreakdown={showPageBreakdown}
              onSelectPage={onSelectPage}
              onSelectTopic={onSelectTopic}
              onOpenKnowMore={onOpenKnowMore}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredResults.length > currentLimit && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setCurrentLimit((prev) => prev + 100)}
            className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:opacity-90 transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            Show More Topics ({(filteredResults.length - currentLimit).toLocaleString()} remaining)
          </button>
        </div>
      )}

      {/* 6. CASE: Active subject had results, and other subjects ALSO have results (Bottom section) */}
      {displayedList.length > 0 && otherSubjectsMatches.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border/60 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="font-bold text-foreground text-sm flex items-center gap-2">
              <span>💡 Also Found in Other Course Subjects:</span>
            </div>
          </div>

          {otherSubjectsMatches.map(({ subject: matchSub, results }) => (
            <div
              key={matchSub.id}
              className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">
                  {matchSub.name} ({results.length} match{results.length === 1 ? "" : "es"}):
                </span>
                <button
                  onClick={() => onSwitchSubject(matchSub.id)}
                  className="text-xs font-bold text-sky-400 hover:underline cursor-pointer"
                >
                  Switch to {matchSub.name} →
                </button>
              </div>

              <div className="space-y-3">
                {results.slice(0, 5).map((entry, idx) => (
                  <TopicCard
                    key={idx}
                    entry={entry}
                    query={query}
                    subject={matchSub}
                    showPageBreakdown={showPageBreakdown}
                    onSelectPage={(pageNum) => {
                      onSwitchSubject(matchSub.id);
                      onSelectPage(pageNum);
                    }}
                    onSelectTopic={onSelectTopic}
                    onOpenKnowMore={onOpenKnowMore}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
