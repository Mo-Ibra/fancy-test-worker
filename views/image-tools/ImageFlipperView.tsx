import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ImageFlipperTool from "@/sections/image-tools/ImageFlipperTool";

export default function ImageFlipperView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ImageFlipperTool />
      <CTA />
      <Footer />
    </>
  );
}
