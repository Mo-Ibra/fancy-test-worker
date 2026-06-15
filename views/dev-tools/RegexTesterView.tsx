import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import RegexTesterTool from "@/sections/dev-tools/RegexTesterTool";

export default function RegexTesterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <RegexTesterTool />
      <CTA />
      <Footer />
    </>
  );
}
