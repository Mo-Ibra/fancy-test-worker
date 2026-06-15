import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import HTMLFormatterTool from "@/sections/dev-tools/HTMLFormatterTool";

export default function HTMLFormatterView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <HTMLFormatterTool />
      <CTA />
      <Footer />
    </>
  );
}
