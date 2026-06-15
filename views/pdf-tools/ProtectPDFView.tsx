import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ProtectPDFTool from "@/sections/pdf-tools/ProtectPDFTool";

export default function ProtectPDFView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ProtectPDFTool />
      <CTA />
      <Footer />
    </>
  );
}
