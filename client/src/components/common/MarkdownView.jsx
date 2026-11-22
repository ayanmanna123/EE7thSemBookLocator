/**
 * Lightweight, reliable Markdown renderer for AI explanations
 * Handles headers (###, ##), bold (**text**), code blocks, bullet lists,
 * numbered steps, and LaTeX / formulas without requiring bulky external dependencies.
 */
export function MarkdownView({ content = "" }) {
  if (!content) return null;

  // Unescape literal \n if present
  const unescaped = String(content)
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "  ")
    .trim();

  const lines = unescaped.split("\n");
  const elements = [];
  let currentList = [];
  let listType = null; // 'ul' or 'ol'
  let inCodeBlock = false;
  let codeBlockLines = [];

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === "ol") {
        elements.push(
          <ol
            key={`ol-${elements.length}`}
            className="space-y-2 my-2.5 pl-1 list-none"
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-sky-500/15 text-sky-400 font-mono text-[11px] font-bold border border-sky-500/30">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${elements.length}`}
            className="space-y-1.5 my-2.5 pl-1 list-none"
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                <span className="size-1.5 rounded-full bg-sky-400 mt-2 shrink-0 shadow-xs shadow-sky-400/50" />
                <span className="flex-1 leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Code block toggle
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <div
            key={`code-${elements.length}`}
            className="my-3 rounded-xl border border-border/80 bg-black/60 p-3.5 font-mono text-xs overflow-x-auto text-sky-300 shadow-inner"
          >
            <pre>{codeBlockLines.join("\n")}</pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Empty line
    if (!line) {
      flushList();
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h4
          key={`h4-${i}`}
          className="text-sm sm:text-base font-extrabold text-sky-300 mt-4 mb-2 flex items-center gap-2 border-b border-border/40 pb-1"
        >
          <span>{renderInline(line.slice(4))}</span>
        </h4>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-base sm:text-lg font-black text-foreground mt-5 mb-2.5 flex items-center gap-2 border-b border-border/60 pb-1.5"
        >
          <span>{renderInline(line.slice(3))}</span>
        </h3>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-lg sm:text-xl font-black text-foreground mt-6 mb-3 border-b-2 border-sky-400 pb-2"
        >
          <span>{renderInline(line.slice(2))}</span>
        </h2>
      );
      continue;
    }

    // Numbered List (e.g. "1. Item")
    const olMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      currentList.push(olMatch[2]);
      continue;
    }

    // Bullet List (e.g. "* Item", "- Item", "• Item")
    const ulMatch = line.match(/^[*•-]\s+(.*)/);
    if (ulMatch) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      currentList.push(ulMatch[1]);
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${i}`}
        className="my-2 text-xs sm:text-sm text-foreground/90 leading-relaxed"
      >
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

/**
 * Parses inline formatting: **bold**, `code`, and $math$
 */
function renderInline(text) {
  if (!text) return "";

  // Split tokens by bold (**), inline code (`), and math ($)
  // Tokenize regex
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  // Regex to match **bold**, `code`, or $math$
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/;

  while (remaining) {
    const match = remaining.match(tokenRegex);
    if (!match) {
      parts.push(remaining);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      parts.push(remaining.slice(0, matchIndex));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`b-${keyIdx++}`} className="font-extrabold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`c-${keyIdx++}`}
          className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-sky-400 border border-border"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("$") && token.endsWith("$")) {
      parts.push(
        <span
          key={`m-${keyIdx++}`}
          className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs font-bold text-amber-300 border border-amber-500/20 mx-0.5"
        >
          {token.slice(1, -1)}
        </span>
      );
    }

    remaining = remaining.slice(matchIndex + token.length);
  }

  return parts;
}
