import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import CaseConverterTool from "@/sections/text-tools/CaseConverterTool";
import { Language } from "@/lib/i18n";

export default function CaseConverterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <CaseConverterTool />
      <CTA />
      <Footer />
    </>
  );
}