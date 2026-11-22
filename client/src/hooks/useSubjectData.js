import { useState, useEffect, useMemo } from "react";

// Persistent memory cache storing loaded data for all subjects
const subjectsDataMap = new Map();

function processSubjectPayload(loadedToc, loadedTopics) {
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
  const stats = {
    partsCount: (loadedToc.parts || []).length,
    chaptersCount: (loadedToc.chapters || []).length,
    sectionsCount: (loadedToc.sections || []).length,
    totalEntries:
      loadedTopics.length +
      loadedTopics.reduce(
        (acc, it) => acc + (it.subtopics ? it.subtopics.length : 0),
        0
      ),
  };

  return {
    tocData: loadedToc,
    indexData: loadedTopics,
    allSearchData: combined,
    kpiStats: stats,
  };
}

async function fetchSubject(subject) {
  if (!subject || subjectsDataMap.has(subject.id)) return;
  const [loadedToc, loadedTopics] = await Promise.all([
    fetch(subject.chaptersFile).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${subject.chaptersFile}: HTTP ${r.status}`);
      return r.json();
    }),
    fetch(subject.topicsFile).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${subject.topicsFile}: HTTP ${r.status}`);
      return r.json();
    }),
  ]);

  const processed = processSubjectPayload(loadedToc, loadedTopics);
  subjectsDataMap.set(subject.id, processed);
}

export function useSubjectData(subjects, activeSubjectId) {
  const subjectList = useMemo(
    () => (Array.isArray(subjects) ? subjects : [subjects]),
    [subjects]
  );
  const currentId = activeSubjectId || subjectList[0]?.id;
  const activeSubject = subjectList.find((s) => s.id === currentId) || subjectList[0];

  const [dataVersion, setDataVersion] = useState(0);
  const [loading, setLoading] = useState(!subjectsDataMap.has(currentId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Prioritize active subject for fastest First Contentful Paint
      if (!subjectsDataMap.has(currentId) && activeSubject) {
        setLoading(true);
        try {
          await fetchSubject(activeSubject);
          if (isMounted) {
            setDataVersion((v) => v + 1);
            setLoading(false);
          }
        } catch (err) {
          if (isMounted) {
            console.error("Error loading active subject:", err);
            setError(err.message);
            setLoading(false);
          }
          return;
        }
      } else {
        setLoading(false);
      }

      // 2. Preload other subjects in idle background time without blocking main thread
      const idleCallback =
        typeof window !== "undefined" && window.requestIdleCallback
          ? window.requestIdleCallback
          : (cb) => setTimeout(cb, 1000);

      idleCallback(async () => {
        if (!isMounted) return;
        const others = subjectList.filter(
          (s) => s && s.id !== currentId && !subjectsDataMap.has(s.id)
        );
        for (const sub of others) {
          try {
            await fetchSubject(sub);
            if (isMounted) setDataVersion((v) => v + 1);
          } catch {
            /* ignore background preload error */
          }
        }
      });
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentId, activeSubject, subjectList]);

  const activeSubjectData = subjectsDataMap.get(currentId) || {
    tocData: { parts: [], chapters: [], sections: [], subsections: [] },
    indexData: [],
    allSearchData: [],
    kpiStats: { partsCount: 0, chaptersCount: 0, sectionsCount: 0, totalEntries: 0 },
  };

  return {
    loading: loading && !subjectsDataMap.has(currentId),
    error,
    tocData: activeSubjectData.tocData,
    indexData: activeSubjectData.indexData,
    allSearchData: activeSubjectData.allSearchData,
    kpiStats: activeSubjectData.kpiStats,
    allSubjectsDataMap: subjectsDataMap,
    dataVersion,
  };
}
