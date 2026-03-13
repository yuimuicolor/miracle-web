import MainSection from '@/components/sections/MainSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import ProductsSection from '@/components/sections/ProductsSection';
import GallerySection from '@/components/sections/GallerySection';

export default function Home() {
  return (
    <main className="w-full bg-bg-dark">
      <MainSection />
      <AboutSection />
      <ProductsSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}