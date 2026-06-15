import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import PercentageCalculatorTool from "@/sections/math-tools/PercentageCalculatorTool";

export default function PercentageCalculatorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <PercentageCalculatorTool />
      <CTA />
      <Footer />
    </>
  );
}
