import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import HreflangGeneratorTool from "@/sections/seo-tools/HreflangGeneratorTool";

export default function HreflangGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <HreflangGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
