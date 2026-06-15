import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import PDFToWordTool from "@/sections/pdf-tools/PDFToWordTool";

export default function PDFToWordView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <PDFToWordTool />
      <CTA />
      <Footer />
    </>
  );
}
