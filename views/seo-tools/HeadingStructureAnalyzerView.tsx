import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import HeadingStructureAnalyzerTool from "@/sections/seo-tools/HeadingStructureAnalyzerTool";

export default function HeadingStructureAnalyzerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <HeadingStructureAnalyzerTool />
      <CTA />
      <Footer />
    </>
  );
}
