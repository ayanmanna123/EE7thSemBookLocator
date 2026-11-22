import { Sun, Moon } from "lucide-react";

export function Header({
  subject,
  subjects = [],
  onSelectSubject,
  kpiStats,
  activeTab,
  onChangeTab,
  isDarkMode,
  onToggleTheme,
  onQuickChipClick,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Brand Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3.5 border-b border-border/50">
          {/* Brand Left */}
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 font-mono text-base font-black text-white shadow-md shadow-sky-500/20">
              {subject?.shortName || "EE"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                  {subject?.bookTitle || "Book Locator"}
                </span>
                {subject?.editionBadge && (
                  <span className="rounded-md bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20">
                    {subject.editionBadge}
                  </span>
                )}
                {subjects.length > 1 && (
                  <div className="relative inline-block ml-1">
                    <select
                      value={subject?.id}
                      onChange={(e) => onSelectSubject(e.target.value)}
                      className="rounded-lg border border-border bg-secondary/80 px-2.5 py-1 text-xs font-bold text-foreground cursor-pointer outline-none focus:ring-1 focus:ring-sky-400"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          📚 {sub.name} ({sub.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {subject?.subtitle || "Instant Topic, Chapter & Page Reference Engine"}
              </div>
            </div>
          </div>

          {/* Brand Right (KPIs & Theme) */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <strong className="text-foreground">{kpiStats?.partsCount || 0}</strong> Parts
              </div>
              <div className="rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <strong className="text-foreground">{kpiStats?.chaptersCount || 0}</strong> Chapters
              </div>
              <div className="rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <strong className="text-foreground">{kpiStats?.sectionsCount || 0}</strong> Sections
              </div>
              <div className="rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <strong className="text-foreground">
                  {(kpiStats?.totalEntries || 0).toLocaleString()}
                </strong>{" "}
                Entries
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/70 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              title="Switch Dark / Light Theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="size-4 shrink-0 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="size-4 shrink-0 text-sky-400" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Command Deck: Tabs & Quick Chips */}
        <div className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Navigation Tabs - Clean, high contrast without micro icons */}
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/70 self-start flex-wrap">
            <button
              onClick={() => onChangeTab("search")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "search"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              Instant Topic Finder
            </button>

            <button
              onClick={() => onChangeTab("toc")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "toc"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              Parts & Chapters Atlas
            </button>

            <button
              onClick={() => onChangeTab("page")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "page"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              Page Inspector (1–{subject?.totalPages || 1134})
            </button>

            <button
              onClick={() => onChangeTab("ai")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "ai"
                  ? "bg-gradient-to-r from-sky-500/25 via-indigo-500/25 to-purple-500/25 text-sky-300 shadow-xs border border-sky-400/50"
                  : "text-sky-400/90 hover:text-sky-300 hover:bg-sky-500/10"
              }`}
            >
              AI Locator
            </button>
          </div>

          {/* Quick Search Chips */}
          {subject?.quickChips && (
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="font-bold text-muted-foreground text-[11px] mr-0.5">Try:</span>
              {subject.quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuickChipClick(chip)}
                  className="rounded-full border border-border/70 bg-card/60 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground hover:border-sky-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
