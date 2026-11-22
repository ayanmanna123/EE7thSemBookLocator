export function PartRibbon({
  tocData,
  selectedPart,
  onSelectPart,
  partColors = {},
  totalPages = 1134,
}) {
  const parts = tocData?.parts || [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
      {/* ALL Card */}
      <button
        onClick={() => onSelectPart("ALL")}
        className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all border cursor-pointer ${
          selectedPart === "ALL"
            ? "border-sky-400 bg-sky-500/15 shadow-md ring-2 ring-sky-500/40"
            : "border-border/70 bg-card/60 hover:border-sky-500/40 hover:bg-card"
        }`}
        style={{ borderTopWidth: "3px", borderTopColor: "#38bdf8" }}
      >
        <div className="flex items-center justify-between text-xs font-black text-foreground">
          <span>ALL</span>
          <span className="font-mono text-[10px] text-muted-foreground">1–{totalPages}</span>
        </div>
        <div className="mt-1 text-xs font-semibold text-muted-foreground truncate">
          All Book Parts
        </div>
      </button>

      {/* Part Cards */}
      {parts.map((pt) => {
        const label = `${pt.id}: ${pt.title}`;
        const isActive = selectedPart === label;
        const clr = partColors[pt.id] || "#38bdf8";
        const shortId = pt.id === "APPENDICES" ? "APPX" : pt.id;

        return (
          <button
            key={pt.id}
            onClick={() => onSelectPart(isActive ? "ALL" : label)}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all border cursor-pointer ${
              isActive
                ? "shadow-md ring-2"
                : "border-border/70 bg-card/60 hover:bg-card"
            }`}
            style={{
              borderTopWidth: "3px",
              borderTopColor: clr,
              borderColor: isActive ? clr : undefined,
              backgroundColor: isActive ? `${clr}22` : undefined,
              "--tw-ring-color": isActive ? `${clr}66` : undefined,
            }}
          >
            <div className="flex items-center justify-between text-xs font-black text-foreground">
              <span style={{ color: clr }}>{shortId}</span>
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
