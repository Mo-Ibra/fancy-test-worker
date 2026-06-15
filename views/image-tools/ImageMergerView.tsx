import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ImageMergerTool from "@/sections/image-tools/ImageMergerTool";

export default function ImageMergerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ImageMergerTool />
      <CTA />
      <Footer />
    </>
  );
}
