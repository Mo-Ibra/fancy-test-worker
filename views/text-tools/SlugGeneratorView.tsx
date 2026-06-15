import { Language } from "@/lib/i18n";
import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import SlugGeneratorTool from "@/sections/text-tools/SlugGeneratorTool";

export default function SlugGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <SlugGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}