import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import JWTDecoderTool from "@/sections/dev-tools/JWTDecoderTool";

export default function JWTDecoderView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <JWTDecoderTool />
      <CTA />
      <Footer />
    </>
  );
}
