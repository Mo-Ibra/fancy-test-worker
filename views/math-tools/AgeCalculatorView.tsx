import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import AgeCalculatorTool from "@/sections/math-tools/AgeCalculatorTool";

export default function AgeCalculatorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <AgeCalculatorTool />
      <CTA />
      <Footer />
    </>
  );
}
