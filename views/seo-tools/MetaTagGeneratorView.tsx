import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import MetaTagGeneratorTool from "@/sections/seo-tools/MetaTagGeneratorTool";

export default function MetaTagGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <MetaTagGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
