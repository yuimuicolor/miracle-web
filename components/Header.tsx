"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HEADER_CONFIG, HEADER_HEIGHTS_CSS } from "@/lib/headerConfig";
import { BRAND_DATA, NAVIGATION_MENU } from "@/lib/siteData";

const STYLE = {
  headerPC: `
    fixed top-0 left-0 z-50 flex w-full items-center
    gap-[1.2rem] px-[1.6rem] backdrop-blur-[2px]
    md:px-[8rem]
    lg:gap-[2rem]
  `,
  headerMobile: `
    fixed top-0 left-0 z-50 w-full px-[1.6rem] backdrop-blur-[12px]
    lg:px-[4rem]
  `,
  gradientBase: `
    pointer-events-none absolute inset-x-0 top-0 -z-10 transition-color duration-300 ease-in-out`,
  gradientColor: (isHovered: boolean) =>
    isHovered
      ? "bg-linear-to-b from-[#0A0A0A] to-transparent"
      : "bg-linear-to-b from-[#767676] to-transparent",

  nav: "relative flex h-full flex-1 items-stretch justify-center",
  menuItem: (isActive: boolean, isHovered: boolean) => `
    flex h-full w-full items-center justify-center transition-all transition-colors duration-300 ease-in-out
    whitespace-nowrap font-noto leading-none tracking-normal text-white/80 hover:text-white
    text-[1.8rem] lg:text-[2.4rem]
    ${isActive ? "font-semibold" : "font-normal"} 
    ${isHovered ? "bg-hover/70 border-b-[1px] border-white" : ""}
  `,
  submenu: `
    absolute top-full left-0 z-50 w-full text-center shadow-lg bg-point
  `,
  submenuItem: `
    block h-[6rem] flex items-center justify-center
    font-noto text-[2rem] text-white transition-colors
    hover:font-semibold hover:bg-white/10
  `,
  languageSelector: `
    relative z-10 flex items-center gap-[0.8rem] font-noto text-white/50
    text-[1.2rem]
    lg:gap-[1.2rem] lg:text-[1.8rem]
  `,
  languageButton: `
    text-white border border-white/40 rounded-full px-[0.8rem] lg:px-[1.2rem] py-0
    hover:bg-white/20 hover:border-white/60 transition-colors
  `,
  languageSeparator: "w-[1px] h-[1.4rem] bg-white/20",
  languageSelectorMobile:
    "relative z-10 flex items-center gap-[0.8rem] text-white/50 font-noto text-[1.4rem]",
  languageButtonMobile: `
    text-white border border-white/40 rounded-full px-[0.8rem] py-0
    hover:bg-white/20 hover:border-white/60 transition-colors
  `,
  languageSeparatorMobile: "w-[1px] h-[1.2rem] bg-white/20",
  menuWrap: "relative h-full flex-1 max-w-[20rem]",
  logo: "w-full h-[2.4rem]",
  mobileTopRow: "flex w-full items-center justify-between",
  mobileRightControls: "flex items-center gap-[1rem]",
  menuToggleButton:
    "relative flex h-[4rem] w-[4rem] items-center justify-center transition-colors hover:bg-white/20",
  menuToggleLine:
    "absolute h-[2px] w-[3rem] bg-white transition-all duration-300 ease-in-out",
  mobileMenuPanel: "w-full border-t border-white/10 py-[1.2rem]",
  mobileMenuItemButton: `
    flex w-full items-center justify-center gap-[1rem] py-[1.4rem] text-center
    font-noto text-[2rem] text-white/90 transition-colors hover:text-white
  `,
  mobileMenuChevron:
    "text-[1.4rem] text-white/70 transition-transform duration-300",
  mobileSubmenuWrap: "mb-[0.6rem] w-full",
  mobileSubmenuItem:
    "block w-full py-[0.8rem] text-center text-[1.8rem] font-noto text-white/70 transition-colors hover:text-white",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRouteNavigating, setIsRouteNavigating] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<number[]>([]);
  const [deviceType, setDeviceType] = useState<"pc" | "tablet" | "mobile">(
    "mobile",
  );
  const toPathOnly = (href: string) => href.split("#")[0];
  const activatedMenu =
    NAVIGATION_MENU.find((menu) => pathname.startsWith(toPathOnly(menu.href)))
      ?.title ?? "";
  const isPC = deviceType === "pc";
  const isTablet = deviceType === "tablet";
  const canHoverMenu = isPC;
  const mobileHeaderHeight = isTablet
    ? HEADER_HEIGHTS_CSS.TABLET
    : HEADER_HEIGHTS_CSS.MOBILE;

  const activeSubmenuHeight =
    canHoverMenu && isHovered && hoveredMenu !== null
      ? NAVIGATION_MENU[hoveredMenu].submenus.length *
        HEADER_CONFIG.SUBMENU_HEIGHT_REM
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
    setIsRouteNavigating(false);

    // Keep hash destinations as-is, otherwise reset scroll to top after route transition.
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  useEffect(() => {
    const uniqueRoutes = Array.from(
      new Set(
        NAVIGATION_MENU.map((menu) => toPathOnly(menu.href)).filter(
          (route) => route.length > 0,
        ),
      ),
    );

    uniqueRoutes.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      setExpandedMobileMenus([]);
      document.body.style.overflow = "unset";
    }
    // 컴포넌트 언마운트 시(페이지 이동 등) 스크롤 복구
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const scrollToHashWithOffset = (hash: string) => {
    const target = document.getElementById(hash);
    if (!target) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const pageOffsetTopVar = rootStyle
      .getPropertyValue("--page-offset-top")
      .trim();
    const pageOffsetTopPx = Number.parseFloat(pageOffsetTopVar) || 0;

    const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
    const nextTop = Math.max(0, absoluteTop - pageOffsetTopPx);

    window.scrollTo({ top: nextTop, behavior: "smooth" });
  };

  useEffect(() => {
    const applyHashOffset = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      // Wait for route/content paint before measuring target position.
      window.setTimeout(() => scrollToHashWithOffset(hash), 120);
    };

    applyHashOffset();
    window.addEventListener("hashchange", applyHashOffset);

    return () => {
      window.removeEventListener("hashchange", applyHashOffset);
    };
  }, [pathname, deviceType]);

  const handleHeaderLinkClick = (href: string) => {
    setIsHovered(false);
    setHoveredMenu(null);
    setIsMenuOpen(false);
    setExpandedMobileMenus([]);

    const pathOnly = toPathOnly(href);
    const hasHash = href.includes("#");
    const hash = hasHash ? href.split("#")[1] : null;
    const isSamePath = pathname.startsWith(pathOnly);

    if (hasHash && pathname.startsWith(pathOnly) && hash) {
      // 같은 페이지 내 hash 이동: 메뉴가 닫힌 뒤 수동 스크롤
      setTimeout(() => {
        scrollToHashWithOffset(hash);
      }, 80);
      return;
    }

    if (!isSamePath) {
      setIsRouteNavigating(true);
    }

    if (!hasHash && pathname.startsWith(pathOnly)) {
      router.refresh();
    }
  };

  const routeLoadingOverlay = isRouteNavigating ? (
    <div className="pointer-events-none fixed inset-0 z-120 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
      <div className="h-[4.2rem] w-[4.2rem] animate-spin rounded-full border-[0.35rem] border-white/25 border-t-point-light" />
    </div>
  ) : null;

  if (!isPC) {
    return (
      <>
        <header
          className={`
          ${STYLE.headerMobile} 
          ${isMenuOpen ? "fixed inset-0 h-[100dvh] flex flex-col bg-point" : "bg-linear-to-b from-[#767676] to-transparent"}
        `}
        >
          {/* 1. 상단 로고 & 버튼 영역 (높이 고정) */}
          <div
            className={`${STYLE.mobileTopRow} shrink-0`}
            style={{ height: mobileHeaderHeight }}
          >
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image
                src={BRAND_DATA.logoSrc}
                alt={BRAND_DATA.logoAlt}
                width={120}
                height={24}
                priority
                className={STYLE.logo}
              />
            </Link>

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
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {/* 햄버거 버튼 라인들... (기존과 동일) */}
                <span
                  className={STYLE.menuToggleLine}
                  style={{
                    transform: isMenuOpen
                      ? "rotate(45deg)"
                      : "translateY(-6px)",
                  }}
                />
                <span
                  className={STYLE.menuToggleLine}
                  style={{ opacity: isMenuOpen ? 0 : 1 }}
                />
                <span
                  className={STYLE.menuToggleLine}
                  style={{
                    transform: isMenuOpen
                      ? "rotate(-45deg)"
                      : "translateY(6px)",
                  }}
                />
              </button>
            </div>
          </div>

          {/* 2. 메뉴 패널 영역 (나머지 높이 차지 + 내부 스크롤) */}
          {isMenuOpen && (
            <nav className="flex-1 overflow-y-auto pb-[2rem] overscroll-contain">
              <div className={STYLE.mobileMenuPanel}>
                {NAVIGATION_MENU.map((menu, index) => {
                  const hasSubmenus = menu.submenus.length > 0;
                  const isExpanded =
                    hasSubmenus && expandedMobileMenus.includes(index);

                  return (
                    <div key={menu.title}>
                      {/* 메뉴 아이템 렌더링... (기존과 동일) */}
                      {hasSubmenus ? (
                        <button
                          type="button"
                          className={STYLE.mobileMenuItemButton}
                          onClick={() =>
                            setExpandedMobileMenus((prev) =>
                              prev.includes(index)
                                ? prev.filter((i) => i !== index)
                                : [...prev, index],
                            )
                          }
                        >
                          <span>{menu.title}</span>
                          <span
                            className={STYLE.mobileMenuChevron}
                            style={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
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
                              key={sub.href}
                              href={sub.href}
                              className={STYLE.mobileSubmenuItem}
                              onClick={() => handleHeaderLinkClick(sub.href)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          )}
        </header>
        {routeLoadingOverlay}
      </>
    );
  }

  return (
    <>
      <header
        className={STYLE.headerPC}
        style={{ height: HEADER_HEIGHTS_CSS.PC }}
        onMouseEnter={() => canHoverMenu && setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredMenu(null);
        }}
      >
        <div
          className={`${STYLE.gradientBase} ${STYLE.gradientColor(isHovered && canHoverMenu)}`}
          style={{ height: totalHeight }}
        />

        <Link href="/">
          <Image
            src={BRAND_DATA.logoSrc}
                alt={BRAND_DATA.logoAlt}
            width={120}
            height={24}
            priority
            className={STYLE.logo}
          />
        </Link>

        <nav className={STYLE.nav}>
          {NAVIGATION_MENU.map((menu, index) => (
            <div
              key={menu.title}
              className={STYLE.menuWrap}
              onMouseEnter={() =>
                canHoverMenu &&
                menu.submenus.length > 0 &&
                setHoveredMenu(index)
              }
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link
                href={menu.href}
                className={STYLE.menuItem(
                  activatedMenu === menu.title,
                  hoveredMenu === index,
                )}
                onClick={() => handleHeaderLinkClick(menu.href)}
              >
                {menu.title}
              </Link>

              {menu.submenus.length > 0 &&
                hoveredMenu === index &&
                isHovered &&
                canHoverMenu && (
                  <div className={STYLE.submenu}>
                    {menu.submenus.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={STYLE.submenuItem}
                        onClick={() => handleHeaderLinkClick(sub.href)}
                      >
                        {sub.label}
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
      {routeLoadingOverlay}
    </>
  );
}
