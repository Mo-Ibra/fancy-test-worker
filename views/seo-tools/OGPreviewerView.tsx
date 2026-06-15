import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import OGPreviewerTool from "@/sections/seo-tools/OGPreviewerTool";

export default function OGPreviewerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <OGPreviewerTool />
      <CTA />
      <Footer />
    </>
  );
}
