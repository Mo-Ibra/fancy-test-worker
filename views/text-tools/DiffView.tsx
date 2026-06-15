import Navigation from "@/components/Navigation";
import TextDiffTool from "@/sections/text-tools/TextDiffTool";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import { Language } from "@/lib/i18n";

export default function DiffView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <TextDiffTool />
      <CTA />
      <Footer />
    </>
  );
}