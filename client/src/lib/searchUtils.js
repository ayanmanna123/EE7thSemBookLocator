export function getAllUniquePages(entry) {
  if (!entry) return [];
  const set = new Set();
  (entry.pages || []).forEach((p) => set.add(p));
  (entry.subtopics || []).forEach((sub) => {
    (sub.pages || []).forEach((p) => set.add(p));
  });
  return Array.from(set);
}

export function pageMatchesNumber(pageStr, targetNum) {
  if (!pageStr) return false;
  const clean = String(pageStr).trim().replace(/–/g, "-");
  if (clean.includes("-")) {
    const [a, b] = clean.split("-").map((x) => parseInt(x.trim(), 10));
    if (!isNaN(a) && !isNaN(b)) return targetNum >= a && targetNum <= b;
  }
  return parseInt(clean, 10) === targetNum;
}

export function scoreEntry(entry, query, includeSubtopics = true) {
  if (!entry || !query) return 0;
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const t = (entry.topic || "").toLowerCase();

  // If query is a pure page number
  if (/^\d+$/.test(q)) {
    const pgNum = parseInt(q, 10);
    if ((entry.pages || []).some((p) => pageMatchesNumber(p, pgNum))) return 900;
    if (
      (entry.subtopics || []).some((s) =>
        (s.pages || []).some((p) => pageMatchesNumber(p, pgNum))
      )
    )
      return 600;
  }

  if (t === q) return 1000;
  if (t.startsWith(q)) return 560 - Math.min(t.length, 100);
  const wordRegex = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
  if (wordRegex.test(entry.topic)) return 360 - Math.min(t.length, 100);
  if (t.includes(q)) return 230 - Math.min(t.length, 100);

  if (includeSubtopics && entry.subtopics) {
    for (const sub of entry.subtopics) {
      const st = (sub.topic || "").toLowerCase();
      const combined = `${t} ${st}`;
      if (st === q || combined === q) return 310;
      if (st.startsWith(q)) return 200;
      if (st.includes(q) || combined.includes(q)) return 140;
    }
  }
  return 0;
}

export function getPartColorForEntry(entry, partColors = {}) {
  const firstPart = (entry.parts && entry.parts[0]) || "";
  const key = firstPart.split(":")[0].trim();
  return partColors[key] || "#38bdf8";
}
