import MainSection from '@/components/sections/MainSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactUsSection from '@/components/sections/ContactUsSection';
import ProductsSection from '@/components/sections/ProductsSection';
import GallerySection from '@/components/sections/GallerySection';

const STYLE = {
  main: 'home-snap no-footer-offset w-full bg-bg-dark',
  snapSection: 'snap-start snap-always min-h-screen-minus-header-offset',
};

export default function Home() {
  return (
    <main className={STYLE.main}>
      <section className={STYLE.snapSection}><MainSection /></section>
      <section className={STYLE.snapSection}><AboutSection /></section>
      <section className={STYLE.snapSection}><ProductsSection /></section>
      <section className={STYLE.snapSection}><GallerySection /></section>
      <section className={STYLE.snapSection}><ContactUsSection /></section>
    </main>
  );
}