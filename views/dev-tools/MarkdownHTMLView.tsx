import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import MarkdownHTMLTool from "@/sections/dev-tools/MarkdownHTMLTool";

export default function MarkdownHTMLView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <MarkdownHTMLTool />
      <CTA />
      <Footer />
    </>
  );
}
