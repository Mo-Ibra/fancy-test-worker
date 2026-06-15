import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import PDFSplitterTool from "@/sections/pdf-tools/PDFSplitterTool";

export default function PDFSplitterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <PDFSplitterTool />
      <CTA />
      <Footer />
    </>
  );
}
