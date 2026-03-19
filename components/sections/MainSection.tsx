'use client';

import { ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { HOME_REVEAL } from '@/components/sections/homeMotion';
import { HOME_CONTENT } from '@/lib/siteData';

const STYLE = {
  section:
    'relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg-dark',
  background:
    " absolute inset-0 bg-[url('/images/main-bg.png')] bg-cover bg-center opacity-60 animate-home-hero-drift",
  glow:
    'pointer-events-none absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-point/30 blur-[120px] animate-home-hero-glow md:h-[58rem] md:w-[58rem]',
  contentWrap: 'relative z-10 flex flex-col items-center gap-2 text-center',
  title: `
    relative font-noto leading-normal tracking-[-0.03em] text-white
    text-[4.4rem]
    md:text-[5.6rem]
  `,
  titleStar: `
    absolute -top-4 -right-8 font-gilda leading-20 tracking-[-0.05em] text-point-light
    text-[6rem]
    md:text-[8rem]
  `,
  logoWrap: 'bg-white px-10 py-2',
  logoText: `
    font-playwrite leading-none text-point
    text-[5.6rem]
    md:text-[7.2rem]
  `,
  subtitle: `
    font-crimson font-100 tracking-[-0.03em] text-white
    text-[4.8rem]
    md:text-[6rem]
  `,
  scrollGuideWrap:
    'absolute bottom-10 flex flex-col items-center gap-2 opacity-40 animate-home-soft-float',
  scrollGuideText: `
    text-center font-noto font-100 tracking-[0.3em] text-white
    text-[1.8rem]
  `,
  scrollGuideIcon: 'text-white',
};

export default function MainSection() {
  const { mainSection } = HOME_CONTENT;

  return (
    <section className={STYLE.section}>
      <div className={STYLE.background} />
      <div className={STYLE.glow} />

      <div className={STYLE.contentWrap}>
        <ScrollReveal delayMs={80} {...HOME_REVEAL.heroTitle}>
          <h3 className={STYLE.title}>
            <b>{mainSection.title.firstEmphasis}</b>{mainSection.title.betweenText}<b>{mainSection.title.secondEmphasis}</b>{mainSection.title.suffix}
            <span className={STYLE.titleStar}>{mainSection.title.star}</span>
          </h3>
        </ScrollReveal>

        <ScrollReveal delayMs={220} {...HOME_REVEAL.heroLogo}>
          <div className={STYLE.logoWrap}>
            <span className={STYLE.logoText}>
              {mainSection.logoText}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={340} {...HOME_REVEAL.heroSubtitle}>
          <h3 className={STYLE.subtitle}>
            {mainSection.subtitle}
          </h3>
        </ScrollReveal>
      </div>

      <ScrollReveal
        className={STYLE.scrollGuideWrap}
        delayMs={540}
        {...HOME_REVEAL.heroSubtitle}
      >
        <span className={STYLE.scrollGuideText}>
          {mainSection.scrollGuide.split('\n').map((line, index, array) => (
            <span key={`${line}-${index}`}>
              {line}
              {index < array.length - 1 ? <br /> : null}
            </span>
          ))}
        </span>
        <ChevronDown className={STYLE.scrollGuideIcon} size={20} />
      </ScrollReveal>
    </section>
  );
}