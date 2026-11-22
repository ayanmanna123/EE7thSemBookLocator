export function HighlightText({ text, query, className = "" }) {
  if (!text) return null;
  if (!query || !query.trim()) return <span className={className}>{text}</span>;

  const q = query.trim();
  const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = String(text).split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={index}
            className="rounded bg-amber-400/35 px-1 py-0.5 font-bold text-amber-900 dark:text-amber-200"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
