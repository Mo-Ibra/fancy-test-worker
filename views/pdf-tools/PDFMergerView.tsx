import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import PDFMergerTool from "@/sections/pdf-tools/PDFMergerTool";

export default function PDFMergerView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <PDFMergerTool />
      <CTA />
      <Footer />
    </>
  );
}
