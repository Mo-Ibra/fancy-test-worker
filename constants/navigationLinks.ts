import {
  AlignLeft,
  Binary,
  Calculator,
  CaseSensitive,
  Code2,
  Crop,
  FileJson,
  FileOutput,
  FilePlus2,
  FileText,
  Hash,
  Image,
  ImagePlus,
  KeyRound,
  Lock,
  Minimize2,
  Palette,
  Percent,
  Ruler,
  Scissors,
  ShieldCheck,
  Terminal,
  Type,
  Shield,
  Zap
} from "lucide-react";

// ── Mega Menu Data ──────────────────────────────────────────────
export const toolCategories = [
  {
    title: "toolsList.textTitle",
    icon: Type,
    color: "text-blue-500",
    bg: "bg-blue-50",
    href: "/text-tools",
    tools: [
      { label: "toolsList.text.wordCounter.label", icon: Hash, href: "/text-tools/word-counter" },
      { label: "toolsList.text.caseConverter.label", icon: CaseSensitive, href: "/text-tools/case-converter" },
      { label: "toolsList.text.loremIpsum.label", icon: AlignLeft, href: "/text-tools/lorem-ipsum" },
      { label: "toolsList.text.diff.label", icon: Scissors, href: "/text-tools/diff" },
    ],
    allToolsText: "toolsList.text.all"
  },
  {
    title: "toolsList.devTitle",
    icon: Code2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    href: "/dev-tools",
    tools: [
      { label: "toolsList.dev.jsonFormatter.label", icon: FileJson, href: "/dev-tools/json-formatter" },
      { label: "toolsList.dev.base64.label", icon: Binary, href: "/dev-tools/base64-encoder" },
      { label: "toolsList.dev.regex.label", icon: Terminal, href: "/dev-tools/regex-tester" },
      { label: "toolsList.dev.uuid.label", icon: Hash, href: "/dev-tools/uuid-generator" },
    ],
    allToolsText: "toolsList.dev.all"
  },
  {
    title: "toolsList.imageTitle",
    icon: Image,
    color: "text-violet-500",
    bg: "bg-violet-50",
    href: "/image-tools",
    tools: [
      { label: "toolsList.image.resizer.label", icon: Crop, href: "/image-tools/resizer" },
      { label: "toolsList.image.compressor.label", icon: Minimize2, href: "/image-tools/compressor" },
      { label: "toolsList.image.converter.label", icon: ImagePlus, href: "/image-tools/format-converter" },
      { label: "toolsList.image.colorPicker.label", icon: Palette, href: "/image-tools/color-picker" },
    ],
    allToolsText: "toolsList.image.all"
  },
  {
    title: "toolsList.pdfTitle",
    icon: FileText,
    color: "text-rose-500",
    bg: "bg-rose-50",
    href: "/pdf-tools",
    tools: [
      { label: "toolsList.pdf.merger.label", icon: FilePlus2, href: "/pdf-tools/merger" },
      { label: "toolsList.pdf.splitter.label", icon: Scissors, href: "/pdf-tools/splitter" },
      { label: "toolsList.pdf.compressor.label", icon: Minimize2, href: "/pdf-tools/compressor" },
      { label: "toolsList.pdf.toWord.label", icon: FileOutput, href: "/pdf-tools/pdf-to-word" },
    ],
    allToolsText: "toolsList.pdf.all"
  },
  // {
  //   title: "toolsList.seoTitle",
  //   icon: Type,
  //   color: "text-blue-500",
  //   bg: "bg-blue-50",
  //   href: "/seo-tools",
  //   tools: [
  //     { label: "toolsList.seo.metaGenerator.label", icon: Hash, href: "/seo-tools/meta-generator" },
  //     { label: "toolsList.seo.slug.label", icon: Scissors, href: "/seo-tools/slug-generator" },
  //     { label: "toolsList.seo.keywordDensity.label", icon: AlignLeft, href: "/seo-tools/keyword-density-checker" },
  //     { label: "toolsList.seo.robotsTxt.label", icon: FileText, href: "/seo-tools/robots-txt-generator" },
  //   ],
  //   allToolsText: "toolsList.seo.all"
  // },
  {
    title: "toolsList.mathTitle",
    icon: Calculator,
    color: "text-amber-500",
    bg: "bg-amber-50",
    href: "/math-tools",
    tools: [
      { label: "toolsList.math.unitConverter.label", icon: Ruler, href: "/math-tools/unit-converter" },
      { label: "toolsList.math.percentage.label", icon: Percent, href: "/math-tools/percentage-calculator" },
      { label: "toolsList.math.numberBase.label", icon: Binary, href: "/math-tools/number-base-converter" },
      { label: "toolsList.math.scientific.label", icon: Calculator, href: "/math-tools/scientific-calculator" },
    ],
    allToolsText: "toolsList.math.all"
  },
  {
    title: "toolsList.securityTitle",
    icon: Shield,
    color: "text-slate-500",
    bg: "bg-slate-100",
    href: "/security-tools",
    tools: [
      { label: "toolsList.security.passwordGenerator.label", icon: KeyRound, href: "/security-tools/password-generator" },
      { label: "toolsList.security.md5.label", icon: ShieldCheck, href: "/security-tools/md5-hash-generator" },
      { label: "toolsList.security.bcrypt.label", icon: Zap, href: "/security-tools/bcrypt" },
      { label: "toolsList.security.passwordStrength.label", icon: Lock, href: "/security-tools/password-strength-checker" },
    ],
    allToolsText: "toolsList.security.all"
  },
];

export const featuredTool = {
  label: "featured.mostPopular",
  title: "featured.pdfCompressor.label",
  description: "featured.pdfCompressor.description",
  href: "/pdf-tools/compressor",
  badge: "featured.pdfCompressor.badge",
};