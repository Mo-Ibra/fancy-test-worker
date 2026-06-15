import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import RotatePDFTool from "@/sections/pdf-tools/RotatePDFTool";

export default function RotatePDFView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <RotatePDFTool />
      <CTA />
      <Footer />
    </>
  );
}
