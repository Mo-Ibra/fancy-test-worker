import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import KeywordDensityCheckerTool from "@/sections/seo-tools/KeywordDensityCheckerTool";

export default function KeywordDensityCheckerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <KeywordDensityCheckerTool />
      <CTA />
      <Footer />
    </>
  );
}
