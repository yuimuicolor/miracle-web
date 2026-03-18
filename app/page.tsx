import { Suspense } from 'react';
import MainSection from '@/components/sections/MainSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactUsSection from '@/components/sections/ContactUsSection';
import ProductsSection from '@/components/sections/ProductsSection';
import GallerySection from '@/components/sections/GallerySection';
import InformationSection from '@/components/sections/InformationSection';

const STYLE = {
  main: 'home-snap no-footer-offset w-full bg-bg-dark',
  snapSection: 'snap-start snap-always min-h-screen-minus-header-offset',
  sectionFallback:
    'snap-start snap-always min-h-screen-minus-header-offset w-full bg-bg-dark/60',
};

export default function Home() {
  const sectionFallback = <section className={STYLE.sectionFallback} aria-hidden="true" />;

  return (
    <main className={STYLE.main}>
      <section className={STYLE.snapSection}><MainSection /></section>
      <Suspense fallback={sectionFallback}>
        <section className={STYLE.snapSection}><AboutSection /></section>
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <section className={STYLE.snapSection}><ProductsSection /></section>
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <section className={STYLE.snapSection}><GallerySection /></section>
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <section className={STYLE.snapSection}><InformationSection /></section>
      </Suspense>
      <Suspense fallback={sectionFallback}>
        <section className={STYLE.snapSection}><ContactUsSection /></section>
      </Suspense>
    </main>
  );
}