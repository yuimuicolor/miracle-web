'use client';

import { ChevronDown } from 'lucide-react';

export default function MainSection() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 bg-[url('/images/main-bg.png')] bg-cover bg-center opacity-60" />

      {/* 텍스트 컨텐츠 */}
      <div className="relative z-10 text-center flex flex-col gap-2 items-center">
        {/* 한글 메인 타이틀 */}
        <h3 className="font-kr-xxl-reg text-white relative">
          <b>기적</b>을 <b>일상</b>으로,
          <span className="font-en-xxl-r absolute -top-4 -right-8 text-point-light">*</span>
        </h3>

        {/* 보라색 강조 박스 + 필기체 느낌 */}
        <div className="bg-white px-10 py-2">
          <span className="font-playwrite text-[72px] text-point leading-none">
            Miracle
          </span>
        </div>

        {/* 영문 서브 타이틀 */}
        <h3 className="font-en-crimson-pc text-white">
          Begins Within
        </h3>
      </div>

      {/* 스크롤 다운 안내 */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-40 animate-bounce">
        <span className="text-center font-en-noto-xs-med text-white tracking-[0.3em]">SCROLL<br/>DOWN</span>
        <ChevronDown className="text-white" size={20} />
      </div>
    </section>
  );
}