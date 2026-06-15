import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import UnlockPDFTool from "@/sections/pdf-tools/UnlockPDFTool";

export default function UnlockPDFView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <UnlockPDFTool />
      <CTA />
      <Footer />
    </>
  );
}
