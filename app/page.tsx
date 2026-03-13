import MainSection from '@/components/sections/MainSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import ProductsSection from '@/components/sections/ProductsSection';
import GallerySection from '@/components/sections/GallerySection';

const STYLE = {
  main: 'w-full bg-bg-dark',
};

export default function Home() {
  return (
    <main className={STYLE.main}>
      <MainSection />
      <AboutSection />
      <ProductsSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}