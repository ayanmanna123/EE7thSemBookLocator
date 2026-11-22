import { useMemo } from "react";
import { TopicCard } from "@/components/cards/TopicCard";
import { pageMatchesNumber } from "@/lib/searchUtils";
import { ChevronLeft, ChevronRight, Hash, Compass } from "lucide-react";

export function PageInspectorView({
  subject,
  tocData,
  indexData = [],
  currentPage = 523,
  setCurrentPage,
  showPageBreakdown = true,
  onSelectTopic,
  onOpenKnowMore,
}) {
  const totalPages = subject?.totalPages || 1134;

  const handlePageChange = (val) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(1, Math.min(totalPages, parsed));
      setCurrentPage(clamped);
    }
  };

  // Find active Part, Chapter, Sections, Subsections for currentPage
  const locationInfo = useMemo(() => {
    let matchedPart = null;
    for (const pt of tocData?.parts || []) {
      if (currentPage >= pt.start_page && currentPage <= pt.end_page) {
        matchedPart = pt;
        break;
      }
    }

    let matchedChap = null;
    for (const ch of tocData?.chapters || []) {
      if (currentPage >= ch.start_page && currentPage <= ch.end_page) {
        matchedChap = ch;
        break;
      }
    }

    const matchedSecs = [];
    const matchedSubs = [];
    if (matchedChap) {
      for (const sc of matchedChap.sections || []) {
        if (currentPage >= sc.start_page && currentPage <= sc.end_page) {
          matchedSecs.push(sc);
          for (const sb of sc.subsections || []) {
            if (sb.start_page === currentPage) {
              matchedSubs.push(sb);
            }
          }
        }
      }
    }

    return { matchedPart, matchedChap, matchedSecs, matchedSubs };
  }, [tocData, currentPage]);

  // Find all index topics referencing this exact page number
  const topicsOnPage = useMemo(() => {
    return (indexData || []).filter(
      (entry) =>
        (entry.pages || []).some((p) => pageMatchesNumber(p, currentPage)) ||
        (entry.subtopics || []).some((s) =>
          (s.pages || []).some((p) => pageMatchesNumber(p, currentPage))
        )
    );
  }, [indexData, currentPage]);

  return (
    <div className="space-y-6">
      {/* Inspector Controls Card */}
      <div className="rounded-2xl border border-border/80 bg-card/85 p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Hash className="size-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Textbook Page Inspector
              </h3>
              <p className="text-xs text-muted-foreground">
                Examine any book page (1 to {totalPages}) with active chapter & all referenced topics
              </p>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              <span>Prev</span>
            </button>

            <div className="relative">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(e.target.value)}
                className="w-24 rounded-lg border-2 border-sky-400/50 bg-background py-1 px-2 text-center font-mono text-base font-extrabold text-sky-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>Page 1</span>
            <span className="font-bold text-sky-400">Current: Page {currentPage}</span>
            <span>Page {totalPages}</span>
          </div>
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => handlePageChange(e.target.value)}
            className="w-full accent-sky-500 cursor-pointer h-2 bg-secondary rounded-lg"
          />
        </div>

        {/* Current Location Hierarchy Banner */}
        <div className="rounded-xl border border-sky-500/25 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-transparent p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-sky-400">
            <Compass className="size-3.5" />
            <span>Book Location for Page {currentPage}</span>
          </div>

          <div className="text-sm sm:text-base font-extrabold text-foreground">
            {locationInfo.matchedPart
              ? `${locationInfo.matchedPart.id}: ${locationInfo.matchedPart.title}`
              : "Front Matter"}
            {locationInfo.matchedChap && (
              <>
                <span className="text-muted-foreground mx-1.5">→</span>
                <span className="text-sky-400">
                  {locationInfo.matchedChap.id}: {locationInfo.matchedChap.title}
                </span>{" "}
                <span className="text-xs font-normal font-mono text-muted-foreground">
                  (pp. {locationInfo.matchedChap.start_page}–{locationInfo.matchedChap.end_page})
                </span>
              </>
            )}
          </div>

          {locationInfo.matchedSecs.length > 0 && (
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 flex-wrap">
              <span>Active Section(s):</span>
              {locationInfo.matchedSecs.map((s, idx) => (
                <span key={s.id}>
                  {s.id} {s.title} (starts p. {s.start_page})
                  {idx < locationInfo.matchedSecs.length - 1 && " • "}
                </span>
              ))}
            </div>
          )}

          {locationInfo.matchedSubs.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Subsections starting on Page {currentPage}: </span>
              {locationInfo.matchedSubs.map((s) => s.title).join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Topics on this Page Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div>
          Found <strong className="text-foreground">{topicsOnPage.length}</strong> Index Topic
          {topicsOnPage.length === 1 ? "" : "s"} referencing{" "}
          <strong className="text-sky-400">Page {currentPage}</strong>:
        </div>
      </div>

      {/* Topics Grid */}
      {topicsOnPage.length > 0 ? (
        <div className="space-y-4">
          {topicsOnPage.map((entry, idx) => (
            <TopicCard
              key={idx}
              entry={entry}
              query={String(currentPage)}
              subject={subject}
              showPageBreakdown={showPageBreakdown}
              onSelectPage={handlePageChange}
              onSelectTopic={onSelectTopic}
              onOpenKnowMore={onOpenKnowMore}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-10 text-center text-xs text-muted-foreground">
          No index topics directly reference Page {currentPage}. Try adjusting the slider or step buttons above.
        </div>
      )}
    </div>
  );
}
