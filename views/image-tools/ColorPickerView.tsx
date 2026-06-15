import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ColorPickerTool from "@/sections/image-tools/ColorPickerTool";

export default function ColorPickerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ColorPickerTool />
      <CTA />
      <Footer />
    </>
  );
}
