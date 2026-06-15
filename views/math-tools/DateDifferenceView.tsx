import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import DateDifferenceTool from "@/sections/math-tools/DateDifferenceTool";

export default function DateDifferenceView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <DateDifferenceTool />
      <CTA />
      <Footer />
    </>
  );
}
