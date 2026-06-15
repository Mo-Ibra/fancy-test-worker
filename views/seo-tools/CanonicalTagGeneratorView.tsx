import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import CanonicalTagGeneratorTool from "@/sections/seo-tools/CanonicalTagGeneratorTool";

export default function CanonicalTagGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <CanonicalTagGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
