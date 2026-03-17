'use client';

import { ChevronDown } from 'lucide-react';
import { HOME_CONTENT } from '@/lib/siteData';

const STYLE = {
  section:
    'relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg-dark',
  background:
    "absolute inset-0 bg-[url('/images/main-bg.png')] bg-cover bg-center opacity-60",
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
    'absolute bottom-10 flex flex-col items-center gap-2 opacity-40 animate-bounce',
  scrollGuideText: `
    text-center font-noto font-100 tracking-[0.3em] text-white
    text-[1.6rem]
    md:text-[1.8rem]
  `,
  scrollGuideIcon: 'text-white',
};

export default function MainSection() {
  const { mainSection } = HOME_CONTENT;

  return (
    <section className={STYLE.section}>
      <div className={STYLE.background} />

      {/* 텍스트 컨텐츠 */}
      <div className={STYLE.contentWrap}>
        {/* 한글 메인 타이틀 */}
        <h3 className={STYLE.title}>
          <b>{mainSection.title.firstEmphasis}</b>{mainSection.title.betweenText}<b>{mainSection.title.secondEmphasis}</b>{mainSection.title.suffix}
          <span className={STYLE.titleStar}>{mainSection.title.star}</span>
        </h3>

        {/* 보라색 강조 박스 + 필기체 느낌 */}
        <div className={STYLE.logoWrap}>
          <span className={STYLE.logoText}>
            {mainSection.logoText}
          </span>
        </div>

        {/* 영문 서브 타이틀 */}
        <h3 className={STYLE.subtitle}>
          {mainSection.subtitle}
        </h3>
      </div>

      {/* 스크롤 다운 안내 */}
      <div className={STYLE.scrollGuideWrap}>
        <span className={STYLE.scrollGuideText}>
          {mainSection.scrollGuide.split('\n').map((line, index, array) => (
            <span key={`${line}-${index}`}>
              {line}
              {index < array.length - 1 ? <br /> : null}
            </span>
          ))}
        </span>
        <ChevronDown className={STYLE.scrollGuideIcon} size={20} />
      </div>
    </section>
  );
}