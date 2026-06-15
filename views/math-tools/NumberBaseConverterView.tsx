import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import NumberBaseConverterTool from "@/sections/math-tools/NumberBaseConverterTool";

export default function NumberBaseConverterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <NumberBaseConverterTool />
      <CTA />
      <Footer />
    </>
  );
}
