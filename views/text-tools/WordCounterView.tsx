import { Language } from "@/lib/i18n";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import WordCounterTool from "@/sections/text-tools/WordCounterTool";

export default function WordCounterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <WordCounterTool />
      <CTA />
      <Footer />
    </>
  );
}