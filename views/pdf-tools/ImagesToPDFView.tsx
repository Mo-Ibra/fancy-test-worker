import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ImagesToPDFTool from "@/sections/pdf-tools/ImagesToPDFTool";

export default function ImagesToPDFView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ImagesToPDFTool />
      <CTA />
      <Footer />
    </>
  );
}
