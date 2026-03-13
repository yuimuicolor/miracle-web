"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 설정값 상수화 (고치기 쉽게!)
const UI_CONFIG = {
  SUBMENU_HEIGHT_REM: 3.75,
  HEADER_H_PC_REM: 9.375,
  BREAKPOINT: 1024,   // lg
};

const menuData = [
  { title: "ABOUT US", href: "/aboutus", submenus: ["회사소개", "히스토리", "인증서", "CEO소개"] },
  { title: "PRODUCTS", href: "/products", submenus: ["제품1", "제품2", "제품3"] },
  { title: "GALLERY", href: "/gallery", submenus: ["갤러리"] },
  { title: "CONTACT", href: "/contact", submenus: ["오시는길", "상담문의"] },
];

const STYLE = {
  header: `
    fixed top-0 left-0 z-50 w-full flex justify-between items-center 
    backdrop-blur-[2px] transition-all duration-500 ease-in-out
    px-[1.6rem] h-[8rem] 
    sm:px-[4rem] sm:h-[12rem] 
    md:px-[8rem] md:h-[15rem]
  `,
  gradientBase: `
    pointer-events-none absolute inset-x-0 top-0 -z-10 transition-color duration-300 ease-in-out`,
  gradientColor: (isHovered: boolean) => 
    isHovered ? "bg-linear-to-b from-[#0A0A0A] to-transparent" : "bg-linear-to-b from-[#767676] to-transparent",
  nav: "flex relative h-full gap-0",
  menuItem: (isActive: boolean, isHovered: boolean) => `
    flex items-center justify-center transition-all tracking-normal h-full w-[20rem]
    text-[2.4rem] font-noto leading-0 text-white/80 hover:text-white
    ${isActive ? "font-semibold" : "font-normal"} 
    ${isHovered ? "bg-point border-b-[1px] border-white" : ""}
  `,
  submenu: `
    absolute top-full left-0 z-50 w-full text-center shadow-lg bg-point
  `,
  submenuItem: `
    block h-[6rem] flex items-center justify-center
    font-noto text-[2rem] text-white transition-colors
    hover:font-semibold hover:bg-white/10
  `,
  languageSelector: "relative z-10 flex items-center gap-[1.2rem] text-white/50 font-noto text-[1.8rem]",
  languageButton: `
    text-white border border-white/40 rounded-full px-[1.2rem] py-0
    hover:bg-white/20 hover:border-white/60 transition-colors
  `,
  languageSeparator: "w-[1px] h-[1.4rem] bg-white/20",
  menuWrap: 'relative h-full',
  logo: 'h-auto w-auto max-h-[3.75rem]',
};

export default function Header() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [isPC, setIsPC] = useState(false);
  const activatedMenu = menuData.find((menu) => pathname.startsWith(menu.href))?.title ?? "";

  const activeSubmenuHeight =
    isPC && isHovered && hoveredMenu !== null
      ? menuData[hoveredMenu].submenus.length * UI_CONFIG.SUBMENU_HEIGHT_REM
      : 0;

  const totalHeight = isPC && isHovered 
    ? `${UI_CONFIG.HEADER_H_PC_REM + activeSubmenuHeight}rem`
    : isPC ? `${UI_CONFIG.HEADER_H_PC_REM}rem` : "auto";

  useEffect(() => {
    const checkPC = () => setIsPC(window.innerWidth >= UI_CONFIG.BREAKPOINT);
    checkPC();
    window.addEventListener("resize", checkPC);
    return () => window.removeEventListener("resize", checkPC);
  }, []);

  return (
    <header
      className={STYLE.header}
      onMouseEnter={() => isPC && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoveredMenu(null); }}
    >
      <div
        className={`${STYLE.gradientBase} ${STYLE.gradientColor(isHovered && isPC)}`}
        style={{ height: totalHeight }}
      />

      <Link href="/"><img src="/images/miracle-main-logo.png" alt="Logo" className={STYLE.logo} /></Link>

      <nav className={STYLE.nav}>
        {menuData.map((menu, index) => (
          <div
            key={menu.title}
            className={STYLE.menuWrap}
            onMouseEnter={() => isPC && setHoveredMenu(index)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <Link
              href={menu.href}
              className={STYLE.menuItem(activatedMenu === menu.title, hoveredMenu === index)}
            >
              {menu.title}
            </Link>

            {hoveredMenu === index && isHovered && isPC && (
              <div className={STYLE.submenu}>
                {menu.submenus.map((sub) => (
                  <Link
                    key={sub}
                    href={`${menu.href}/${sub.replace(/\s+/g, "").toLowerCase()}`}
                    className={STYLE.submenuItem}
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className={STYLE.languageSelector}>
        <button className={STYLE.languageButton}>KR</button>
        <span className={STYLE.languageSeparator} />
        <button className={STYLE.languageButton}>EN</button>
      </div>
    </header>
  );
}