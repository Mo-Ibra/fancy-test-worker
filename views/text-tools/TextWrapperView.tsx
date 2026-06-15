import { Language } from "@/lib/i18n";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import TextWrapperTool from "@/sections/text-tools/TextWrapperTool";

export default function TextWrapperView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <TextWrapperTool />
      <CTA />
      <Footer />
    </>
  );
}