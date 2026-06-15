import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import PDFCompressorTool from "@/sections/pdf-tools/PDFCompressorTool";

export default function PDFCompressorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <PDFCompressorTool />
      <CTA />
      <Footer />
    </>
  );
}
