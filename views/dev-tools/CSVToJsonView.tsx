import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import CSVToJSONTool from "@/sections/dev-tools/CSVToJsonTool";

export default function CSVToJsonView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <CSVToJSONTool />
      <CTA />
      <Footer />
    </>
  );
}
