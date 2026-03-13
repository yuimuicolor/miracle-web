'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-20 py-8 flex justify-between items-center bg-transparent backdrop-blur-[2px]">
      {/* 로고 */}
      <Link href="/" className="font-gilda text-2xl tracking-widest text-white uppercase">
        Miracle
      </Link>

      {/* 메뉴 내비게이션 */}
      <nav className="flex gap-12">
        {['About Us', 'Products', 'Gallery', 'Contact'].map((item) => (
          <Link 
            key={item} 
            href={`/${item.toLowerCase().replace(' ', '')}`}
            className="font-en-noto-xs-med text-white/80 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </nav>

      {/* 언어 선택 */}
      <div className="flex items-center gap-4 font-en-noto-xs-med text-white/50">
        <button className="text-white border border-white/40 rounded-full px-2 py-0.5 scale-90">KR</button>
        <span className="w-[1px] h-3 bg-white/20" />
        <button className="hover:text-white">EN</button>
      </div>
    </header>
  );
}