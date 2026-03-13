'use client';

export default function ProductsSection() {
  return (
    <section className="h-screen flex flex-col justify-center px-20 bg-bg-dark border-t border-white/5">
      <h2 className="font-gilda text-[80px] uppercase text-point-light mb-10">Products</h2>
      
      <div className="max-w-3xl">
        <p className="font-pretendard text-2xl font-light leading-relaxed text-white/90">
          우리는 단순한 디자인을 넘어, 브랜드의 기적을 만듭니다.<br />
          <span className="font-crimson italic text-point-green">"Design is a silent ambassador of your brand."</span>
        </p>
        <p className="font-pretendard mt-6 text-lg text-white/60">
          Miracle은 중소기업의 가치를 시각적으로 극대화하여 
          세상에 전달하는 브랜드 에이전시입니다.
        </p>
      </div>
    </section>
  );
}