import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import CSSFormatterTool from "@/sections/dev-tools/CSSFormatterTool";

export default function CSSFormatterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <CSSFormatterTool />
      <CTA />
      <Footer />
    </>
  );
}
