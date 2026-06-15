import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ImageResizerTool from "@/sections/image-tools/ImageResizerTool";

export default function ImageResizerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ImageResizerTool />
      <CTA />
      <Footer />
    </>
  );
}
