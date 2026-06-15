import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import Base64Tool from "@/sections/dev-tools/Base64Tool";

export default function Base64View({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <Base64Tool />
      <CTA />
      <Footer />
    </>
  );
}
