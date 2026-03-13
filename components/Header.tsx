'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const menuData = [
  {
    title: 'ABOUT US',
    href: '/aboutus',
    submenus: ['회사소개', '히스토리', '인증서', 'CEO소개']
  },
  {
    title: 'PRODUCTS',
    href: '/products',
    submenus: ['제품1', '제품2', '제품3']
  },
  {
    title: 'GALLERY',
    href: '/gallery',
    submenus: ['갤러리']
  },
  {
    title: 'CONTACT',
    href: '/contact',
    submenus: ['오시는길', '상담문의']
  }
];

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [isPC, setIsPC] = useState(false);

  React.useEffect(() => {
    const checkPC = () => setIsPC(window.innerWidth >= 1024);
    checkPC();
    window.addEventListener('resize', checkPC);
    return () => window.removeEventListener('resize', checkPC);
  }, []);

  return (
    <header 
      className={`px-4 sm:px-10 md:px-20 fixed top-0 left-0 w-full z-50 h-[80px] sm:h-[120px] md:h-[150px] flex justify-between items-center backdrop-blur-[2px] transition-all duration-300 ${isHovered && isPC ? 'bg-gradient-to-b from-[#0A0A0A] to-transparent' : 'bg-transparent'}`}
      onMouseEnter={() => isPC && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoveredMenu(null); }}
    >
      {/* 로고 */}
      <Link href="/" className="font-gilda text-2xl tracking-widest text-white uppercase">
        <img src="/images/miracle-main-logo.png" alt="Logo" />
      </Link>
      {/* 메뉴 내비게이션 */}
      <nav className="flex gap-12 relative">
        {menuData.map((menu, index) => (
          <div key={menu.title} className="relative">
            <Link 
              href={menu.href}
              className="font-en-m-reg text-white/80 hover:text-white transition-colors h-[80px] sm:h-[120px] md:h-[150px] w-[200px] flex items-center justify-center hover:bg-point"
              onMouseEnter={() => isPC && setHoveredMenu(index)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              {menu.title}
            </Link>
            {/* 하위 메뉴 */}
            {hoveredMenu === index && isHovered && isPC && (
              <div className="absolute top-full left-0 bg-point w-[200px] z-50 shadow-lg">
                {menu.submenus.map((sub) => (
                  <Link key={sub} href={`${menu.href}/${sub.replace(/\s+/g, '').toLowerCase()}`} className="block h-[60px] px-4 py-4 font-kr-s-semibold text-white hover:bg-white/10 transition-colors">
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>
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