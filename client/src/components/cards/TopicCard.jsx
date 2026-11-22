import { Fragment } from "react";
import { HighlightText } from "@/components/common/HighlightText";
import { getAllUniquePages, getPartColorForEntry, pageMatchesNumber } from "@/lib/searchUtils";
import { Globe, ExternalLink, ArrowRight } from "lucide-react";

export function TopicCard({
  entry,
  query = "",
  subject,
  showPageBreakdown = true,
  onSelectPage,
  onSelectTopic,
  onOpenKnowMore,
}) {
  const q = query.trim().toLowerCase();
  const isExact = q && (entry.topic || "").toLowerCase() === q;
  const directPages = entry.pages || [];
  const allPages = getAllUniquePages(entry);
  const accentClr = getPartColorForEntry(entry, subject?.partColors);
  const searchUrls = subject?.getSearchUrls ? subject.getSearchUrls(entry.topic) : null;

  return (
    <div
      className={`group relative rounded-xl border border-border/80 bg-card/80 p-5 shadow-sm transition-all hover:border-sky-500/50 hover:shadow-md ${
        isExact ? "ring-2 ring-sky-500/60 bg-sky-500/5" : ""
      }`}
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: accentClr,
      }}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base sm:text-lg font-bold text-foreground break-words">
              <HighlightText text={entry.topic} query={query} />
            </h4>
            {entry.isToc ? (
              <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-500/20">
                {entry.tocKind}
              </span>
            ) : (
              <span className="rounded bg-secondary/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground border border-border">
                Index p. {entry.index_page}
              </span>
            )}
          </div>

          {/* Meta Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            {(entry.parts || []).map((pt, idx) => (
              <span
                key={idx}
                className="rounded-md bg-secondary/60 px-2 py-0.5 font-medium text-foreground/80 border border-border/60"
              >
                {pt}
              </span>
            ))}
            {(entry.chapters || []).map((ch, idx) => (
              <span
                key={idx}
                className="rounded-md bg-secondary/60 px-2 py-0.5 font-medium text-foreground/80 border border-border/60"
              >
                {ch}
              </span>
            ))}
          </div>

          {/* Web Actions Bar */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <button
              onClick={() => onOpenKnowMore(entry.topic, "")}
              className="inline-flex items-center gap-1 rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[11px] font-bold text-sky-400 hover:bg-sky-500 hover:text-white transition-all shadow-xs cursor-pointer"
              title="Read live topic explanation & explore resources"
            >
              <Globe className="size-3" />
              <span>Know More</span>
            </button>

            {searchUrls && (
              <>
                <a
                  href={searchUrls.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border/80 bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-sky-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                >
                  Google <ExternalLink className="size-2.5 opacity-60" />
                </a>
                <a
                  href={searchUrls.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border/80 bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-sky-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                >
                  Wiki <ExternalLink className="size-2.5 opacity-60" />
                </a>
                <a
                  href={searchUrls.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border/80 bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-sky-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                >
                  YouTube <ExternalLink className="size-2.5 opacity-60" />
                </a>
                <a
                  href={searchUrls.gfg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border/80 bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:border-sky-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                >
                  Tutorials <ExternalLink className="size-2.5 opacity-60" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Direct Pages Badges */}
        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {directPages.map((p, idx) => {
              const firstPg = parseInt(String(p).split(/[-–]/)[0], 10) || 1;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectPage(firstPg)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    directPages.length > 1
                      ? "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-400 border border-sky-500/30 hover:border-sky-400 hover:bg-sky-500/30"
                      : "bg-secondary text-foreground border border-border hover:border-sky-400 hover:text-sky-400"
                  }`}
                  title={`Inspect Page ${p}`}
                >
                  p. {p}
                </button>
              );
            })}
          </div>

          {entry.subtopics && entry.subtopics.length > 0 && allPages.length > directPages.length && (
            <div className="font-mono text-[11px] text-emerald-400/90 font-medium max-w-xs text-left sm:text-right">
              All {allPages.length} Pages: {allPages.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Cross-References (See, See Also) */}
      {(entry.see || entry.see_also) && (
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-2 flex-wrap">
          {entry.see && (
            <span className="inline-flex items-center gap-1">
              <span>See:</span>
              <button
                onClick={() => onSelectTopic(entry.see)}
                className="font-bold text-sky-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                {entry.see} <ArrowRight className="size-3" />
              </button>
            </span>
          )}
          {entry.see_also && (
            <span className="inline-flex items-center gap-1">
              <span>See also:</span>
              <button
                onClick={() => onSelectTopic(entry.see_also)}
                className="font-bold text-sky-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                {entry.see_also} <ArrowRight className="size-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Page Trail Breakdown */}
      {showPageBreakdown && entry.page_details && entry.page_details.length > 0 && (
        <div className="mt-3 rounded-lg border border-border/60 bg-secondary/30 p-2.5 space-y-1 text-xs">
          {entry.page_details.map((pd, idx) => {
            const firstPg = parseInt(String(pd.page).split(/[-–]/)[0], 10) || 1;
            const crumbs = [
              pd.part ? <span key="pt" className="text-muted-foreground">{pd.part}</span> : null,
              pd.chapter ? <strong key="ch" className="text-foreground">{pd.chapter}</strong> : null,
              pd.section ? (
                <span key="sec" className="text-sky-400 font-medium">
                  {pd.section}
                </span>
              ) : null,
              pd.subsection ? (
                <em key="sub" className="text-emerald-400">
                  {pd.subsection}
                </em>
              ) : null,
            ].filter(Boolean);

            return (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <button
                  onClick={() => onSelectPage(firstPg)}
                  className="font-mono font-bold text-sky-400 hover:underline shrink-0 cursor-pointer"
                >
                  Page {pd.page}:
                </button>
                <div className="flex items-center gap-1 flex-wrap text-muted-foreground">
                  {crumbs.map((crumb, cIdx) => (
                    <Fragment key={cIdx}>
                      {crumb}
                      {cIdx < crumbs.length - 1 && <span className="opacity-40">→</span>}
                    </Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtopics Grid */}
      {entry.subtopics && entry.subtopics.length > 0 && (
        <div className="mt-3.5 space-y-2 border-t border-border/50 pt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Subtopics ({entry.subtopics.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {entry.subtopics.map((sub, sIdx) => {
              const subMatched =
                q &&
                ((sub.topic || "").toLowerCase().includes(q) ||
                  `${entry.topic} ${sub.topic}`.toLowerCase().includes(q) ||
                  (/^\d+$/.test(q) &&
                    (sub.pages || []).some((p) => pageMatchesNumber(p, parseInt(q, 10)))));

              return (
                <div
                  key={sIdx}
                  className={`rounded-lg border p-2 text-xs transition-colors ${
                    subMatched
                      ? "border-sky-500/50 bg-sky-500/10 text-foreground"
                      : "border-border/60 bg-secondary/20 hover:border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-medium text-foreground flex-1">
                      <span className="text-muted-foreground mr-1">↳</span>
                      <HighlightText text={sub.topic} query={query} />
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {(sub.pages || []).map((p, pIdx) => {
                        const firstPg = parseInt(String(p).split(/[-–]/)[0], 10) || 1;
                        return (
                          <button
                            key={pIdx}
                            onClick={() => onSelectPage(firstPg)}
                            className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-bold text-sky-400 hover:bg-sky-500 hover:text-white transition-colors cursor-pointer"
                          >
                            p. {p}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => onOpenKnowMore(sub.topic, entry.topic)}
                        className="rounded border border-border/60 px-1 py-0.5 text-[10px] font-bold text-muted-foreground hover:border-sky-400 hover:text-sky-400 transition-colors cursor-pointer"
                        title="Know more about subtopic"
                      >
                        🌐 Info
                      </button>
                    </div>
                  </div>

                  {sub.see && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      See:{" "}
                      <button
                        onClick={() => onSelectTopic(sub.see)}
                        className="font-semibold text-sky-400 hover:underline cursor-pointer"
                      >
                        {sub.see}
                      </button>
                    </div>
                  )}

                  {sub.page_details && sub.page_details.length > 0 && (
                    <div className="mt-1 text-[10px] text-muted-foreground truncate">
                      {sub.page_details
                        .map((d) => `${d.chapter}${d.section ? ` • ${d.section}` : ""}`)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .join(" | ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
