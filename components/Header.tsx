"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HEADER_CONFIG, HEADER_HEIGHTS_CSS } from "@/lib/headerConfig";

const menuData = [
  { title: "ABOUT US", href: "/aboutus", submenus: ["회사소개", "히스토리", "인증서", "CEO소개"] },
  { title: "PRODUCTS", href: "/products", submenus: ["제품1", "제품2", "제품3"] },
  { title: "GALLERY", href: "/gallery", submenus: [] },
  { title: "CONTACT", href: "/contact", submenus: ["오시는길", "상담문의"] },
];

const STYLE = {
  headerPC: `
    fixed top-0 left-0 z-50 flex w-full items-center gap-[1.2rem] lg:gap-[2rem]
    backdrop-blur-[2px]
    px-[1.6rem] md:px-[8rem]
  `,
  headerMobile: `
    fixed top-0 left-0 z-50 w-full backdrop-blur-[12px] px-[1.6rem] lg:px-[4rem]
  `,
  gradientBase: `
    pointer-events-none absolute inset-x-0 top-0 -z-10 transition-color duration-300 ease-in-out`,
  gradientColor: (isHovered: boolean) => 
    isHovered ? "bg-linear-to-b from-[#0A0A0A] to-transparent" : "bg-linear-to-b from-[#767676] to-transparent",

  nav: "relative flex h-full flex-1 items-stretch justify-center",
  menuItem: (isActive: boolean, isHovered: boolean) => `
    flex h-full w-full items-center justify-center transition-all transition-colors duration-300 ease-in-out
    whitespace-nowrap text-[1.8rem] lg:text-[2.4rem] font-noto leading-none tracking-normal text-white/80 hover:text-white
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
  languageSelector: "relative z-10 flex items-center gap-[0.8rem] lg:gap-[1.2rem] text-white/50 font-noto text-[1.2rem] lg:text-[1.8rem]",
  languageButton: `
    text-white border border-white/40 rounded-full px-[0.8rem] lg:px-[1.2rem] py-0
    hover:bg-white/20 hover:border-white/60 transition-colors
  `,
  languageSeparator: "w-[1px] h-[1.4rem] bg-white/20",
  languageSelectorMobile: "relative z-10 flex items-center gap-[0.8rem] text-white/50 font-noto text-[1.4rem]",
  languageButtonMobile: `
    text-white border border-white/40 rounded-full px-[0.8rem] py-0
    hover:bg-white/20 hover:border-white/60 transition-colors
  `,
  languageSeparatorMobile: "w-[1px] h-[1.2rem] bg-white/20",
  menuWrap: 'relative h-full flex-1 max-w-[20rem]',
  logo: 'w-full h-[2.4rem]',
  mobileTopRow: "flex w-full items-center justify-between",
  mobileRightControls: "flex items-center gap-[1rem]",
  menuToggleButton: "relative flex h-[4rem] w-[4rem] items-center justify-center transition-colors hover:bg-white/20",
  menuToggleLine: "absolute h-[2px] w-[3rem] bg-white transition-all duration-300 ease-in-out",
  mobileMenuPanel: "w-full border-t border-white/10 py-[1.2rem]",
  mobileMenuItemButton: "flex w-full items-center justify-center gap-[1rem] py-[1.2rem] text-center text-[2rem] font-noto text-white/90 transition-colors hover:text-white",
  mobileMenuChevron: "text-[1.4rem] text-white/70 transition-transform duration-300",
  mobileSubmenuWrap: "mb-[0.6rem] w-full border-l border-white/20",
  mobileSubmenuItem: "block w-full py-[0.8rem] text-center text-[1.6rem] font-noto text-white/70 transition-colors hover:text-white"
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<number[]>([]);
  const [deviceType, setDeviceType] = useState<"pc" | "tablet" | "mobile">("mobile");
  const activatedMenu = menuData.find((menu) => pathname.startsWith(menu.href))?.title ?? "";
  const isPC = deviceType === "pc";
  const isTablet = deviceType === "tablet";
  const canHoverMenu = isPC;
  const mobileHeaderHeight = isTablet
    ? HEADER_HEIGHTS_CSS.TABLET
    : HEADER_HEIGHTS_CSS.MOBILE;

  const activeSubmenuHeight =
    canHoverMenu && isHovered && hoveredMenu !== null
      ? menuData[hoveredMenu].submenus.length * HEADER_CONFIG.SUBMENU_HEIGHT_REM
      : 0;

  const totalHeight = `calc(${HEADER_HEIGHTS_CSS.PC} + ${isHovered ? activeSubmenuHeight : 0}rem)`;

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;

      if (width >= HEADER_CONFIG.BREAKPOINTS.DESKTOP) {
        setDeviceType("pc");
        return;
      }

      if (width >= HEADER_CONFIG.BREAKPOINTS.TABLET) {
        setDeviceType("tablet");
        return;
      }

      setDeviceType("mobile");
    };

    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  useEffect(() => {
    if (!isPC) {
      setIsHovered(false);
      setHoveredMenu(null);
      return;
    }

    setIsMenuOpen(false);
  }, [isPC]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      setExpandedMobileMenus([]);
    }
  }, [isMenuOpen]);

  const handleHeaderLinkClick = (href: string) => {
    setIsHovered(false);
    setHoveredMenu(null);
    setIsMenuOpen(false);
    setExpandedMobileMenus([]);

    if (pathname.startsWith(href)) {
      router.refresh();
    }
  };

  if (!isPC) {
    return (
      <header className={`${STYLE.headerMobile} ${isMenuOpen ? "h-screen overflow-y-auto bg-point" : "bg-linear-to-b from-[#767676] to-transparent"}`}>
        <div className={STYLE.mobileTopRow} style={{ height: mobileHeaderHeight }}>
          <Link href="/"><img src="/images/miracle-main-logo.png" alt="Logo" className={STYLE.logo} /></Link>

          <div className={STYLE.mobileRightControls}>
            {isMenuOpen && (
              <div className={STYLE.languageSelectorMobile}>
                <button className={STYLE.languageButtonMobile}>KR</button>
                <span className={STYLE.languageSeparatorMobile} />
                <button className={STYLE.languageButtonMobile}>EN</button>
              </div>
            )}

            <button
              type="button"
              className={STYLE.menuToggleButton}
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span
                className={STYLE.menuToggleLine}
                style={{ transform: isMenuOpen ? "rotate(45deg)" : "translateY(-6px)" }}
              />
              <span
                className={STYLE.menuToggleLine}
                style={{ opacity: isMenuOpen ? 0 : 1 }}
              />
              <span
                className={STYLE.menuToggleLine}
                style={{ transform: isMenuOpen ? "rotate(-45deg)" : "translateY(6px)" }}
              />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className={STYLE.mobileMenuPanel}>
            {menuData.map((menu, index) => {
              const hasSubmenus = menu.submenus.length > 0;
              const isExpanded = hasSubmenus && expandedMobileMenus.includes(index);

              return (
                <div key={menu.title}>
                  {hasSubmenus ? (
                    <button
                      type="button"
                      className={STYLE.mobileMenuItemButton}
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedMobileMenus((prev) =>
                          prev.includes(index)
                            ? prev.filter((menuIndex) => menuIndex !== index)
                            : [...prev, index]
                        )
                      }
                    >
                      <span>{menu.title}</span>
                      <span
                        className={STYLE.mobileMenuChevron}
                        style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        ▼
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={menu.href}
                      className={STYLE.mobileMenuItemButton}
                      onClick={() => handleHeaderLinkClick(menu.href)}
                    >
                      <span>{menu.title}</span>
                    </Link>
                  )}

                  {hasSubmenus && isExpanded && (
                    <div className={STYLE.mobileSubmenuWrap}>
                      {menu.submenus.map((sub) => (
                        <Link
                          key={sub}
                          href={`${menu.href}/${sub.replace(/\s+/g, "").toLowerCase()}`}
                          className={STYLE.mobileSubmenuItem}
                          onClick={() => handleHeaderLinkClick(menu.href)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </header>
    );
  }

  return (
    <header
      className={STYLE.headerPC}
      style={{ height: HEADER_HEIGHTS_CSS.PC }}
      onMouseEnter={() => canHoverMenu && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoveredMenu(null); }}
    >
      <div
        className={`${STYLE.gradientBase} ${STYLE.gradientColor(isHovered && canHoverMenu)}`}
        style={{ height: totalHeight }}
      />

      <Link href="/"><img src="/images/miracle-main-logo.png" alt="Logo" className={STYLE.logo} /></Link>

      <nav className={STYLE.nav}>
        {menuData.map((menu, index) => (
          <div
            key={menu.title}
            className={STYLE.menuWrap}
            onMouseEnter={() => canHoverMenu && menu.submenus.length > 0 && setHoveredMenu(index)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <Link
              href={menu.href}
              className={STYLE.menuItem(activatedMenu === menu.title, hoveredMenu === index)}
              onClick={() => handleHeaderLinkClick(menu.href)}
            >
              {menu.title}
            </Link>

            {menu.submenus.length > 0 && hoveredMenu === index && isHovered && canHoverMenu && (
              <div className={STYLE.submenu}>
                {menu.submenus.map((sub) => (
                  <Link
                    key={sub}
                    href={`${menu.href}/${sub.replace(/\s+/g, "").toLowerCase()}`}
                    className={STYLE.submenuItem}
                    onClick={() => handleHeaderLinkClick(menu.href)}
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