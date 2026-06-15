import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ReadabilityCheckerTool from "@/sections/seo-tools/ReadabilityCheckerTool";

export default function ReadabilityCheckerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ReadabilityCheckerTool />
      <CTA />
      <Footer />
    </>
  );
}
