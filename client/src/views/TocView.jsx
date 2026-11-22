import { Search } from "lucide-react";

export function TocView({
  tocData,
  subject,
  onFilterByChapter,
  onSelectPage,
}) {
  const parts = tocData?.parts || [];

  return (
    <div className="space-y-8">
      {parts.map((pt) => {
        const clr = subject?.partColors?.[pt.id] || "#38bdf8";

        return (
          <div
            key={pt.id}
            className="rounded-2xl border border-border/80 bg-card/80 p-5 sm:p-6 shadow-sm backdrop-blur-sm space-y-6"
            style={{ borderLeftWidth: "6px", borderLeftColor: clr }}
          >
            {/* Part Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="rounded-lg px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: clr }}
                >
                  {pt.id}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
                  {pt.title}
                </h3>
              </div>

              <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-lg self-start sm:self-auto">
                Pages {pt.start_page}–{pt.end_page}
              </span>
            </div>

            {/* Chapters */}
            <div className="space-y-6">
              {(pt.chapters || []).map((ch) => {
                const chapLabel = `${ch.id}: ${ch.title}`;

                return (
                  <div
                    key={ch.id}
                    className="rounded-xl border border-border/70 bg-secondary/20 p-4 sm:p-5 space-y-4"
                  >
                    {/* Chapter Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-base font-bold text-foreground">
                        {chapLabel}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onFilterByChapter(chapLabel)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-400 hover:bg-sky-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Search className="size-3" />
                          <span>View Index Topics in {ch.id}</span>
                        </button>

                        <button
                          onClick={() => onSelectPage(ch.start_page)}
                          className="rounded-lg bg-secondary px-2.5 py-1 font-mono text-xs font-bold text-foreground border border-border hover:border-sky-400 hover:text-sky-400 transition-colors cursor-pointer"
                          title="Inspect chapter start page"
                        >
                          pp. {ch.start_page}–{ch.end_page}
                        </button>
                      </div>
                    </div>

                    {/* Sections Grid */}
                    {(ch.sections || []).length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {ch.sections.map((sc) => (
                          <div
                            key={sc.id}
                            className="rounded-lg border border-border/60 bg-card/60 p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2 text-xs font-bold text-foreground">
                              <span>
                                {sc.id} {sc.title}
                              </span>
                              <button
                                onClick={() => onSelectPage(sc.start_page)}
                                className="font-mono text-sky-400 hover:underline shrink-0 cursor-pointer"
                                title="Inspect section page"
                              >
                                p. {sc.start_page}
                              </button>
                            </div>

                            {/* Subsections */}
                            {(sc.subsections || []).length > 0 && (
                              <div className="space-y-1 pl-2 border-l-2 border-border/60">
                                {sc.subsections.map((sub, subIdx) => (
                                  <div
                                    key={subIdx}
                                    className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground"
                                  >
                                    <span className="truncate">{sub.title}</span>
                                    <button
                                      onClick={() => onSelectPage(sub.start_page)}
                                      className="font-mono font-semibold text-sky-400/90 hover:underline shrink-0 cursor-pointer"
                                      title="Inspect subsection page"
                                    >
                                      p. {sub.start_page}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
