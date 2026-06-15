import { Language } from "@/lib/i18n";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import LoremIpsumTool from "@/sections/text-tools/LoremIpsumTool";

export default function LoremIpsumView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <LoremIpsumTool />
      <CTA />
      <Footer />
    </>
  );
}