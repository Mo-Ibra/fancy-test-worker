import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import WordFrequencyCounter from "@/sections/seo-tools/WordFrequencyCounter";

export default function WordFrequencyCounterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <WordFrequencyCounter />
      <CTA />
      <Footer />
    </>
  );
}
