import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import URLSlugGeneratorTool from "@/sections/seo-tools/URLSlugGeneratorTool";

export default function URLSlugGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <URLSlugGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
