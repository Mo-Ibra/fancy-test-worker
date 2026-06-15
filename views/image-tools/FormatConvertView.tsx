import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import FormatConverterTool from "@/sections/image-tools/FormatConvertTool";

export default function FormatConvertView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <FormatConverterTool />
      <CTA />
      <Footer />
    </>
  );
}
