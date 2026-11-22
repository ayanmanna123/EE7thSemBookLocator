import { Sun, Moon } from "lucide-react";
import logoSvg from "@/assets/Electrical Engineering Book Locator Logo.svg";

export function Header({
  subject,
  subjects = [],
  onSelectSubject,
  kpiStats,
  activeTab,
  onChangeTab,
  isDarkMode,
  onToggleTheme,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Brand Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3.5 border-b border-border/50">
          {/* Brand Left */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/95 p-1 border border-border shadow-md shadow-sky-500/10 overflow-hidden transition-transform hover:scale-105">
              <img
                src={logoSvg}
                alt="Electrical Engineering Book Locator Logo"
                width="48"
                height="48"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                {subject?.bookTitle || "Book Locator"}
              </h1>
              {subjects.length > 1 && (
                <div className="relative inline-block ml-1">
                  <select
                    value={subject?.id}
                    onChange={(e) => onSelectSubject(e.target.value)}
                    aria-label="Select textbook subject"
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
              aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
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
          <nav
            role="tablist"
            aria-label="Navigation Tabs"
            className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/70 self-start flex-wrap"
          >
            <button
              role="tab"
              aria-selected={activeTab === "search"}
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
              role="tab"
              aria-selected={activeTab === "toc"}
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
              role="tab"
              aria-selected={activeTab === "page"}
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
              role="tab"
              aria-selected={activeTab === "ai"}
              onClick={() => onChangeTab("ai")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "ai"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              AI Locator
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
