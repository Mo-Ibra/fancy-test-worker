
// ── Types ─────────────────────────────────────────────────────────

export type IndentChar = "spaces" | "tabs";
export type IndentSize = 2 | 4;
export type ViewMode = "formatted" | "minified" | "preview";
export type AttrSort = "none" | "alpha";

// ── Formatter engine ──────────────────────────────────────────────

// Void elements (self-closing)
export const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

// Inline elements (don't add extra newlines)
export const INLINE_TAGS = new Set([
  "a", "abbr", "acronym", "b", "bdo", "big", "br", "button", "cite",
  "code", "dfn", "em", "i", "img", "input", "kbd", "label", "map",
  "object", "output", "q", "samp", "select", "small", "span", "strong",
  "sub", "sup", "textarea", "time", "tt", "u", "var",
]);

// Tags where whitespace matters
export const PRE_TAGS = new Set(["pre", "script", "style", "code", "textarea"]);

export interface FormatOptions {
  indentChar: IndentChar;
  indentSize: IndentSize;
  attrSort: AttrSort;
  sortAttrs: boolean;
  wrapAttrs: boolean;
  maxLineLen: number;
  removeComments: boolean;
  collapseWhitespace: boolean;
}

export type Token =
  | { type: "doctype"; raw: string }
  | { type: "comment"; raw: string }
  | { type: "open"; tag: string; attrs: string; selfClose: boolean; raw: string }
  | { type: "close"; tag: string; raw: string }
  | { type: "text"; value: string }
  | { type: "cdata"; raw: string }
  | { type: "script" | "style"; tag: string; attrs: string; content: string };

export function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = html.length;

  while (i < n) {
    if (html[i] !== "<") {
      // Text node
      let j = html.indexOf("<", i);
      if (j === -1) j = n;
      const text = html.slice(i, j);
      if (text) tokens.push({ type: "text", value: text });
      i = j;
      continue;
    }

    // DOCTYPE
    if (html.startsWith("<!DOCTYPE", i) || html.startsWith("<!doctype", i)) {
      const end = html.indexOf(">", i) + 1;
      tokens.push({ type: "doctype", raw: html.slice(i, end) });
      i = end; continue;
    }

    // Comment
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i + 4);
      if (end === -1) { tokens.push({ type: "comment", raw: html.slice(i) }); break; }
      tokens.push({ type: "comment", raw: html.slice(i, end + 3) });
      i = end + 3; continue;
    }

    // CDATA
    if (html.startsWith("<![CDATA[", i)) {
      const end = html.indexOf("]]>", i);
      const raw = end === -1 ? html.slice(i) : html.slice(i, end + 3);
      tokens.push({ type: "cdata", raw });
      i = end === -1 ? n : end + 3; continue;
    }

    // Closing tag
    if (html[i + 1] === "/") {
      const end = html.indexOf(">", i);
      const raw = html.slice(i, end + 1);
      const tag = raw.slice(2, -1).trim().toLowerCase();
      tokens.push({ type: "close", tag, raw });
      i = end + 1; continue;
    }

    // Opening tag (possibly script/style)
    const tagMatch = html.slice(i).match(/^<([a-zA-Z][a-zA-Z0-9:-]*)((?:[^>'"]*|'[^']*'|"[^"]*")*)(\s*\/?)>/);
    if (!tagMatch) { tokens.push({ type: "text", value: "<" }); i++; continue; }

    const [fullMatch, tagName, attrsRaw, selfCloseSlash] = tagMatch;
    const tag = tagName.toLowerCase();
    const selfClose = selfCloseSlash.trim() === "/" || VOID_TAGS.has(tag);

    // Script / style — consume until closing tag
    if ((tag === "script" || tag === "style") && !selfClose) {
      const closeTag = `</${tag}`;
      const contentStart = i + fullMatch.length;
      const closeIdx = html.toLowerCase().indexOf(closeTag, contentStart);
      const content = closeIdx === -1 ? html.slice(contentStart) : html.slice(contentStart, closeIdx);
      tokens.push({ type: tag as "script" | "style", tag, attrs: attrsRaw, content });
      i = closeIdx === -1 ? n : closeIdx + `</${tag}>`.length;
      continue;
    }

    tokens.push({ type: "open", tag, attrs: attrsRaw, selfClose, raw: fullMatch });
    i += fullMatch.length;
  }

  return tokens;
}

export function formatAttrs(attrsRaw: string, opts: FormatOptions): string {
  if (!attrsRaw.trim()) return "";
  // Parse attributes preserving quoted values
  const attrRe = /\s*([^\s=>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  const attrs: { name: string; value?: string; raw: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(attrsRaw)) !== null) {
    if (!m[1]) continue;
    attrs.push({ name: m[1], value: m[2] ?? m[3] ?? m[4], raw: m[0] });
  }

  if (opts.sortAttrs) attrs.sort((a, b) => a.name.localeCompare(b.name));

  return attrs.map(({ name, value }) =>
    value !== undefined ? `${name}="${value}"` : name
  ).join(" ");
}

export function formatHTML(html: string, opts: FormatOptions): { result: string; errors: string[] } {
  const tokens = tokenize(html.trim());
  const errors: string[] = [];
  const indent = opts.indentChar === "tabs" ? "\t" : " ".repeat(opts.indentSize);
  const lines: string[] = [];
  let depth = 0;
  const stack: string[] = [];

  const pad = () => indent.repeat(depth);

  for (const tok of tokens) {
    switch (tok.type) {
      case "doctype":
        lines.push(`${pad()}${tok.raw}`);
        break;

      case "comment":
        if (opts.removeComments) break;
        lines.push(`${pad()}${tok.raw}`);
        break;

      case "cdata":
        lines.push(`${pad()}${tok.raw}`);
        break;

      case "open": {
        const attrs = formatAttrs(tok.attrs, opts);
        const attrStr = attrs ? ` ${attrs}` : "";
        const tag = `<${tok.tag}${attrStr}${tok.selfClose && !VOID_TAGS.has(tok.tag) ? " /" : ""}>`;
        lines.push(`${pad()}${tag}`);
        if (!tok.selfClose && !VOID_TAGS.has(tok.tag)) {
          stack.push(tok.tag);
          if (!INLINE_TAGS.has(tok.tag)) depth++;
        }
        break;
      }

      case "close": {
        const expected = stack[stack.length - 1];
        if (expected && expected !== tok.tag) {
          errors.push(`Unexpected </${tok.tag}>, expected </${expected}>`);
        } else {
          stack.pop();
        }
        if (!INLINE_TAGS.has(tok.tag)) depth = Math.max(0, depth - 1);
        lines.push(`${pad()}</${tok.tag}>`);
        break;
      }

      case "text": {
        const text = opts.collapseWhitespace
          ? tok.value.replace(/\s+/g, " ").trim()
          : tok.value.trim();
        if (text) lines.push(`${pad()}${text}`);
        break;
      }

      case "script":
      case "style": {
        const attrs = formatAttrs(tok.attrs, opts);
        const attrStr = attrs ? ` ${attrs}` : "";
        lines.push(`${pad()}<${tok.tag}${attrStr}>`);
        const contentLines = tok.content.split("\n");
        const indented = contentLines
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((l) => `${pad()}${indent}${l}`);
        lines.push(...indented);
        lines.push(`${pad()}</${tok.tag}>`);
        break;
      }
    }
  }

  if (stack.length > 0) {
    errors.push(`Unclosed tag${stack.length > 1 ? "s" : ""}: ${stack.map((t) => `<${t}>`).join(", ")}`);
  }

  return { result: lines.filter((l) => l.trim() || l === "").join("\n"), errors };
}

export function minifyHTML(html: string, removeComments = true): string {
  let out = html;
  if (removeComments) out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(/\s+/g, " ");
  out = out.replace(/>\s+</g, "><");
  out = out.replace(/\s+>/g, ">");
  out = out.replace(/<\s+/g, "<");
  return out.trim();
}

export function countStats(html: string) {
  return {
    tags: (html.match(/<[^/!][^>]*>/g) ?? []).length,
    attrs: (html.match(/\w+="[^"]*"/g) ?? []).length,
    comments: (html.match(/<!--[\s\S]*?-->/g) ?? []).length,
    lines: html ? html.split("\n").length : 0,
    sizeKb: Math.round(new Blob([html]).size / 1024 * 10) / 10,
  };
}

// ── Example snippets ──────────────────────────────────────────────

export const EXAMPLES = [
  {
    label: "Basic Page",
    value: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>My Page</title></head><body><header><h1>Hello World</h1></header><main><p>Welcome to my <strong>website</strong>. <a href="https://example.com">Click here</a>.</p></main><footer><p>&copy; 2026</p></footer></body></html>`,
  },
  {
    label: "Form",
    value: `<form action="/submit" method="POST"><div class="field"><label for="name">Full Name</label><input type="text" id="name" name="name" required placeholder="Enter your name"></div><div class="field"><label for="email">Email</label><input type="email" id="email" name="email" required></div><div class="field"><label for="msg">Message</label><textarea id="msg" name="message" rows="4"></textarea></div><button type="submit" class="btn btn-primary">Send</button></form>`,
  },
  {
    label: "Nav + Cards",
    value: `<nav class="navbar"><a href="/" class="logo">Brand</a><ul class="nav-links"><li><a href="/about">About</a></li><li><a href="/services">Services</a></li><li><a href="/contact">Contact</a></li></ul></nav><section class="cards"><div class="card"><img src="img1.jpg" alt="Card 1"><h2>Feature One</h2><p>Short description here.</p><a href="#" class="cta">Learn more</a></div><div class="card"><img src="img2.jpg" alt="Card 2"><h2>Feature Two</h2><p>Short description here.</p><a href="#" class="cta">Learn more</a></div></section>`,
  },
];