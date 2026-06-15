
// ── Types ─────────────────────────────────────────────────────────

export type IndentChar = "spaces" | "tabs";
export type IndentSize = 2 | 4;
export type PropSort = "none" | "alpha" | "grouped";
export type ViewMode = "formatted" | "minified";
export type BracketStyle = "same-line" | "new-line";
export type ColorFormat = "none" | "hex" | "rgb" | "hsl";

export interface FormatOptions {
  indentChar: IndentChar;
  indentSize: IndentSize;
  bracketStyle: BracketStyle;
  propSort: PropSort;
  removeComments: boolean;
  addSemicolons: boolean;
  singleLineRules: boolean;
  colorFormat: ColorFormat;
  spaceAfterColon: boolean;
}

export interface CSSIssue {
  type: "error" | "warning";
  message: string;
}

// ── Property grouping for "grouped" sort ─────────────────────────

export const PROP_GROUPS: { group: string; props: string[] }[] = [
  { group: "Layout", props: ["display", "visibility", "position", "top", "right", "bottom", "left", "z-index", "float", "clear", "overflow", "overflow-x", "overflow-y", "clip", "box-sizing", "resize"] },
  { group: "Flexbox/Grid", props: ["flex", "flex-direction", "flex-wrap", "flex-flow", "justify-content", "align-items", "align-content", "align-self", "flex-grow", "flex-shrink", "flex-basis", "order", "grid", "grid-template", "grid-template-columns", "grid-template-rows", "grid-template-areas", "grid-column", "grid-row", "grid-area", "gap", "column-gap", "row-gap"] },
  { group: "Dimensions", props: ["width", "min-width", "max-width", "height", "min-height", "max-height", "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left"] },
  { group: "Typography", props: ["font", "font-family", "font-size", "font-weight", "font-style", "font-variant", "line-height", "letter-spacing", "text-align", "text-decoration", "text-transform", "text-indent", "text-overflow", "white-space", "word-break", "word-spacing", "color"] },
  { group: "Background", props: ["background", "background-color", "background-image", "background-repeat", "background-position", "background-size", "background-attachment", "background-clip", "background-origin"] },
  { group: "Border", props: ["border", "border-top", "border-right", "border-bottom", "border-left", "border-width", "border-style", "border-color", "border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius", "outline", "outline-width", "outline-style", "outline-color", "outline-offset"] },
  { group: "Effects", props: ["opacity", "box-shadow", "text-shadow", "filter", "backdrop-filter", "mix-blend-mode", "transform", "transform-origin", "transition", "animation", "cursor", "pointer-events", "user-select"] },
  { group: "Content", props: ["content", "counter-increment", "counter-reset", "quotes", "list-style", "list-style-type", "list-style-position", "list-style-image", "vertical-align", "table-layout", "border-collapse", "border-spacing", "caption-side", "empty-cells"] },
];

export const PROP_ORDER = new Map<string, number>();
PROP_GROUPS.forEach(({ props }, gi) => props.forEach((p, pi) => PROP_ORDER.set(p, gi * 1000 + pi)));

// ── Color conversion helpers ──────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function convertColor(val: string, fmt: ColorFormat): string {
  if (fmt === "none") return val;
  // hex → rgb / hsl
  const hexMatch = val.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/gi);
  if (hexMatch) {
    return val.replace(/#([0-9a-f]{3}|[0-9a-f]{6})\b/gi, (hex) => {
      let full = hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;
      const rgb = hexToRgb(full);
      if (!rgb) return hex;
      if (fmt === "rgb") return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      if (fmt === "hsl") { const [h, s, l] = rgbToHsl(...rgb); return `hsl(${h}, ${s}%, ${l}%)`; }
      return hex;
    });
  }
  // rgb → hex / hsl
  if (fmt === "hex" || fmt === "hsl") {
    return val.replace(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi, (_, r, g, b) => {
      const ri = parseInt(r), gi2 = parseInt(g), bi = parseInt(b);
      if (fmt === "hex") return `#${ri.toString(16).padStart(2, "0")}${gi2.toString(16).padStart(2, "0")}${bi.toString(16).padStart(2, "0")}`;
      const [h, s, l] = rgbToHsl(ri, gi2, bi);
      return `hsl(${h}, ${s}%, ${l}%)`;
    });
  }
  return val;
}

// ── CSS tokenizer / formatter ─────────────────────────────────────

export interface CSSDecl { prop: string; value: string; important: boolean; vendor: string }
export interface CSSRule { selector: string; declarations: CSSDecl[]; isAtRule: boolean; atBlock?: string }

export function parseDeclarations(block: string): CSSDecl[] {
  const decls: CSSDecl[] = [];
  const lines = block.split(";").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = line.slice(0, colonIdx).trim();
    const raw = line.slice(colonIdx + 1).trim();
    const important = raw.endsWith("!important");
    const value = raw.replace(/\s*!important$/, "").trim();
    const vendorMatch = prop.match(/^(-webkit-|-moz-|-ms-|-o-)/);
    decls.push({ prop, value, important, vendor: vendorMatch ? vendorMatch[1] : "" });
  }
  return decls;
}

export function sortDeclarations(decls: CSSDecl[], sort: PropSort): CSSDecl[] {
  if (sort === "none") return decls;
  if (sort === "alpha") return [...decls].sort((a, b) => a.prop.localeCompare(b.prop));
  if (sort === "grouped") {
    return [...decls].sort((a, b) => {
      const oa = PROP_ORDER.get(a.prop.replace(/^-(?:webkit|moz|ms|o)-/, "")) ?? 99999;
      const ob = PROP_ORDER.get(b.prop.replace(/^-(?:webkit|moz|ms|o)-/, "")) ?? 99999;
      if (oa !== ob) return oa - ob;
      return a.prop.localeCompare(b.prop);
    });
  }
  return decls;
}

export function detectIssues(css: string): CSSIssue[] {
  const issues: CSSIssue[] = [];
  // Missing semicolons
  const missingSemi = css.match(/[^;{}]\s*\}/g);
  if (missingSemi) issues.push({ type: "warning", message: `${missingSemi.length} declaration(s) may be missing semicolons` });
  // Vendor prefixes without standard
  const vendors = ["-webkit-", "-moz-", "-ms-", "-o-"];
  vendors.forEach((v) => {
    const re = new RegExp(`${v}([a-z-]+)`, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(css)) !== null) {
      const std = m[1];
      if (!css.includes(`\n${std}:`) && !css.includes(` ${std}:`)) {
        issues.push({ type: "warning", message: `Vendor prefix "${v}${std}" missing standard property "${std}"` });
      }
    }
  });
  // Duplicate properties (simple check)
  const ruleBlocks = css.match(/\{[^}]+\}/g) ?? [];
  ruleBlocks.forEach((block) => {
    const props = (block.match(/^\s*([\w-]+)\s*:/gm) ?? []).map((p) => p.trim().replace(":", ""));
    const seen = new Set<string>();
    props.forEach((p) => {
      if (seen.has(p)) issues.push({ type: "warning", message: `Duplicate property "${p}"` });
      seen.add(p);
    });
  });
  // Invalid hex colors
  const badHex = css.match(/#[0-9a-fA-F]{1,2}\b|#[0-9a-fA-F]{5}\b|#[0-9a-fA-F]{7,}\b/g);
  if (badHex) issues.push({ type: "error", message: `Invalid hex color(s): ${[...new Set(badHex)].slice(0, 3).join(", ")}` });
  return [...new Map(issues.map((i) => [i.message, i])).values()].slice(0, 10);
}

export function formatCSS(css: string, opts: FormatOptions): string {
  const ind = opts.indentChar === "tabs" ? "\t" : " ".repeat(opts.indentSize);
  const colon = opts.spaceAfterColon ? ": " : ":";
  const lines: string[] = [];

  // Strip comments if needed
  let src = opts.removeComments ? css.replace(/\/\*[\s\S]*?\*\//g, "") : css;
  src = src.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Tokenize: split on { and }
  let i = 0;
  const n = src.length;

  const readUntil = (stopChars: string): string => {
    let out = "";
    while (i < n && !stopChars.includes(src[i])) out += src[i++];
    return out;
  };

  const parseBlock = (depth: number): void => {
    const prefix = ind.repeat(depth);

    while (i < n) {
      const chunk = readUntil("{}/").trim();

      if (i >= n) {
        if (chunk) lines.push(`${prefix}${chunk.replace(/\s+/g, " ")};`);
        break;
      }

      const ch = src[i];

      if (ch === "{") {
        i++;
        const selector = chunk.replace(/\s+/g, " ").trim();
        if (!selector) { parseBlock(depth); continue; }

        const isAtKeyframe = /^@keyframes|^@-/i.test(selector);

        if (opts.bracketStyle === "same-line") {
          lines.push(`${prefix}${selector} {`);
        } else {
          lines.push(`${prefix}${selector}`);
          lines.push(`${prefix}{`);
        }

        // Read declarations until }
        const blockStart = i;
        const blockLines: string[] = [];
        let declBuf = "";

        while (i < n && src[i] !== "}") {
          if (src[i] === "{") {
            // Nested block (e.g. @media inside @supports, or keyframe block)
            const nestedSel = declBuf.trim().replace(/\s+/g, " ");
            declBuf = "";
            if (nestedSel) {
              if (opts.bracketStyle === "same-line") {
                blockLines.push(`${prefix}${ind}${nestedSel} {`);
              } else {
                blockLines.push(`${prefix}${ind}${nestedSel}`);
                blockLines.push(`${prefix}${ind}{`);
              }
              i++;
              const inner: string[] = [];
              while (i < n && src[i] !== "}") {
                inner.push(src[i++]);
              }
              const innerDecls = parseDeclarations(inner.join(""));
              const sorted = sortDeclarations(innerDecls, isAtKeyframe ? "none" : opts.propSort);
              sorted.forEach(({ prop, value, important }) => {
                let v = convertColor(value, opts.colorFormat);
                const semi = opts.addSemicolons ? ";" : ";";
                blockLines.push(`${prefix}${ind}${ind}${prop}${colon}${v}${important ? " !important" : ""}${semi}`);
              });
              blockLines.push(`${prefix}${ind}}`);
              if (i < n) i++; // consume }
            }
          } else {
            declBuf += src[i++];
          }
        }

        // Parse remaining declBuf as declarations
        if (declBuf.trim()) {
          const decls = parseDeclarations(declBuf);
          const sorted = sortDeclarations(decls, isAtKeyframe ? "none" : opts.propSort);

          if (opts.singleLineRules && sorted.length === 1 && blockLines.length === 0) {
            // Collapse to single line
            const { prop, value, important } = sorted[0];
            const v = convertColor(value, opts.colorFormat);
            const lastLine = lines.pop()!;
            const openBrace = lastLine.endsWith("{") ? "" : " {";
            lines.push(`${lastLine}${openBrace} ${prop}${colon}${v}${important ? " !important" : ""}; }`);
          } else {
            lines.push(...blockLines);
            sorted.forEach(({ prop, value, important }) => {
              const v = convertColor(value, opts.colorFormat);
              lines.push(`${prefix}${ind}${prop}${colon}${v}${important ? " !important" : ""};`);
            });
          }
        } else if (blockLines.length > 0) {
          lines.push(...blockLines);
        }

        if (i < n && src[i] === "}") i++;
        if (!opts.singleLineRules || (lines[lines.length - 1] ?? "").endsWith("}") === false) {
          lines.push(`${prefix}}`);
        }
        lines.push(""); // blank line between rules

      } else if (ch === "}") {
        i++;
        if (chunk) lines.push(`${prefix}${chunk.replace(/\s+/g, " ")};`);
        return;
      } else if (ch === "/") {
        // Comment passthrough
        if (src[i + 1] === "*") {
          const end = src.indexOf("*/", i);
          if (end === -1) break;
          if (!opts.removeComments) lines.push(`${prefix}${src.slice(i, end + 2)}`);
          i = end + 2;
        } else {
          i++;
        }
      }
    }
  };

  parseBlock(0);

  // Clean up: remove trailing blank lines & extra consecutive blanks
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function minifyCSS(css: string, removeComments = true): string {
  let out = css;
  if (removeComments) out = out.replace(/\/\*[\s\S]*?\*\//g, "");
  out = out.replace(/\s+/g, " ");
  out = out.replace(/\s*{\s*/g, "{");
  out = out.replace(/\s*}\s*/g, "}");
  out = out.replace(/\s*:\s*/g, ":");
  out = out.replace(/\s*;\s*/g, ";");
  out = out.replace(/\s*,\s*/g, ",");
  out = out.replace(/;}/g, "}");
  return out.trim();
}

export function countStats(css: string) {
  return {
    rules: (css.match(/\{[^}]*\}/g) ?? []).length,
    decls: (css.match(/[\w-]+\s*:[^;{}]+;/g) ?? []).length,
    selectors: (css.match(/[^{}]+(?=\{)/g) ?? []).length,
    comments: (css.match(/\/\*[\s\S]*?\*\//g) ?? []).length,
    lines: css ? css.split("\n").length : 0,
    sizeKb: Math.round(new Blob([css]).size / 1024 * 10) / 10,
  };
}

// ── Syntax highlight (token-aware) ───────────────────────────────
// We tokenize the CSS into: comment | at-keyword | selector | property | value | brace | punct | other
// This prevents regex from matching inside selectors / class names.

export type HLToken =
  | { t: "comment"; v: string }
  | { t: "at"; v: string }
  | { t: "selector"; v: string }
  | { t: "prop"; v: string }
  | { t: "colon"; v: string }
  | { t: "value"; v: string }
  | { t: "semi"; v: string }
  | { t: "brace"; v: string }
  | { t: "other"; v: string };

export function tokenizeCSS(css: string): HLToken[] {
  const tokens: HLToken[] = [];
  let i = 0;
  const n = css.length;

  // Context: "selector" | "decl" (inside a rule block)
  const stack: ("selector" | "decl")[] = [];
  let ctx: "selector" | "decl" = "selector";

  while (i < n) {
    // Comment
    if (css[i] === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      const v = end === -1 ? css.slice(i) : css.slice(i, end + 2);
      tokens.push({ t: "comment", v });
      i = end === -1 ? n : end + 2;
      continue;
    }

    // Opening brace
    if (css[i] === "{") {
      tokens.push({ t: "brace", v: "{" });
      stack.push(ctx);
      ctx = "decl";
      i++;
      continue;
    }

    // Closing brace
    if (css[i] === "}") {
      tokens.push({ t: "brace", v: "}" });
      ctx = stack.pop() ?? "selector";
      i++;
      continue;
    }

    // Semicolon
    if (css[i] === ";") {
      tokens.push({ t: "semi", v: ";" });
      i++;
      continue;
    }

    if (ctx === "selector") {
      // At-rule keyword (e.g. @media, @keyframes)
      if (css[i] === "@") {
        let j = i + 1;
        while (j < n && /[\w-]/.test(css[j])) j++;
        tokens.push({ t: "at", v: css.slice(i, j) });
        i = j;
        continue;
      }
      // Everything else until { or ; is selector text
      let j = i;
      while (j < n && css[j] !== "{" && css[j] !== "}" && !(css[j] === "/" && css[j + 1] === "*")) j++;
      if (j > i) {
        tokens.push({ t: "selector", v: css.slice(i, j) });
        i = j;
      }
    } else {
      // Inside declaration block: read property : value ;
      // Skip whitespace silently (emit as other)
      if (/\s/.test(css[i])) {
        let j = i;
        while (j < n && /\s/.test(css[j])) j++;
        tokens.push({ t: "other", v: css.slice(i, j) });
        i = j;
        continue;
      }
      // Read property name (up to : or { or })
      let j = i;
      while (j < n && css[j] !== ":" && css[j] !== ";" && css[j] !== "{" && css[j] !== "}" && !(css[j] === "/" && css[j + 1] === "*")) j++;
      if (j > i) {
        const propText = css.slice(i, j);
        tokens.push({ t: "prop", v: propText });
        i = j;
      }
      // Colon
      if (i < n && css[i] === ":") {
        tokens.push({ t: "colon", v: ":" });
        i++;
        // Read value until ; or { or }
        let k = i;
        while (k < n && css[k] !== ";" && css[k] !== "{" && css[k] !== "}" && !(css[k] === "/" && css[k + 1] === "*")) k++;
        if (k > i) {
          tokens.push({ t: "value", v: css.slice(i, k) });
          i = k;
        }
      }
    }
  }
  return tokens;
}

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Highlight only inside a CSS value string.
// We collect replacement ranges (start, end, html), de-overlap them,
// then apply in reverse so indices stay stable.
export function highlightValue(v: string): string {
  const raw = v;
  const reps: { s: number; e: number; html: string }[] = [];
  const add = (s: number, e: number, html: string) => reps.push({ s, e, html });

  let m: RegExpExecArray | null;

  // 1. Quoted strings first so later passes skip inside them
  const strRe = /('[^']*'|"[^"]*")/g;
  while ((m = strRe.exec(raw)) !== null)
    add(m.index, m.index + m[0].length, `<span style="color:#6ee7b7">${esc(m[0])}</span>`);

  // 2. Hex colors  #rgb #rrggbb  — must not be preceded by a word/hash char
  const hexRe = /(?<![\w#])(#[0-9a-fA-F]{3,8})(?![0-9a-fA-F\w])/g;
  while ((m = hexRe.exec(raw)) !== null)
    add(m.index, m.index + m[0].length, `<span style="color:#f97316">${esc(m[0])}</span>`);

  // 3. CSS functions: rgb( hsl( var( calc( url( etc.
  const fnRe = /\b([\w-]+)(?=\()/g;
  while ((m = fnRe.exec(raw)) !== null)
    add(m.index, m.index + m[0].length, `<span style="color:#a78bfa">${esc(m[0])}</span>`);

  // 4. Numbers WITH a known CSS unit immediately after  e.g. 1rem 10px 50%
  const unitRe = /(?<![\w#-])(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|fr|s|ms|deg|rad|turn|grad)(?![\w-])/g;
  while ((m = unitRe.exec(raw)) !== null)
    add(m.index, m.index + m[0].length,
      `<span style="color:#fbbf24">${esc(m[1])}</span><span style="color:#34d399">${esc(m[2])}</span>`);

  // 5. Bare numbers with NO unit — only when truly standalone
  //    Negative lookbehind: not after # or word char
  //    Negative lookahead:  not followed by letter/% (would be part of unit or word)
  const numRe = /(?<![#\w])(\d+(?:\.\d+)?)(?![a-zA-Z%\w])/g;
  while ((m = numRe.exec(raw)) !== null)
    add(m.index, m.index + m[0].length, `<span style="color:#fbbf24">${esc(m[0])}</span>`);

  // 6. CSS value keywords
  const kwRe = /\b(important|inherit|initial|unset|revert|auto|none|normal|bold|italic|transparent|solid|dashed|dotted|absolute|relative|fixed|sticky|flex|grid|block|inline|hidden|visible|center|nowrap|wrap|column|row|stretch|baseline|middle)\b/g;
  while ((m = kwRe.exec(raw)) !== null)
    add(m.index, m.index + m[0].length, `<span style="color:#c084fc">${esc(m[0])}</span>`);

  // De-overlap: sort by start, skip any that overlap with a previous accepted range
  reps.sort((a, b) => a.s - b.s || b.e - a.e);
  const kept: typeof reps = [];
  let cursor = 0;
  for (const r of reps) {
    if (r.s < cursor) continue;
    kept.push(r);
    cursor = r.e;
  }

  // Apply replacements in reverse so indices stay valid
  let result = raw;
  for (let k = kept.length - 1; k >= 0; k--) {
    const { s, e, html } = kept[k];
    result = result.slice(0, s) + html + result.slice(e);
  }

  // Escape any plain text fragments between the injected spans
  return result
    .split(/(<span[^>]*>[\s\S]*?<\/span>)/g)
    .map((part, idx) => (idx % 2 === 0 ? esc(part) : part))
    .join("");
}

export function renderTokens(tokens: HLToken[]): string {
  return tokens.map(({ t, v }) => {
    switch (t) {
      case "comment": return `<span style="color:#6b7280;font-style:italic">${esc(v)}</span>`;
      case "at": return `<span style="color:#a78bfa;font-weight:600">${esc(v)}</span>`;
      case "selector": return `<span style="color:#60a5fa;font-weight:600">${esc(v)}</span>`;
      case "prop": return `<span style="color:#34d399">${esc(v)}</span>`;
      case "colon": return `<span style="color:#9ca3af">${esc(v)}</span>`;
      case "value": return highlightValue(v);
      case "semi": return `<span style="color:#9ca3af">${esc(v)}</span>`;
      case "brace": return `<span style="color:#9ca3af;font-weight:700">${esc(v)}</span>`;
      default: return esc(v);
    }
  }).join("");
}

// ── Examples ──────────────────────────────────────────────────────

export const EXAMPLES = [
  {
    label: "Basic Styles",
    value: `body{margin:0;padding:0;font-family:sans-serif;background:#fff;color:#333;}h1{font-size:2rem;font-weight:700;color:#1a1a2e;margin-bottom:1rem;}p{line-height:1.6;color:#555;}a{color:#007bff;text-decoration:none;}a:hover{text-decoration:underline;}`,
  },
  {
    label: "Flexbox Layout",
    value: `.container{display:flex;flex-direction:row;justify-content:space-between;align-items:center;gap:1rem;padding:1rem 2rem;max-width:1200px;margin:0 auto;}.card{display:flex;flex-direction:column;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);padding:1.5rem;flex:1;}.card h2{font-size:1.25rem;margin-bottom:.5rem;}.card p{color:#666;font-size:.875rem;}`,
  },
  {
    label: "Animations",
    value: `@keyframes fadeIn{from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);}}.modal{animation:fadeIn .3s ease forwards;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:12px;padding:2rem;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:1000;}.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);}`,
  },
  {
    label: "Dark Theme",
    value: `:root{--bg:#0a0a0f;--surface:#16161e;--border:#2a2a3a;--text:#e8e8f0;--accent:#7c3aed;--accent-hover:#6d28d9;}body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;}button{background:var(--accent);color:#fff;border:none;padding:.5rem 1rem;border-radius:6px;cursor:pointer;transition:background .2s;}button:hover{background:var(--accent-hover);}`,
  },
];