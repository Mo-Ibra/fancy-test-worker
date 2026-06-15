import Categories from '@/sections/Categories';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';
import Hero from '@/sections/Hero';
import HowItWorks from '@/sections/HowItWorks';
import LatestArticles from '@/sections/LatestArticles';
import Navigation from '@/components/Navigation';
import { Language } from '@/lib/i18n';

interface HomeViewProps {
  lang: Language;
}

export default function HomeView({ lang }: HomeViewProps) {
  return (
    <>
      <Navigation language={lang} />
      <Hero />
      <Categories />
      <HowItWorks />
      {/* <LatestArticles /> */}
      <CTA />
      <Footer />
    </>
  );
}
