import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import AverageCalculatorTool from "@/sections/math-tools/AverageCalculatorTool";

export default function AverageCalculatorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <AverageCalculatorTool />
      <CTA />
      <Footer />
    </>
  );
}
