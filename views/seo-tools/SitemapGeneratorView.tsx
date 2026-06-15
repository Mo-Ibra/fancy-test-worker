import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import SitemapGeneratorTool from "@/sections/seo-tools/SitemapGeneratorTool";

export default function SitemapGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <SitemapGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
