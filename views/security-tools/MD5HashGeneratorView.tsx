import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import HashGeneratorTool from "@/sections/security-tools/MD5HashGeneratorTool";

export default function MD5HashGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <HashGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
