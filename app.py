#!/usr/bin/env python3
"""
Book Topic, Part, Chapter, Section & Page Number Finder
-------------------------------------------------------
Uses both:
- `topics.json`: All 2,081 main topics and 2,679 subtopics (4,760 index entries) from
  Index Pages 1111-1134, enriched with Part, Chapter, Section, and Subsection mappings.
- `chapters.json`: Full Table of Contents hierarchy (8 Parts, 44 Chapters/Appendices,
  263 Sections, and 569 Subsections) extracted from the 20 images in `part-chapter/`.

Modes:
1. Web Server (`python app.py`): Starts local server at http://localhost:8000 serving
   `index.html`, `/api/search?q=<topic>`, and `/api/chapters`.
2. Interactive CLI (`python app.py --cli`): Type any topic name to immediately view all
   page numbers along with the exact Part, Chapter, Section, and Subsection for each page.
3. Single Search (`python app.py --search "ATM"`): Print all page numbers and chapter
   locations for a topic directly in the terminal.
"""

import argparse
import http.server
import json
import os
import socketserver
import urllib.parse
import webbrowser
from typing import Any, Dict, List

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOPICS_JSON_PATH = os.path.join(BASE_DIR, "topics.json")
CHAPTERS_JSON_PATH = os.path.join(BASE_DIR, "chapters.json")
PORT = 8000


def load_topics(json_path: str = TOPICS_JSON_PATH) -> List[Dict[str, Any]]:
    """Load the enriched book index topics from topics.json."""
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_chapters(json_path: str = CHAPTERS_JSON_PATH) -> Dict[str, Any]:
    """Load the full Table of Contents (Parts, Chapters, Sections, Subsections) from chapters.json."""
    if not os.path.exists(json_path):
        return {"parts": [], "chapters": [], "sections": [], "subsections": []}
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_all_pages_for_entry(entry: Dict[str, Any]) -> List[str]:
    """Return all unique page numbers/ranges for a topic (including its subtopics)."""
    seen = []
    for p in entry.get("pages", []):
        if p not in seen:
            seen.append(p)
    for sub in entry.get("subtopics", []):
        for p in sub.get("pages", []):
            if p not in seen:
                seen.append(p)
    return seen


def search_topic(query: str, topics: List[Dict[str, Any]], toc: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """
    Search both the Table of Contents (Parts, Chapters, Sections) and the Book Index
    for `query` and return ranked matching entries with all page numbers and Part/Chapter/Section details.
    """
    q = query.strip().lower()
    if not q:
        return topics

    scored_results = []

    # 1. Search Table of Contents (Chapters & Sections) if available
    if toc:
        for ch in toc.get("chapters", []):
            ch_title = f"{ch['id']}: {ch['title']}"
            if q in ch_title.lower():
                score = 950 if ch_title.lower() == q else 450
                scored_results.append((
                    score,
                    ch_title.lower(),
                    {
                        "topic": ch_title,
                        "pages": [f"{ch['start_page']}-{ch['end_page']}"],
                        "all_pages": [f"{ch['start_page']}-{ch['end_page']}"],
                        "parts": [f"{ch['part_id']}: {ch['part_title']}"],
                        "chapters": [ch_title],
                        "page_details": [
                            {
                                "page": f"{ch['start_page']}-{ch['end_page']}",
                                "part": f"{ch['part_id']}: {ch['part_title']}",
                                "chapter": ch_title,
                                "section": f"{len(ch.get('sections', []))} Sections",
                                "subsection": "",
                            }
                        ],
                        "subtopics": [
                            {"topic": f"{s['id']} {s['title']}", "pages": [str(s["start_page"])]}
                            for s in ch.get("sections", [])
                        ],
                    },
                ))
            for sec in ch.get("sections", []):
                sec_title = f"{sec['id']} {sec['title']}"
                if q in sec_title.lower():
                    score = 900 if sec_title.lower() == q else 420
                    scored_results.append((
                        score,
                        sec_title.lower(),
                        {
                            "topic": sec_title,
                            "pages": [str(sec["start_page"])],
                            "all_pages": [str(sec["start_page"])],
                            "parts": [f"{ch['part_id']}: {ch['part_title']}"],
                            "chapters": [ch_title],
                            "page_details": [
                                {
                                    "page": str(sec["start_page"]),
                                    "part": f"{ch['part_id']}: {ch['part_title']}",
                                    "chapter": ch_title,
                                    "section": sec_title,
                                    "subsection": "",
                                }
                            ],
                            "subtopics": [
                                {"topic": sub["title"], "pages": [str(sub["start_page"])]}
                                for sub in sec.get("subsections", [])
                            ],
                        },
                    ))

    # 2. Search Book Index Topics & Subtopics
    for entry in topics:
        topic_name = entry.get("topic", "")
        t_lower = topic_name.lower()
        score = 0

        if t_lower == q:
            score = 1000
        elif t_lower.startswith(q):
            score = 500 - min(len(t_lower), 100)
        elif q in t_lower:
            score = 250 - min(len(t_lower), 100)

        matching_subtopics = []
        for sub in entry.get("subtopics", []):
            sub_name = sub.get("topic", "")
            s_lower = sub_name.lower()
            combined = f"{t_lower} {s_lower}"
            if s_lower == q or combined == q:
                score = max(score, 400)
                matching_subtopics.append(sub)
            elif q in s_lower or q in combined:
                score = max(score, 150)
                matching_subtopics.append(sub)

        if score > 0:
            result = dict(entry)
            result["all_pages"] = get_all_pages_for_entry(entry)
            result["matching_subtopics"] = matching_subtopics
            scored_results.append((score, topic_name.lower(), result))

    scored_results.sort(key=lambda item: (-item[0], item[1]))
    return [item[2] for item in scored_results]


class TopicSearchRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler serving the interactive website, `/api/search`, and `/api/chapters`."""

    topics_cache: List[Dict[str, Any]] = []
    toc_cache: Dict[str, Any] = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/search":
            params = urllib.parse.parse_qs(parsed.query)
            q = params.get("q", [""])[0]
            matches = search_topic(q, self.topics_cache, self.toc_cache)
            payload = json.dumps(
                {"query": q, "count": len(matches), "results": matches[:200]},
                ensure_ascii=False,
            ).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        if parsed.path == "/api/chapters":
            payload = json.dumps(self.toc_cache, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        return super().do_GET()


def get_web_search_links(topic_name: str) -> Dict[str, str]:
    """Generate web search URLs (Google, Wikipedia, YouTube, GeeksforGeeks) for a topic."""
    q_net = urllib.parse.quote(f"{topic_name} computer networks data communications")
    q_wiki = urllib.parse.quote(topic_name)
    q_yt = urllib.parse.quote(f"{topic_name} computer networks lecture Forouzan")
    return {
        "google": f"https://www.google.com/search?q={q_net}",
        "wikipedia": f"https://en.wikipedia.org/wiki/Special:Search?search={q_wiki}",
        "youtube": f"https://www.youtube.com/results?search_query={q_yt}",
    }


def print_entry_details(idx: int, item: Dict[str, Any]) -> None:
    """Format and print a single topic entry with all page numbers, Part/Chapter/Section details, and web links."""
    direct_pages = ", ".join(item.get("pages", [])) or "(see subtopics)"
    all_pages = ", ".join(item.get("all_pages", []))
    links = get_web_search_links(item["topic"])
    print(f"\n{idx}. {item['topic']}  -->  Pages: {direct_pages}")
    if len(item.get("all_pages", [])) > len(item.get("pages", [])):
        print(f"   All Pages (including subtopics): {all_pages}")
    if item.get("parts"):
        print(f"   Part(s):    {' | '.join(item['parts'])}")
    if item.get("chapters"):
        print(f"   Chapter(s): {' | '.join(item['chapters'])}")
    if item.get("see"):
        print(f"   See: {item['see']}")
    if item.get("see_also"):
        print(f"   See also: {item['see_also']}")
    print(f"   Know More:  Google: {links['google']}")
    print(f"               Wiki:   {links['wikipedia']}")
    for pd in item.get("page_details", []):
        loc_parts = [p for p in (pd.get("part"), pd.get("chapter"), pd.get("section"), pd.get("subsection")) if p]
        print(f"     [Page {pd['page']}] {' -> '.join(loc_parts)}")
    for sub in item.get("subtopics", []):
        sub_pages = ", ".join(sub.get("pages", []))
        if sub.get("see"):
            sub_pages = f"See {sub['see']}"
        print(f"     - {sub['topic']}: {sub_pages}")


def run_cli(topics: List[Dict[str, Any]], toc: Dict[str, Any]) -> None:
    """Interactive command-line loop to look up topic page numbers and chapter details."""
    print("=" * 72)
    print(
        f"Loaded {len(toc.get('parts', []))} Parts, {len(toc.get('chapters', []))} Chapters/Appendices, "
        f"and {len(topics)} Index Topics."
    )
    print("Type any topic name to see all its page numbers, Parts, Chapters & Sections ('q' to quit).")
    print("=" * 72)
    while True:
        try:
            query = input("\nEnter topic name: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break
        if query.lower() in ("q", "quit", "exit"):
            break
        if not query:
            continue

        matches = search_topic(query, topics, toc)
        if not matches:
            print(f"  No topics found matching '{query}'.")
            continue

        print(f"\nFound {len(matches)} matching topic(s) for '{query}':")
        for idx, item in enumerate(matches[:15], start=1):
            print_entry_details(idx, item)


def run_server(
    topics: List[Dict[str, Any]],
    toc: Dict[str, Any],
    port: int = PORT,
    open_browser: bool = True,
) -> None:
    """Start the local web server for the Topic, Part, Chapter & Page Number Finder website."""
    TopicSearchRequestHandler.topics_cache = topics
    TopicSearchRequestHandler.toc_cache = toc
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), TopicSearchRequestHandler) as httpd:
        url = f"http://localhost:{port}"
        print(f"Book Topic & Chapter Finder Website running at: {url}")
        print("Press Ctrl+C to stop the server.")
        if open_browser:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Book Topic, Part, Chapter & Page Number Finder")
    parser.add_argument("--cli", action="store_true", help="Run in interactive terminal CLI mode")
    parser.add_argument("--port", type=int, default=PORT, help="Port for the web server (default: 8000)")
    parser.add_argument("--no-browser", action="store_true", help="Do not auto-open browser when starting server")
    parser.add_argument("--search", type=str, help="Search a topic once and print all page numbers & chapters")
    args = parser.parse_args()

    topics_list = load_topics()
    toc_data = load_chapters()
    if args.search:
        results = search_topic(args.search, topics_list, toc_data)
        for idx, r in enumerate(results[:15], start=1):
            print_entry_details(idx, r)
    elif args.cli:
        run_cli(topics_list, toc_data)
    else:
        run_server(topics_list, toc_data, port=args.port, open_browser=not args.no_browser)
