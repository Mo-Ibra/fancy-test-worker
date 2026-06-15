import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import RobotsTxtGeneratorTool from "@/sections/seo-tools/RobotsTxtGeneratorTool";

export default function RobotsTxtGeneratorView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <RobotsTxtGeneratorTool />
      <CTA />
      <Footer />
    </>
  );
}
