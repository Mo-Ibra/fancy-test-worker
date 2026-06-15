import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ImageRotatorTool from "@/sections/image-tools/ImageRotatorTool";

export default function ImageRotatorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ImageRotatorTool />
      <CTA />
      <Footer />
    </>
  );
}
