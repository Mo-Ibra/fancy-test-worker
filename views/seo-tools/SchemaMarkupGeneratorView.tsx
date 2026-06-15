import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import SchemaMarkupGeneratorTool from "@/sections/seo-tools/SchemaMarkupGeneratorTool";

export default function SchemaMarkupGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <SchemaMarkupGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
