import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import ImageToBase64Tool from "@/sections/image-tools/ImageToBase64Tool";

export default function ImageToBase64View({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <ImageToBase64Tool />
      <CTA />
      <Footer />
    </>
  );
}
