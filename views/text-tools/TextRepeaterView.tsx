import { Language } from "@/lib/i18n";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import TextRepeaterTool from "@/sections/text-tools/TextRepeaterTool";

export default function TextRepeaterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <TextRepeaterTool />
      <CTA />
      <Footer />
    </>
  );
}