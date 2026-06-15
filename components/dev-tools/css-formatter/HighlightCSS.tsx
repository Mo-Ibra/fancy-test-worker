import { renderTokens, tokenizeCSS } from "@/funcs/dev-tools/CSSFormatterToolFuncs";

export default function HighlightCSS({ code }: { code: string }) {
  const highlighted = renderTokens(tokenizeCSS(code));
  return (
    <pre
      className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}