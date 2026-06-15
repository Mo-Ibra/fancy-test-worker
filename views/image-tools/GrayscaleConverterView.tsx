import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import GrayscaleConverterTool from "@/sections/image-tools/GrayscaleConverterTool";

export default function GrayscaleConverterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <GrayscaleConverterTool />
      <CTA />
      <Footer />
    </>
  );
}
