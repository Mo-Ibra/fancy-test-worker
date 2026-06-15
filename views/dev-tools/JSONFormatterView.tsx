import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import JSONFormatterTool from "@/sections/dev-tools/JSONFormatterTool";

export default function JSONFormatterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <JSONFormatterTool />
      <CTA />
      <Footer />
    </>
  );
}
