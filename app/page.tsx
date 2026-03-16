import MainSection from '@/components/sections/MainSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactUsSection from '@/components/sections/ContactUsSection';
import ProductsSection from '@/components/sections/ProductsSection';
import GallerySection from '@/components/sections/GallerySection';

const STYLE = {
  main: 'no-header-offset no-footer-offset w-full bg-bg-dark',
};

export default function Home() {
  return (
    <main className={STYLE.main}>
      <MainSection />
      <AboutSection />
      <ProductsSection />
      <GallerySection />
      <ContactUsSection />
    </main>
  );
}