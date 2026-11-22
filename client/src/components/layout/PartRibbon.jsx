export function PartRibbon({
  tocData,
  selectedPart,
  onSelectPart,
  partColors = {},
  totalPages,
}) {
  const parts = tocData?.parts || [];
  const maxPage =
    totalPages ||
    (parts.length > 0 && parts[parts.length - 1]?.end_page) ||
    1134;

  return (
    <div
      role="group"
      aria-label="Filter by book part"
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6"
    >
      {/* ALL Card */}
      <button
        onClick={() => onSelectPart("ALL")}
        aria-label="Show all book parts"
        className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all border cursor-pointer ${
          selectedPart === "ALL"
            ? "border-sky-400 bg-sky-500/15 shadow-md ring-2 ring-sky-500/40"
            : "border-border/70 bg-card/60 hover:border-border hover:bg-card"
        }`}
        style={
          selectedPart === "ALL"
            ? { borderTopWidth: "3px", borderTopColor: "#0284c7" }
            : undefined
        }
      >
        <div className="flex items-center justify-between text-xs font-black text-foreground">
          <span className={selectedPart === "ALL" ? "text-sky-600 dark:text-sky-400" : "text-foreground"}>
            ALL
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">1–{maxPage}</span>
        </div>
        <div className="mt-1 text-xs font-semibold text-muted-foreground truncate">
          All Book Parts
        </div>
      </button>

      {/* Part Cards */}
      {parts.map((pt) => {
        const label = `${pt.id}: ${pt.title}`;
        const isActive = selectedPart === label;
        const clr = partColors[pt.id] || "#0284c7";
        const shortId = pt.id === "APPENDICES" ? "APPX" : pt.id;

        return (
          <button
            key={pt.id}
            onClick={() => onSelectPart(isActive ? "ALL" : label)}
            aria-label={`Filter by ${label}`}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all border cursor-pointer ${
              isActive
                ? "shadow-md ring-2"
                : "border-border/70 bg-card/60 hover:border-border hover:bg-card"
            }`}
            style={
              isActive
                ? {
                    borderTopWidth: "3px",
                    borderTopColor: clr,
                    borderColor: clr,
                    backgroundColor: `${clr}1a`,
                    "--tw-ring-color": `${clr}66`,
                  }
                : undefined
            }
          >
            <div className="flex items-center justify-between text-xs font-black text-foreground">
              <span
                style={isActive ? { color: clr } : undefined}
                className={isActive ? "" : "text-foreground"}
              >
                {shortId}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {pt.start_page}–{pt.end_page}
              </span>
            </div>
            <div
              className="mt-1 text-xs font-semibold text-muted-foreground truncate"
              title={pt.title}
            >
              {pt.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}
