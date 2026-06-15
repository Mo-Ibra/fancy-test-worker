
// ── Types ─────────────────────────────────────────────────────────

export type Mode = "encode" | "decode";
export type EncodeMode = "component" | "full" | "form";

// ── Encode / Decode logic ─────────────────────────────────────────

export function encodeURL(input: string, mode: EncodeMode): { result: string; error: string } {
  if (!input.trim()) return { result: "", error: "" };
  try {
    let result: string;
    if (mode === "component") result = encodeURIComponent(input);
    else if (mode === "form") result = input.replace(/[^A-Za-z0-9\-_.!~*'()]/g, (c) => {
      if (c === " ") return "+";
      return encodeURIComponent(c);
    });
    else result = encodeURI(input);
    return { result, error: "" };
  } catch (e: any) {
    return { result: "", error: e.message };
  }
}

export function decodeURL(input: string): { result: string; error: string } {
  if (!input.trim()) return { result: "", error: "" };
  try {
    // Try decodeURIComponent first, fall back to decodeURI
    const cleaned = input.replace(/\+/g, " ");
    let result: string;
    try {
      result = decodeURIComponent(cleaned);
    } catch {
      result = decodeURI(cleaned);
    }
    return { result, error: "" };
  } catch (e: any) {
    return { result: "", error: `Invalid encoded string: ${e.message}` };
  }
}

// ── Parse a URL into its components ──────────────────────────────

export interface URLParts {
  protocol: string;
  host: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: { key: string; value: string; encodedKey: string; encodedValue: string }[];
}

export function parseURLParts(raw: string): URLParts | null {
  try {
    // Try to parse — prefix with https:// if no protocol
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const params: URLParts["params"] = [];
    url.searchParams.forEach((value, key) => {
      params.push({
        key,
        value,
        encodedKey: encodeURIComponent(key),
        encodedValue: encodeURIComponent(value),
      });
    });
    return {
      protocol: url.protocol,
      host: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params,
    };
  } catch {
    return null;
  }
}

// ── Percent encoding table ────────────────────────────────────────

export const ENCODING_TABLE: { char: string; encoded: string; description: string; category: string }[] = [
  { char: " ", encoded: "%20", description: "Space", category: "Common" },
  { char: "!", encoded: "%21", description: "Exclamation mark", category: "Common" },
  { char: '"', encoded: "%22", description: "Double quote", category: "Common" },
  { char: "#", encoded: "%23", description: "Hash / Fragment", category: "Common" },
  { char: "$", encoded: "%24", description: "Dollar sign", category: "Common" },
  { char: "%", encoded: "%25", description: "Percent sign", category: "Common" },
  { char: "&", encoded: "%26", description: "Ampersand", category: "Common" },
  { char: "'", encoded: "%27", description: "Single quote", category: "Common" },
  { char: "(", encoded: "%28", description: "Open parenthesis", category: "Common" },
  { char: ")", encoded: "%29", description: "Close parenthesis", category: "Common" },
  { char: "*", encoded: "%2A", description: "Asterisk", category: "Common" },
  { char: "+", encoded: "%2B", description: "Plus sign", category: "Common" },
  { char: ",", encoded: "%2C", description: "Comma", category: "Common" },
  { char: "/", encoded: "%2F", description: "Forward slash", category: "Common" },
  { char: ":", encoded: "%3A", description: "Colon", category: "Common" },
  { char: ";", encoded: "%3B", description: "Semicolon", category: "Common" },
  { char: "=", encoded: "%3D", description: "Equals sign", category: "Common" },
  { char: "?", encoded: "%3F", description: "Question mark", category: "Common" },
  { char: "@", encoded: "%40", description: "At sign", category: "Common" },
  { char: "[", encoded: "%5B", description: "Open bracket", category: "Common" },
  { char: "\\", encoded: "%5C", description: "Backslash", category: "Common" },
  { char: "]", encoded: "%5D", description: "Close bracket", category: "Common" },
  { char: "^", encoded: "%5E", description: "Caret", category: "Common" },
  { char: "`", encoded: "%60", description: "Backtick", category: "Common" },
  { char: "{", encoded: "%7B", description: "Open curly brace", category: "Common" },
  { char: "|", encoded: "%7C", description: "Pipe", category: "Common" },
  { char: "}", encoded: "%7D", description: "Close curly brace", category: "Common" },
  { char: "~", encoded: "%7E", description: "Tilde", category: "Common" },
  { char: "é", encoded: "%C3%A9", description: "e with acute (UTF-8)", category: "Unicode" },
  { char: "ñ", encoded: "%C3%B1", description: "n with tilde (UTF-8)", category: "Unicode" },
  { char: "ü", encoded: "%C3%BC", description: "u with umlaut (UTF-8)", category: "Unicode" },
  { char: "中", encoded: "%E4%B8%AD", description: "CJK character (UTF-8)", category: "Unicode" },
  { char: "→", encoded: "%E2%86%92", description: "Right arrow (UTF-8)", category: "Unicode" },
];

// ── Examples ──────────────────────────────────────────────────────

export const EXAMPLES = {
  encode: [
    { label: "URL with spaces", value: "https://example.com/search?q=hello world&lang=en" },
    { label: "Special characters", value: "price=100$ & discount=20% (limited!)" },
    { label: "Arabic text", value: "مرحبا بالعالم" },
    { label: "Email as param", value: "user@example.com" },
    { label: "JSON string", value: '{"name":"أحمد","age":25}' },
    { label: "Path with slashes", value: "/api/v1/users/أحمد/profile" },
  ],
  decode: [
    { label: "Encoded URL", value: "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world" },
    { label: "Form data", value: "name=John+Doe&email=john%40example.com&city=New+York" },
    { label: "Encoded Arabic", value: "%D9%85%D8%B1%D8%AD%D8%A8%D8%A7+%D8%A8%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85" },
    { label: "Mixed encoding", value: "Hello%20World%21%20Price%3A%2050%25%20off" },
  ],
};

export const ENCODE_MODES: { key: EncodeMode; label: string; desc: string; example: string }[] = [
  {
    key: "component",
    label: "encodeURIComponent",
    desc: "Encodes everything except A–Z a–z 0–9 - _ . ! ~ * ' ( )",
    example: "Use for query params, path segments, form values",
  },
  {
    key: "full",
    label: "encodeURI",
    desc: "Encodes everything except URI-safe chars and : / ? # [ ] @ ! $ & ' ( ) * + , ; =",
    example: "Use for a complete URL — preserves URL structure",
  },
  {
    key: "form",
    label: "application/x-www-form-urlencoded",
    desc: "Like encodeURIComponent but spaces become + instead of %20",
    example: "Use for HTML form submissions",
  },
];