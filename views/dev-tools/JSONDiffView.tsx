import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import JSONDiffTool from "@/sections/dev-tools/JSONDiffTool";

export default function JSONDiffView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <JSONDiffTool />
      <CTA />
      <Footer />
    </>
  );
}
