import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import CharacterCounterSEOTool from "@/sections/seo-tools/CharacterCounterSEOTool";

export default function CharacterCounterSEOView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <CharacterCounterSEOTool />
      <CTA />
      <Footer />
    </>
  );
}
