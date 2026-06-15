import { Language } from "@/lib/i18n";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import RemoveFormattingTool from "@/sections/text-tools/RemoveFormattingTool";

export default function RemoveFormattingView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <RemoveFormattingTool />
      <CTA />
      <Footer />
    </>
  );
}