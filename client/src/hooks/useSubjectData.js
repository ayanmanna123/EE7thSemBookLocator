import { useState, useEffect } from "react";

const dataCache = new Map();

export function useSubjectData(subject) {
  const cached = subject ? dataCache.get(subject.id) : null;

  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [tocData, setTocData] = useState(
    cached ? cached.tocData : { parts: [], chapters: [], sections: [], subsections: [] }
  );
  const [indexData, setIndexData] = useState(cached ? cached.indexData : []);
  const [allSearchData, setAllSearchData] = useState(cached ? cached.allSearchData : []);
  const [kpiStats, setKpiStats] = useState(
    cached
      ? cached.kpiStats
      : { partsCount: 0, chaptersCount: 0, sectionsCount: 0, totalEntries: 0 }
  );

  useEffect(() => {
    if (!subject) return;

    if (dataCache.has(subject.id)) {
      return;
    }

    let isMounted = true;

    Promise.all([
      fetch(subject.chaptersFile).then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${subject.chaptersFile}: HTTP ${r.status}`);
        return r.json();
      }),
      fetch(subject.topicsFile).then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${subject.topicsFile}: HTTP ${r.status}`);
        return r.json();
      }),
    ])
      .then(([loadedToc, loadedTopics]) => {
        if (!isMounted) return;

        const tocEntries = [];
        (loadedToc.parts || []).forEach((pt) => {
          const pLabel = `${pt.id}: ${pt.title}`;
          tocEntries.push({
            isToc: true,
            tocKind: "Book Part",
            partKey: pt.id,
            topic: pLabel,
            pages: [`${pt.start_page}–${pt.end_page}`],
            parts: [pLabel],
            chapters: (pt.chapters || []).map((c) => `${c.id}: ${c.title}`),
            page_details: [
              {
                page: `${pt.start_page}–${pt.end_page}`,
                part: pLabel,
                chapter: `${(pt.chapters || []).length} Chapters`,
                section: "",
                subsection: "",
              },
            ],
            subtopics: (pt.chapters || []).map((c) => ({
              topic: `${c.id}: ${c.title}`,
              pages: [`${c.start_page}–${c.end_page}`],
              page_details: [],
            })),
          });
        });

        (loadedToc.chapters || []).forEach((ch) => {
          const partLabel = `${ch.part_id}: ${ch.part_title}`;
          const chapLabel = `${ch.id}: ${ch.title}`;
          tocEntries.push({
            isToc: true,
            tocKind: "Chapter",
            partKey: ch.part_id,
            topic: chapLabel,
            pages: [`${ch.start_page}–${ch.end_page}`],
            parts: [partLabel],
            chapters: [chapLabel],
            page_details: [
              {
                page: `${ch.start_page}–${ch.end_page}`,
                part: partLabel,
                chapter: chapLabel,
                section: `${(ch.sections || []).length} Sections`,
                subsection: "",
              },
            ],
            subtopics: (ch.sections || []).map((sc) => ({
              topic: `${sc.id} ${sc.title}`,
              pages: [String(sc.start_page)],
              page_details: [],
            })),
          });

          (ch.sections || []).forEach((sc) => {
            tocEntries.push({
              isToc: true,
              tocKind: "Section",
              partKey: ch.part_id,
              topic: `${sc.id} ${sc.title}`,
              pages: [String(sc.start_page)],
              parts: [partLabel],
              chapters: [chapLabel],
              page_details: [
                {
                  page: String(sc.start_page),
                  part: partLabel,
                  chapter: chapLabel,
                  section: `${sc.id} ${sc.title}`,
                  subsection: "",
                },
              ],
              subtopics: (sc.subsections || []).map((sub) => ({
                topic: sub.title,
                pages: [String(sub.start_page)],
                page_details: [],
              })),
            });
          });
        });

        const combined = [...tocEntries, ...loadedTopics];
        const mainCount = loadedTopics.length;
        const subCount = loadedTopics.reduce(
          (acc, item) => acc + (item.subtopics ? item.subtopics.length : 0),
          0
        );
        const stats = {
          partsCount: (loadedToc.parts || []).length,
          chaptersCount: (loadedToc.chapters || []).length,
          sectionsCount: (loadedToc.sections || []).length,
          totalEntries: mainCount + subCount,
        };

        const result = {
          tocData: loadedToc,
          indexData: loadedTopics,
          allSearchData: combined,
          kpiStats: stats,
        };

        dataCache.set(subject.id, result);

        setTocData(loadedToc);
        setIndexData(loadedTopics);
        setAllSearchData(combined);
        setKpiStats(stats);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error loading subject data:", err);
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [subject]);

  return { loading, error, tocData, indexData, allSearchData, kpiStats };
}
