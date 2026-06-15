import CTA from "@/sections/CTA";
import Footer from "@/sections/Footer";
import Navigation from "@/components/Navigation";
import { Language } from "@/lib/i18n";
import PasswordStrengthChecker from "@/sections/security-tools/PasswordStrengthChecker";

export default function PasswordStrengthView({ lang }: { lang: Language }) {
  return (
    <>
      <Navigation language={lang} />
      <PasswordStrengthChecker />
      <CTA />
      <Footer />
    </>
  );
}
