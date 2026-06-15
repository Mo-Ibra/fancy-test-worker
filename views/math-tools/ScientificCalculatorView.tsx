import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ScientificCalculatorTool from "@/sections/dev-tools/ScientificCalculatorTool";

export default function ScientificCalculatorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ScientificCalculatorTool />
      <CTA />
      <Footer />
    </>
  );
}
