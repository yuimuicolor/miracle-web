'use client';

const STYLE = {
  section: 'h-screen flex flex-col justify-center px-20 bg-bg-dark border-t border-white/5',
  title: 'font-gilda text-[5rem] uppercase text-point-light mb-10',
  contentWrap: 'max-w-3xl',
  lead: 'font-pretendard text-2xl font-light leading-relaxed text-white/90',
  leadAccent: 'font-crimson italic text-point-green',
  body: 'font-pretendard mt-6 text-lg text-white/60',
};

export default function AboutSection() {
  return (
    <section className={STYLE.section}>
      <h2 className={STYLE.title}>About Us</h2>
      
      <div className={STYLE.contentWrap}>
        <p className={STYLE.lead}>
          우리는 단순한 디자인을 넘어, 브랜드의 기적을 만듭니다.<br />
          <span className={STYLE.leadAccent}>&quot;Design is a silent ambassador of your brand.&quot;</span>
        </p>
        <p className={STYLE.body}>
          Miracle은 중소기업의 가치를 시각적으로 극대화하여 
          세상에 전달하는 브랜드 에이전시입니다.
        </p>
      </div>
    </section>
  );
}