import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogClose, DialogBody } from "@/components/ui/dialog";
import { getAllUniquePages } from "@/lib/searchUtils";
import { ExternalLink, Globe, BookOpen, Search, Video, Code, FileText, GraduationCap } from "lucide-react";

export function KnowMoreModal({
  isOpen,
  onClose,
  topicText,
  parentTopic = "",
  subject,
  allSearchData = [],
  onOpenTopic,
}) {
  const [loadingWiki, setLoadingWiki] = useState(false);
  const [wikiData, setWikiData] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const searchUrls = subject?.getSearchUrls
    ? subject.getSearchUrls(topicText, parentTopic)
    : {
        cleanTopic: topicText,
        expanded: topicText,
        google: `https://www.google.com/search?q=${encodeURIComponent(topicText)}`,
        wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topicText)}`,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(topicText)}`,
        gfg: `https://www.google.com/search?q=${encodeURIComponent(`site:geeksforgeeks.org ${topicText}`)}`,
        scholar: `https://scholar.google.com/scholar?q=${encodeURIComponent(topicText)}`,
        ietf: `https://www.google.com/search?q=${encodeURIComponent(`site:datatracker.ietf.org ${topicText}`)}`,
      };

  const displayTitle = parentTopic ? `${parentTopic} → ${topicText}` : topicText;

  // Search matching book context
  const matchedBookEntry = (allSearchData || []).find(
    (e) => (e.topic || "").toLowerCase() === String(parentTopic || topicText).toLowerCase()
  );
  const bookPages = matchedBookEntry ? getAllUniquePages(matchedBookEntry) : [];
  const bookChapters = (matchedBookEntry?.chapters || []).join(" • ");

  useEffect(() => {
    if (!isOpen || !topicText) return;

    let isMounted = true;
    const termsToTry = [
      searchUrls.expanded,
      `${searchUrls.cleanTopic} (computer networking)`,
      `${searchUrls.cleanTopic} networking`,
      searchUrls.cleanTopic,
    ];

    async function fetchWiki() {
      setLoadingWiki(true);
      setWikiData(null);
      setRelatedArticles([]);
      setErrorMsg("");

      try {
        let bestTitle = null;
        let related = [];

        for (const term of termsToTry) {
          const searchApi = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            term
          )}&utf8=&format=json&origin=*&srlimit=6`;
          const res = await fetch(searchApi);
          const data = await res.json();
          const hits = data?.query?.search || [];
          if (hits.length > 0) {
            bestTitle = hits[0].title;
            related = hits.slice(1, 6).map((h) => h.title);
            break;
          }
        }

        if (!isMounted) return;

        if (!bestTitle) {
          setErrorMsg(
            `No direct Wikipedia summary found for "${searchUrls.expanded}". You can explore via Google, YouTube, or GeeksforGeeks buttons above.`
          );
          setLoadingWiki(false);
          return;
        }

        const summaryRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`
        );
        const summaryData = await summaryRes.json();

        if (!isMounted) return;

        if (summaryData && summaryData.extract) {
          setWikiData({
            title: summaryData.title,
            description: summaryData.description,
            extract: summaryData.extract,
            pageUrl: summaryData.content_urls?.desktop?.page || searchUrls.wikipedia,
            thumbnail: summaryData.thumbnail?.source,
          });
          setRelatedArticles(related);
        } else {
          setErrorMsg(`Read full article or search online for "${bestTitle}".`);
        }
      } catch {
        if (!isMounted) return;
        setErrorMsg("Could not load Wikipedia summary. Use the search engines above.");
      } finally {
        if (isMounted) setLoadingWiki(false);
      }
    }

    fetchWiki();

    return () => {
      isMounted = false;
    };
  }, [isOpen, topicText, parentTopic, searchUrls.expanded, searchUrls.cleanTopic, searchUrls.wikipedia]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
            <Globe className="size-3.5" />
            <span>Topic Knowledge Explorer & Web Search</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
            {displayTitle}
          </DialogTitle>
          <div className="text-xs text-muted-foreground">
            {searchUrls.expanded !== searchUrls.cleanTopic
              ? `Expanded Term: ${searchUrls.expanded}`
              : `${subject?.name || "Subject"} Topic Reference`}
          </div>
        </div>
        <DialogClose onClick={() => onClose(false)} />
      </DialogHeader>

      <DialogBody className="space-y-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            🚀 Search This Topic Across the Web
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <a
              href={searchUrls.google}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:border-sky-500 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5"
            >
              <Search className="size-4 text-sky-400" />
              <span>Google Search</span>
              <ExternalLink className="size-3 ml-auto opacity-50" />
            </a>

            <a
              href={searchUrls.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:border-sky-500 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="size-4 text-emerald-400" />
              <span>Wikipedia</span>
              <ExternalLink className="size-3 ml-auto opacity-50" />
            </a>

            <a
              href={searchUrls.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:border-sky-500 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5"
            >
              <Video className="size-4 text-rose-400" />
              <span>YouTube Lectures</span>
              <ExternalLink className="size-3 ml-auto opacity-50" />
            </a>

            <a
              href={searchUrls.gfg}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:border-sky-500 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5"
            >
              <Code className="size-4 text-amber-400" />
              <span>GeeksforGeeks</span>
              <ExternalLink className="size-3 ml-auto opacity-50" />
            </a>

            <a
              href={searchUrls.ietf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:border-sky-500 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5"
            >
              <FileText className="size-4 text-purple-400" />
              <span>IETF / RFC Standards</span>
              <ExternalLink className="size-3 ml-auto opacity-50" />
            </a>

            <a
              href={searchUrls.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-semibold text-foreground hover:border-sky-500 hover:bg-sky-500/10 transition-all hover:-translate-y-0.5"
            >
              <GraduationCap className="size-4 text-blue-400" />
              <span>Google Scholar</span>
              <ExternalLink className="size-3 ml-auto opacity-50" />
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              Instant Live Summary (Wikipedia Reference)
            </span>
            {wikiData?.pageUrl && (
              <a
                href={wikiData.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-sky-400 hover:underline inline-flex items-center gap-1"
              >
                Read Full Article <ExternalLink className="size-3" />
              </a>
            )}
          </div>

          {loadingWiki && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <span>Fetching live topic summary for "{searchUrls.expanded}"...</span>
            </div>
          )}

          {!loadingWiki && errorMsg && (
            <div className="text-xs text-muted-foreground py-2">{errorMsg}</div>
          )}

          {!loadingWiki && wikiData && (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 space-y-1.5">
                <div className="text-base font-bold text-foreground">
                  {wikiData.title}
                  {wikiData.description && (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      — {wikiData.description}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {wikiData.extract}
                </p>
              </div>
              {wikiData.thumbnail && (
                <img
                  src={wikiData.thumbnail}
                  alt={wikiData.title}
                  className="max-w-[140px] max-h-[140px] rounded-lg border border-border bg-white p-1 object-contain self-center sm:self-start shrink-0"
                />
              )}
            </div>
          )}

          {!loadingWiki && relatedArticles.length > 0 && (
            <div className="pt-2 border-t border-border/50 flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-bold text-muted-foreground mr-1">
                Related Articles:
              </span>
              {relatedArticles.map((rt, idx) => (
                <button
                  key={idx}
                  onClick={() => onOpenTopic(rt, "")}
                  className="rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400 hover:border-sky-400 hover:bg-sky-500/10 transition-colors"
                >
                  {rt}
                </button>
              ))}
            </div>
          )}
        </div>

        {matchedBookEntry && (
          <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              In Your Textbook ({subject?.bookTitle || "Course Book"})
            </div>
            <div className="text-xs text-foreground">
              <span className="font-semibold text-muted-foreground">Pages ({bookPages.length}): </span>
              <span className="font-mono text-emerald-400 font-bold">
                {bookPages.join(", ") || "Refer to subtopics"}
              </span>
            </div>
            {bookChapters && (
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Chapters: </span>
                {bookChapters}
              </div>
            )}
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
}
