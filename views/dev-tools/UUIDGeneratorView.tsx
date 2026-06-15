import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import UUIDGeneratorTool from "@/sections/dev-tools/UUIDGeneratorTool";

export default function UUIDGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <UUIDGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
