import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ImageCompressorTool from "@/sections/image-tools/ImageCompressorTool";

export default function ImageCompressorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ImageCompressorTool />
      <CTA />
      <Footer />
    </>
  );
}
