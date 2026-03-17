import { FOOTER_DATA } from "@/lib/footerData";

// 데스크탑/태블릿에서는 5개 항목을 3줄로 나눠서 보여주기 위한 인덱스 배열
const DESKTOP_ROW_INDEXES = [
  [0, 1],
  [2],
  [3, 4],
] as const;

const getDesktopRows = () =>
  DESKTOP_ROW_INDEXES.map((row) =>
    row
      .map((index) => FOOTER_DATA.items[index])
      .filter(Boolean)
  );

const STYLE = {
  root: "w-full border-t border-white/10 bg-[#4a4a4a] text-white/90 min-h-[43rem] md:h-[40rem] lg:h-[45rem]",
  inner: "flex min-h-[43rem] w-full flex-col justify-center gap-[3.2rem] px-[1.6rem] py-[3.2rem] md:h-full md:px-[4rem] md:py-0 lg:gap-[4rem] lg:px-[8rem]",
  logo: 'h-[2.4rem]',
  desktopInfoWrap: "hidden flex-col gap-[1.2rem] text-[1.6rem] md:flex",
  desktopRow: "flex flex-wrap items-center gap-x-[3rem]",
  desktopItem: "flex items-center gap-[0.8rem]",
  desktopLabel: "text-white/70",
  desktopValue: "text-white",
  mobileInfoWrap: "flex flex-col gap-[1.2rem] text-[1.6rem] md:hidden",
  mobileItem: "flex items-start justify-start gap-[0.8rem]",
  mobileLabel: "text-white/70",
  mobileValue: "text-white",
  policy: "text-[1.6rem] text-white/70 underline decoration-white/40 underline-offset-2",
};

export default function Footer() {
  const desktopRows = getDesktopRows();

  const renderInfoItem = (label: string, value: string, mobile = false) => (
    <div key={label} className={mobile ? STYLE.mobileItem : STYLE.desktopItem}>
      <span className={mobile ? STYLE.mobileLabel : STYLE.desktopLabel}>{label}</span>
      <span className={mobile ? STYLE.mobileValue : STYLE.desktopValue}>{value}</span>
    </div>
  );

  return (
    <footer className={STYLE.root}>
      <div className={STYLE.inner}>
        <div>
          <img
          src={FOOTER_DATA.logoSrc}
          alt={FOOTER_DATA.logoAlt}
          className={STYLE.logo}
        />
        </div>

        <div className={STYLE.desktopInfoWrap}>
          {desktopRows.map((row, rowIndex) => (
            <div key={rowIndex} className={STYLE.desktopRow}>
              {row.map((item) => renderInfoItem(item.label, item.value))}
            </div>
          ))}
        </div>

        <div className={STYLE.mobileInfoWrap}>
          {FOOTER_DATA.items.map((item) => renderInfoItem(item.label, item.value, true))}
        </div>

        <p className={STYLE.policy}>{FOOTER_DATA.policyText}</p>
      </div>
    </footer>
  );
}
