import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import UnitConverterTool from "@/sections/math-tools/UnitConverterTool";

export default function UnitConverterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <UnitConverterTool />
      <CTA />
      <Footer />
    </>
  );
}
