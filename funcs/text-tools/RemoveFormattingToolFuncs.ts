function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")           // headings
    .replace(/(\*\*|__)(.*?)\1/g, "$2")   // bold
    .replace(/(\*|_)(.*?)\1/g, "$2")      // italic
    .replace(/~~(.*?)~~/g, "$1")          // strikethrough
    .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, "")) // code
    .replace(/^[-*+]\s+/gm, "")           // unordered list
    .replace(/^\d+\.\s+/gm, "")           // ordered list
    .replace(/^\s*>\s*/gm, "")            // blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // images
    .replace(/^---+$/gm, "")              // horizontal rules
    .replace(/\|/g, " ")                  // table pipes
    .trim();
}

function stripExtraWhitespace(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")             // multiple spaces/tabs → single space
    .replace(/\n{3,}/g, "\n\n")          // 3+ newlines → double newline
    .trim();
}

function stripEmojis(text: string): string {
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
}

function stripUrls(text: string): string {
  return text.replace(/https?:\/\/[^\s]+/g, "").trim();
}

function stripPunctuation(text: string): string {
  return text.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, " ").replace(/\s+/g, " ").trim();
}

function stripNumbers(text: string): string {
  return text.replace(/\d+/g, "").replace(/\s+/g, " ").trim();
}

function stripInvisibleChars(text: string): string {
  // zero-width, non-breaking spaces, BOM, etc.
  return text
    .replace(/[\u200B-\u200D\uFEFF\u00AD\u200E\u200F\u202A-\u202E\u2060-\u2064]/g, "")
    .trim();
}

function collapseLines(text: string): string {
  return text.replace(/\n+/g, " ").trim();
}

interface CleanOption {
  key: string;
  label: string;
  description: string;
  fn: (t: string) => string;
  default: boolean;
  group: string;
}

export const cleanOptions: CleanOption[] = [
  { key: "html", label: "HTML Tags", description: "Remove <b>, <div>, <span> and all other HTML tags.", fn: stripHtmlTags, default: true, group: "Format" },
  { key: "markdown", label: "Markdown", description: "Strip **bold**, # headings, [links](), and other syntax.", fn: stripMarkdown, default: true, group: "Format" },
  { key: "whitespace", label: "Extra Whitespace", description: "Collapse multiple spaces and blank lines.", fn: stripExtraWhitespace, default: true, group: "Format" },
  { key: "invisible", label: "Invisible Chars", description: "Remove zero-width spaces, BOM, and hidden characters.", fn: stripInvisibleChars, default: true, group: "Format" },
  { key: "urls", label: "URLs & Links", description: "Strip all http:// and https:// URLs.", fn: stripUrls, default: false, group: "Content" },
  { key: "emojis", label: "Emojis", description: "Remove all emoji characters from the text.", fn: stripEmojis, default: false, group: "Content" },
  { key: "numbers", label: "Numbers", description: "Delete all numeric digits.", fn: stripNumbers, default: false, group: "Content" },
  { key: "punctuation", label: "Punctuation", description: "Remove commas, periods, brackets, and symbols.", fn: stripPunctuation, default: false, group: "Content" },
  { key: "newlines", label: "Line Breaks", description: "Collapse all newlines into a single line of text.", fn: collapseLines, default: false, group: "Format" },
];

export function applyCleaners(text: string, enabled: Set<string>): string {
  // apply in fixed order to avoid conflicts
  let result = text;
  for (const opt of cleanOptions) {
    if (enabled.has(opt.key)) result = opt.fn(result);
  }
  return result;
}

export const EXAMPLE = `<h1>Welcome to <strong>My Blog</strong></h1>
<p>This is a **sample** post with _mixed_ formatting.</p>

## Some Markdown heading

Here is a [link](https://example.com) and an image:
![alt text](https://example.com/img.png)

- Item one
- Item two

Check out https://example.com for more info!

Invisible chars here:​​ (zero-width spaces above)

😀🎉 Hello World 🚀`;