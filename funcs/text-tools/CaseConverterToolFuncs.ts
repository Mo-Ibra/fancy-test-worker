export const conversions = {
  uppercase: (t: string) => t.toUpperCase(),
  lowercase: (t: string) => t.toLowerCase(),
  titleCase: (t: string) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  sentenceCase: (t: string) =>
    t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  camelCase: (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  pascalCase: (t: string) =>
    t
      .toLowerCase()
      .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase()),
  snakeCase: (t: string) =>
    t.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
  kebabCase: (t: string) =>
    t.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  constantCase: (t: string) =>
    t.trim().toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, ""),
  invertCase: (t: string) =>
    t
      .split("")
      .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
      .join(""),
  alternatingCase: (t: string) =>
    t
      .split("")
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join(""),
  dotCase: (t: string) =>
    t.trim().toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, ""),
} as const;

export type CaseType = keyof typeof conversions;

export const caseOptions: { key: CaseType; example: string; group: string }[] = [
  // Standard
  { key: "uppercase", example: "HELLO WORLD", group: "Standard" },
  { key: "lowercase", example: "hello world", group: "Standard" },
  { key: "titleCase", example: "Hello World", group: "Standard" },
  { key: "sentenceCase", example: "Hello world.", group: "Standard" },
  { key: "invertCase", example: "hELLO wORLD", group: "Standard" },
  { key: "alternatingCase", example: "hElLo wOrLd", group: "Standard" },

  // Developer
  { key: "camelCase", example: "helloWorld", group: "Developer" },
  { key: "pascalCase", example: "HelloWorld", group: "Developer" },
  { key: "snakeCase", example: "hello_world", group: "Developer" },
  { key: "kebabCase", example: "hello-world", group: "Developer" },
  { key: "constantCase", example: "HELLO_WORLD", group: "Developer" },
  { key: "dotCase", example: "hello.world", group: "Developer" },
];