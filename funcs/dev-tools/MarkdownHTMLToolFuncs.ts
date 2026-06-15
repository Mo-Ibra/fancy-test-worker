
// ── Markdown → HTML engine ────────────────────────────────────────
// A self-contained parser — no external deps needed.

import { Bold, Code, Eye, Hash, Image, Italic, LinkIcon, List, Minus, Table } from "lucide-react";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseInline(text: string): string {
  return (
    text
      // Escape HTML first
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Code spans (do first to prevent inner parsing)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Images before links
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img src="${src}" alt="${escapeHtml(alt)}">`)
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`)
      // Auto-links
      .replace(/\b(https?:\/\/[^\s<>]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      // Bold + italic
      .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>")
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      // Strikethrough
      .replace(/~~([^~]+)~~/g, "<del>$1</del>")
      // Highlight
      .replace(/==([^=]+)==/g, "<mark>$1</mark>")
      // Line break
      .replace(/  \n/g, "<br>")
  );
}

export interface Block {
  type: string;
  raw: string;
}

export function tokenizeBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (!line.trim()) { i++; continue; }

    // Fenced code block
    const fenceMatch = line.match(/^(`{3,}|~{3,})(.*)?$/);
    if (fenceMatch) {
      const fence = fenceMatch[1];
      const lang = (fenceMatch[2] ?? "").trim();
      const content: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(fence)) {
        content.push(lines[i]);
        i++;
      }
      i++; // consume closing fence
      blocks.push({ type: "code", raw: `${lang}\n${content.join("\n")}` });
      continue;
    }

    // HTML block (passthrough)
    if (/^<(div|section|article|aside|header|footer|nav|main|table|ul|ol|blockquote|pre|script|style)/i.test(line)) {
      const content: string[] = [line];
      i++;
      while (i < lines.length && lines[i].trim()) { content.push(lines[i]); i++; }
      blocks.push({ type: "html", raw: content.join("\n") });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: "heading", raw: `${headingMatch[1].length}\n${headingMatch[2]}` });
      i++; continue;
    }

    // Setext headings (=== or ---)
    if (i + 1 < lines.length) {
      const next = lines[i + 1];
      if (/^=+$/.test(next.trim())) { blocks.push({ type: "heading", raw: `1\n${line}` }); i += 2; continue; }
      if (/^-+$/.test(next.trim()) && next.trim().length > 1) { blocks.push({ type: "heading", raw: `2\n${line}` }); i += 2; continue; }
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      blocks.push({ type: "hr", raw: "" });
      i++; continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      const content: string[] = [];
      while (i < lines.length && (lines[i].startsWith(">") || (content.length && lines[i].trim()))) {
        content.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", raw: content.join("\n") });
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const content: string[] = [];
      while (i < lines.length && (/^[-*+]\s/.test(lines[i]) || /^\s{2,}/.test(lines[i]))) {
        content.push(lines[i]);
        i++;
      }
      blocks.push({ type: "ul", raw: content.join("\n") });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const content: string[] = [];
      while (i < lines.length && (/^\d+\.\s/.test(lines[i]) || /^\s{2,}/.test(lines[i]))) {
        content.push(lines[i]);
        i++;
      }
      blocks.push({ type: "ol", raw: content.join("\n") });
      continue;
    }

    // Table (GFM)
    if (line.includes("|") && i + 1 < lines.length && /^\|?[-:| ]+\|?$/.test(lines[i + 1])) {
      const rows: string[] = [line];
      const separator = lines[i + 1];
      i += 2;
      while (i < lines.length && lines[i].includes("|")) { rows.push(lines[i]); i++; }
      blocks.push({ type: "table", raw: [rows[0], separator, ...rows.slice(1)].join("\n") });
      continue;
    }

    // Definition list (dl dt dd)
    if (i + 1 < lines.length && /^:\s/.test(lines[i + 1])) {
      const content: string[] = [line];
      i++;
      while (i < lines.length && /^:\s/.test(lines[i])) { content.push(lines[i]); i++; }
      blocks.push({ type: "dl", raw: content.join("\n") });
      continue;
    }

    // Paragraph — collect until blank line
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() &&
      !lines[i].match(/^#{1,6}\s/) &&
      !lines[i].match(/^[-*+]\s/) &&
      !lines[i].match(/^\d+\.\s/) &&
      !lines[i].match(/^`{3,}/) &&
      !lines[i].startsWith(">") &&
      !/^[-*_]{3,}$/.test(lines[i].trim())
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", raw: para.join("\n") });
  }

  return blocks;
}

export function renderListItems(lines: string[], ordered: boolean): string {
  const items: string[] = [];
  let current = "";
  for (const line of lines) {
    const match = ordered ? line.match(/^\d+\.\s+(.*)$/) : line.match(/^[-*+]\s+(.*)$/);
    if (match) {
      if (current) items.push(current);
      current = match[1];
    } else {
      current += " " + line.trim();
    }
  }
  if (current) items.push(current);
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>\n${items.map(item => `  <li>${parseInline(item)}</li>`).join("\n")}\n</${tag}>`;
}

export function renderTable(raw: string): string {
  const rows = raw.split("\n");
  if (rows.length < 2) return `<p>${raw}</p>`;
  const headers = rows[0].split("|").map(c => c.trim()).filter(Boolean);
  const separator = rows[1]; // alignment row
  const aligns = separator.split("|").map(c => c.trim()).filter(Boolean).map(c => {
    if (c.startsWith(":") && c.endsWith(":")) return "center";
    if (c.endsWith(":")) return "right";
    return "left";
  });
  const bodyRows = rows.slice(2).filter(r => r.includes("|"));

  const thead = `<thead>\n  <tr>\n${headers.map((h, i) =>
    `    <th style="text-align:${aligns[i] ?? "left"}">${parseInline(h)}</th>`).join("\n")}\n  </tr>\n</thead>`;

  const tbody = bodyRows.length > 0
    ? `<tbody>\n${bodyRows.map(row => {
      const cells = row.split("|").map(c => c.trim()).filter(Boolean);
      return `  <tr>\n${cells.map((c, i) =>
        `    <td style="text-align:${aligns[i] ?? "left"}">${parseInline(c)}</td>`).join("\n")}\n  </tr>`;
    }).join("\n")}\n</tbody>`
    : "";

  return `<table>\n${thead}\n${tbody}\n</table>`;
}

export function renderBlock(block: Block): string {
  switch (block.type) {
    case "heading": {
      const [levelStr, ...rest] = block.raw.split("\n");
      const level = parseInt(levelStr, 10);
      const text = rest.join(" ");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `<h${level} id="${id}">${parseInline(text)}</h${level}>`;
    }
    case "hr":
      return "<hr>";
    case "blockquote":
      return `<blockquote>\n${markdownToHTML(block.raw)}\n</blockquote>`;
    case "code": {
      const [firstLine, ...rest] = block.raw.split("\n");
      const lang = firstLine.trim();
      const content = rest.join("\n");
      return `<pre><code${lang ? ` class="language-${lang}"` : ""}>${escapeHtml(content)}</code></pre>`;
    }
    case "ul":
      return renderListItems(block.raw.split("\n"), false);
    case "ol":
      return renderListItems(block.raw.split("\n"), true);
    case "table":
      return renderTable(block.raw);
    case "dl": {
      const lines = block.raw.split("\n");
      let out = "<dl>\n";
      for (const line of lines) {
        if (/^:\s/.test(line)) out += `  <dd>${parseInline(line.slice(2))}</dd>\n`;
        else out += `  <dt>${parseInline(line)}</dt>\n`;
      }
      return out + "</dl>";
    }
    case "html":
      return block.raw;
    case "paragraph":
    default:
      return `<p>${parseInline(block.raw.replace(/\n/g, " "))}</p>`;
  }
}

export function markdownToHTML(md: string): string {
  const blocks = tokenizeBlocks(md);
  return blocks.map(renderBlock).join("\n");
}

// ── Full HTML document wrapper ────────────────────────────────────

export function wrapHTMLDocument(body: string, title = "Document"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #1a1a2e; line-height: 1.7; }
    h1,h2,h3,h4,h5,h6 { font-weight: 700; margin: 1.5rem 0 0.75rem; color: #0f172a; }
    h1 { font-size: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    p  { margin: 0 0 1rem; }
    a  { color: #3b82f6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { background: #f1f5f9; border-radius: 4px; padding: 0.125rem 0.375rem; font-size: 0.875em; font-family: 'Fira Code', monospace; }
    pre  { background: #1e293b; border-radius: 8px; padding: 1.25rem; overflow-x: auto; }
    pre code { background: none; padding: 0; color: #e2e8f0; font-size: 0.875rem; }
    blockquote { border-left: 4px solid #3b82f6; margin: 1rem 0; padding: 0.5rem 1rem; background: #eff6ff; border-radius: 0 8px 8px 0; }
    blockquote p { margin: 0; color: #1e40af; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th,td { border: 1px solid #e2e8f0; padding: 0.625rem 0.875rem; }
    th { background: #f8fafc; font-weight: 600; }
    tr:nth-child(even) { background: #f8fafc; }
    ul,ol { padding-left: 1.5rem; margin: 0 0 1rem; }
    li { margin-bottom: 0.375rem; }
    hr { border: none; border-top: 2px solid #e2e8f0; margin: 2rem 0; }
    img { max-width: 100%; border-radius: 8px; }
    mark { background: #fef08a; padding: 0 0.25rem; border-radius: 3px; }
    del  { color: #94a3b8; }
    dl dt { font-weight: 600; margin-top: 1rem; }
    dl dd { margin-left: 1.5rem; color: #64748b; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

// ── Stats ─────────────────────────────────────────────────────────

export function getStats(md: string, html: string) {
  const words = md.trim() ? md.trim().split(/\s+/).length : 0;
  const headings = (html.match(/<h[1-6]/g) ?? []).length;
  const links = (html.match(/<a /g) ?? []).length;
  const images = (html.match(/<img /g) ?? []).length;
  const tables = (html.match(/<table/g) ?? []).length;
  const codeBlocks = (html.match(/<pre>/g) ?? []).length;
  return { words, headings, links, images, tables, codeBlocks };
}

// ── Example content ───────────────────────────────────────────────

export const EXAMPLE_MD = `# Welcome to Markdown

This is a **Markdown to HTML** converter. It supports *most* of the [CommonMark](https://commonmark.org) spec plus some **GFM extensions**.

## Text Formatting

You can write **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and ==highlighted== text.

Use \`inline code\` for short snippets.

## Lists

- Unordered item one
- Unordered item two
- Unordered item three

1. First ordered item
2. Second ordered item
3. Third ordered item

## Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

## Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

## Table

| Name    | Language   | Stars  |
|---------|:----------:|-------:|
| React   | JavaScript | 220k   |
| Next.js | TypeScript | 120k   |
| Vue     | JavaScript | 207k   |

## Horizontal Rule

---

## Image

![Alt text](https://via.placeholder.com/400x200)

## Links

Visit [OpenAI](https://openai.com) or auto-link: https://example.com
`;

export const CHEAT_SHEET = [
  { syntax: "# H1", output: "Heading 1", icon: Hash },
  { syntax: "## H2", output: "Heading 2", icon: Hash },
  { syntax: "**bold**", output: "<strong>", icon: Bold },
  { syntax: "*italic*", output: "<em>", icon: Italic },
  { syntax: "~~text~~", output: "<del>", icon: Minus },
  { syntax: "==text==", output: "<mark>", icon: Eye },
  { syntax: "`code`", output: "<code>", icon: Code },
  { syntax: "```lang\\n...\\n```", output: "<pre><code>", icon: Code },
  { syntax: "- item", output: "<ul><li>", icon: List },
  { syntax: "1. item", output: "<ol><li>", icon: List },
  { syntax: "[text](url)", output: "<a href>", icon: LinkIcon },
  { syntax: "![alt](url)", output: "<img>", icon: Image },
  { syntax: "> quote", output: "<blockquote>", icon: Minus },
  { syntax: "---", output: "<hr>", icon: Minus },
  { syntax: "| A | B |\\n|---|---|", output: "<table>", icon: Table },
];

// ── View modes ────────────────────────────────────────────────────

export type ViewLayout = "split" | "editor" | "preview" | "html";
