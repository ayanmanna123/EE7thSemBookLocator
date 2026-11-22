import { useState } from "react";
import { HighlightText } from "@/components/common/HighlightText";
import { getAllUniquePages } from "@/lib/searchUtils";
import { Zap, Copy, Check } from "lucide-react";

export function SpotlightCard({
  entry,
  query = "",
  subject,
  onSelectPage,
  onOpenKnowMore,
}) {
  const [copied, setCopied] = useState(false);

  if (!query || !entry) return null;

  const allPages = getAllUniquePages(entry);
  const directPages =
    entry.pages && entry.pages.length > 0 ? entry.pages : allPages.slice(0, 8);

  if (allPages.length === 0 && !entry.see) return null;

  const searchUrls = subject?.getSearchUrls ? subject.getSearchUrls(entry.topic) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(allPages.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-sky-500/50 bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-transparent p-5 shadow-lg backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/20 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-sky-400 border border-sky-500/30">
              <Zap className="size-4 shrink-0 fill-sky-400" /> Instant Top Match
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              • {allPages.length} Total Page Reference{allPages.length === 1 ? "" : "s"}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            <HighlightText text={entry.topic} query={query} />
          </h3>

          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {(entry.parts || []).map((pt, idx) => (
              <span
                key={idx}
                className="rounded bg-sky-500/15 px-2 py-0.5 font-semibold text-sky-300 border border-sky-500/20"
              >
                {pt}
              </span>
            ))}
            {(entry.chapters || []).map((ch, idx) => (
              <span
                key={idx}
                className="rounded bg-indigo-500/15 px-2 py-0.5 font-semibold text-indigo-300 border border-indigo-500/20"
              >
                {ch}
              </span>
            ))}
          </div>

          {allPages.length > directPages.length && (
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                All Pages (incl. {entry.subtopics?.length || 0} subtopics):{" "}
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {allPages.join(", ")}
              </span>
            </div>
          )}

          {/* Web actions */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <button
              onClick={() => onOpenKnowMore(entry.topic, "")}
              className="rounded-lg bg-sky-500 px-3.5 py-1 text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-sm cursor-pointer"
            >
              Know More
            </button>

            {searchUrls && (
              <>
                <a
                  href={searchUrls.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/80 bg-background/60 px-2.5 py-1 text-xs font-semibold text-foreground hover:border-sky-400 hover:text-sky-400 transition-colors"
                >
                  Google
                </a>
                <a
                  href={searchUrls.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/80 bg-background/60 px-2.5 py-1 text-xs font-semibold text-foreground hover:border-sky-400 hover:text-sky-400 transition-colors"
                >
                  Wiki
                </a>
                <a
                  href={searchUrls.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/80 bg-background/60 px-2.5 py-1 text-xs font-semibold text-foreground hover:border-sky-400 hover:text-sky-400 transition-colors"
                >
                  YouTube
                </a>
              </>
            )}
          </div>
        </div>

        {/* Right Side Direct Pages & Copy Button */}
        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {directPages.map((p, idx) => {
              const firstPg = parseInt(String(p).split(/[-–]/)[0], 10) || 1;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectPage(firstPg)}
                  className="rounded-xl border border-sky-400/40 bg-sky-500/20 px-3 py-1.5 font-mono text-sm font-extrabold text-sky-400 hover:bg-sky-500 hover:text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                  title={`Inspect Page ${p}`}
                >
                  Page {p}
                </button>
              );
            })}
          </div>

          {allPages.length > 0 && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-extrabold">Copied All Pages!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>Copy All Page Numbers ({allPages.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
