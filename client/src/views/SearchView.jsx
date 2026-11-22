import { useState, useMemo } from "react";
import { Search, X, Globe } from "lucide-react";
import { PartRibbon } from "@/components/layout/PartRibbon";
import { SpotlightCard } from "@/components/cards/SpotlightCard";
import { TopicCard } from "@/components/cards/TopicCard";
import { scoreEntry } from "@/lib/searchUtils";

const ALPHABET = ["ALL", "#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export function SearchView({
  subject,
  allSearchData = [],
  tocData,
  query,
  setQuery,
  selectedPart,
  setSelectedPart,
  selectedChapter,
  setSelectedChapter,
  currentLetter,
  setCurrentLetter,
  includeSubtopics,
  setIncludeSubtopics,
  showPageBreakdown,
  setShowPageBreakdown,
  onSelectPage,
  onSelectTopic,
  onOpenKnowMore,
  searchInputRef,
}) {
  const [currentLimit, setCurrentLimit] = useState(75);

  const filteredResults = useMemo(() => {
    let list = allSearchData;

    if (selectedPart !== "ALL") {
      list = list.filter((item) => (item.parts || []).includes(selectedPart));
    }

    if (selectedChapter !== "ALL") {
      list = list.filter((item) => (item.chapters || []).includes(selectedChapter));
    }

    if (currentLetter !== "ALL") {
      list = list.filter((item) => {
        const first = (item.topic || "").trim().charAt(0).toUpperCase();
        if (currentLetter === "#") return /[0-9]/.test(first);
        return first === currentLetter;
      });
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
  }, [allSearchData, selectedPart, selectedChapter, currentLetter, query, includeSubtopics]);

  const displayedList = useMemo(() => {
    return filteredResults.slice(0, currentLimit);
  }, [filteredResults, currentLimit]);

  const topMatch = query.trim() ? filteredResults[0] : null;

  const handleClear = () => {
    setQuery("");
    setCurrentLimit(75);
    searchInputRef?.current?.focus();
  };

  const handlePartFilterChange = (val) => {
    setSelectedPart(val);
    setCurrentLimit(75);
  };

  const handleChapterFilterChange = (val) => {
    setSelectedChapter(val);
    setCurrentLimit(75);
  };

  const handleLetterClick = (letter) => {
    setCurrentLetter(letter);
    setCurrentLimit(75);
  };

  return (
    <div className="space-y-6">
      {/* Search Input & Command Hub */}
      <div className="rounded-2xl border border-border/80 bg-card/85 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Main Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 size-5 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentLimit(75);
            }}
            placeholder={`Search any topic (e.g., ATM, ARP, CRC, TCP, firewall) or page number (e.g., 523)...`}
            className="w-full rounded-xl border-2 border-border/80 bg-background/90 py-3.5 pl-11 pr-32 text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-sky-500 focus:ring-3 focus:ring-sky-500/20"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {query.trim() && (
              <button
                onClick={() => onOpenKnowMore(query.trim(), "")}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                title="Search this query across the web"
              >
                <Globe className="size-3.5" />
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
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-border/50">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedPart}
              onChange={(e) => handlePartFilterChange(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="ALL">All Book Parts (Parts 1–7 & Appendices)</option>
              {(tocData?.parts || []).map((pt) => {
                const label = `${pt.id}: ${pt.title}`;
                return (
                  <option key={pt.id} value={label}>
                    {label} (pp. {pt.start_page}–{pt.end_page})
                  </option>
                );
              })}
            </select>

            <select
              value={selectedChapter}
              onChange={(e) => handleChapterFilterChange(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-sky-400 cursor-pointer max-w-[280px]"
            >
              <option value="ALL">All Chapters (Ch 1–32 & Appendices)</option>
              {(tocData?.chapters || []).map((ch) => {
                const label = `${ch.id}: ${ch.title}`;
                return (
                  <option key={ch.id} value={label}>
                    {label} (pp. {ch.start_page}–{ch.end_page})
                  </option>
                );
              })}
            </select>
          </div>

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

        {/* Alphabet Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {ALPHABET.map((letter) => {
            const isActive = currentLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`rounded-md px-2 py-1 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <PartRibbon
        tocData={tocData}
        selectedPart={selectedPart}
        onSelectPart={handlePartFilterChange}
        partColors={subject?.partColors}
        totalPages={subject?.totalPages || 1134}
      />

      {topMatch && (
        <SpotlightCard
          entry={topMatch}
          query={query}
          subject={subject}
          onSelectPage={onSelectPage}
          onOpenKnowMore={onOpenKnowMore}
        />
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div>
          {query.trim() ? (
            <span>
              Found <strong className="text-foreground">{filteredResults.length.toLocaleString()}</strong>{" "}
              matching result{filteredResults.length === 1 ? "" : "s"} for "
              <strong className="text-sky-400">{query.trim()}</strong>"
            </span>
          ) : (
            <span>
              Showing <strong className="text-foreground">{displayedList.length.toLocaleString()}</strong> of{" "}
              <strong className="text-foreground">{filteredResults.length.toLocaleString()}</strong> index entries
            </span>
          )}
        </div>
        <div className="hidden sm:block text-[11px]">
          Click <strong className="text-sky-400">🌐 Know More</strong> on any card for live explanation & web search
        </div>
      </div>

      {filteredResults.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-4">
          <div className="text-base font-bold text-foreground">
            No textbook index entry found matching "{query}"
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You can still explore this topic directly across Google, Wikipedia, YouTube, or GeeksforGeeks:
          </p>
          <button
            onClick={() => onOpenKnowMore(query, "")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Globe className="size-4" />
            <span>Search "{query}" on Web Resources</span>
          </button>
        </div>
      )}

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
    </div>
  );
}
