import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import UnixTimestampTool from "@/sections/dev-tools/UnixTimestampTool";

export default function UnixTimestampView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <UnixTimestampTool />
      <CTA />
      <Footer />
    </>
  );
}
