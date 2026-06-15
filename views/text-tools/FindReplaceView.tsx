import { Language } from "@/lib/i18n";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import FindReplaceTool from "@/sections/text-tools/FindReplaceTool";

export default function FindReplaceView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <FindReplaceTool />
      <CTA />
      <Footer />
    </>
  );
}