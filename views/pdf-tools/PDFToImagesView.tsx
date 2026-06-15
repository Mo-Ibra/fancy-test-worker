import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import PDFToImagesTool from "@/sections/pdf-tools/PDFToImagesTool";

export default function PDFToImagesView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <PDFToImagesTool />
      <CTA />
      <Footer />
    </>
  );
}
