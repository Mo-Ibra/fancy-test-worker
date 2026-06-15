import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import AddWatermarkTool from "@/sections/image-tools/AddWatermarkTool";

export default function AddWatermarkView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <AddWatermarkTool />
      <CTA />
      <Footer />
    </>
  );
}
