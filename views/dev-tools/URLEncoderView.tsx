import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import URLEncoderTool from "@/sections/dev-tools/URLEncoderTool";

export default function URLEncoderView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <URLEncoderTool />
      <CTA />
      <Footer />
    </>
  );
}
