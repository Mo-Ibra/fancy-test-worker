// ── Lorem source corpus ───────────────────────────────────────────

import { AlignLeft, Type } from "lucide-react";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "curabitur", "pretium", "tincidunt", "lacus", "nunc", "purus", "augue", "luctus", "tincidunt", "nulla", "eros", "eleifend", "mi", "libero", "feugiat", "lobortis", "risus", "donec", "aliquet", "erat", "convallis", "porta", "quam", "suspendisse", "potenti", "viverra", "maecenas", "accumsan", "lacus", "vel", "facilisis", "volutpat", "blandit", "aliquam", "etiam", "erat", "velit", "scelerisque", "purus", "semper", "eget", "duis", "faucibus", "ornare", "suspendisse", "sed", "nisi", "lacus", "rhoncus", "urna", "neque", "viverra", "justo", "nec", "ultrices", "dui", "sapien", "eget", "mi", "proin", "sed", "libero", "enim", "sed", "faucibus", "turpis", "in", "eu", "mi", "bibendum", "neque", "egestas",
];

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function generateSentence(rand: () => number): string {
  const len = 8 + Math.floor(rand() * 12);
  const words = Array.from({ length: len }, () => WORDS[Math.floor(rand() * WORDS.length)]);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(rand: () => number): string {
  const sentences = 4 + Math.floor(rand() * 4);
  return Array.from({ length: sentences }, () => generateSentence(rand)).join(" ");
}

export function generate(type: GenType, count: number, startLorem: boolean, seed: number): string {
  const rand = rng(seed);
  if (type === "words") {
    const words = Array.from({ length: count }, () => WORDS[Math.floor(rand() * WORDS.length)]);
    if (startLorem && count >= 2) { words[0] = "Lorem"; words[1] = "ipsum"; }
    return words.join(" ");
  }
  if (type === "sentences") {
    const sentences = Array.from({ length: count }, () => generateSentence(rand));
    if (startLorem) sentences[0] = "Lorem ipsum " + sentences[0].charAt(0).toLowerCase() + sentences[0].slice(1);
    return sentences.join(" ");
  }
  // paragraphs
  const paras = Array.from({ length: count }, () => generateParagraph(rand));
  if (startLorem) paras[0] = "Lorem ipsum " + paras[0].charAt(0).toLowerCase() + paras[0].slice(1);
  return paras.join("\n\n");
}

// ── Types ─────────────────────────────────────────────────────────

export type GenType = "paragraphs" | "sentences" | "words";

export const typeOptions: { key: GenType; icon: React.ElementType }[] = [
  { key: "paragraphs", icon: AlignLeft },
  { key: "sentences", icon: AlignLeft },
  { key: "words", icon: Type },
];

export const presets: { key: string; type: GenType; count: number }[] = [
  { key: "short", type: "paragraphs", count: 1 },
  { key: "medium", type: "paragraphs", count: 3 },
  { key: "long", type: "paragraphs", count: 6 },
  { key: "50words", type: "words", count: 50 },
  { key: "100words", type: "words", count: 100 },
  { key: "10sentences", type: "sentences", count: 10 },
];