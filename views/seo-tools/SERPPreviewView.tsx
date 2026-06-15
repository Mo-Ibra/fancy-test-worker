import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import SERPPreviewTool from "@/sections/seo-tools/SERPPreviewTool";

export default function SERPPreviewView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <SERPPreviewTool />
      <CTA />
      <Footer />
    </>
  );
}
