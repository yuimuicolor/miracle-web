import type { ReactNode } from "react";

type SectionHeadingProps = {
  headingEn: string;
  headingKo: string;
  description: string;
};

export const SECTION_REVEAL_EFFECT = {
  hiddenClassName: "opacity-0 -translate-x-[2.4rem] blur-[6px]",
  visibleClassName: "opacity-100 translate-x-0 blur-0",
} as const;

export const ANCHOR_PADDING_TOP = "var(--page-offset-top)";
export const HISTORY_STAGGER_MS = 110;
export const MARQUEE_REPEAT_COUNT = 4;

export const INTRO_REVEAL = {
  baseDelayMs: 70,
  rowStepMs: 120,
  innerStepMs: 110,
  durationMs: 840,
  threshold: 0.2,
  rootMargin: "0px 0px 6% 0px",
  hiddenClassName: "opacity-0 -translate-x-[3.2rem] blur-[8px]",
  visibleClassName: "opacity-100 translate-x-0 blur-0",
  titleHiddenClassName: "opacity-0 -translate-x-[2.8rem] blur-[8px]",
} as const;

export const SECTION_REVEAL = {
  durationMs: 820,
  threshold: 0.16,
  rootMargin: "0px 0px 10% 0px",
} as const;

export const ABOUT_PAGE_STYLE = {
  main: `
    no-header-offset
    box-border flex min-h-screen w-full flex-col overflow-x-hidden bg-bg-dark text-white
    gap-[6rem]
    px-[1.6rem]
    md:px-[4rem]
    lg:gap-[10rem] lg:px-[8rem]
  `,
  titleWrap: `
    mb-[6rem]
    md:mb-[8rem]
    lg:mb-[10rem]
  `,
  introList: `
    flex flex-col
    gap-[6rem]
    lg:gap-[10rem]
  `,
  introRow: `
    flex flex-col items-start
    gap-[4rem]
    xl:flex-row xl:items-center xl:justify-between xl:gap-[4rem]
  `,
  introRowReverse: `
    flex flex-col items-start
    gap-[4rem]
    xl:flex-row-reverse xl:items-center xl:justify-between xl:gap-[4rem]
  `,
  textCol: `
    flex w-full min-w-0 flex-col
    gap-[4rem]
    xl:w-auto xl:max-w-[72rem] xl:shrink-0
  `,
  titleBlock: `
    flex flex-col
    gap-[0.8rem]
    font-noto font-bold tracking-[-0.03em] text-white
    text-[3.2rem] leading-[1.5]
    md:text-[4.8rem]
    lg:gap-[2rem] lg:text-[5.6rem] lg:leading-[1.3]
  `,
  hlPoint: "bg-point text-white px-[0.6rem]",
  hlWhite: "bg-white text-point px-[0.6rem]",
  desc: `
    font-noto tracking-[-0.05em] text-white
    text-[1.8rem] leading-[1.5]
    md:text-[1.8rem]
    lg:text-[2rem]
  `,
  imageCircleWrap: `
    self-end shrink-0 overflow-hidden rounded-full
    w-full aspect-square
    md:w-[40rem] md:aspect-square
    xl:self-auto xl:shrink xl:min-w-0 xl:w-full xl:max-w-[50rem] xl:aspect-square
  `,
  imageRectWrap: `
    self-end shrink-0 overflow-hidden rounded-full
    w-full aspect-[3/2]
    md:w-[60rem] md:aspect-[8/5]
    xl:self-auto xl:shrink xl:min-w-0 xl:w-full xl:max-w-[60rem] xl:aspect-[3/2]
  `,
  imageObj: "w-full h-full object-cover",
  marqueeSection: `
    w-full overflow-hidden
    py-[2rem]
    lg:py-[3rem]
  `,
  marqueeTrack: `
    flex w-max min-w-full items-center whitespace-nowrap animate-marquee
  `,
  marqueeSet: "flex shrink-0 items-center",
  marqueeChunk: `
    inline-block shrink-0 align-middle
    font-playwrite font-extralight text-white/80
    pt-[0.08em] pb-[0.18em] pr-[0.8rem] align-middle
    text-[4rem] leading-[1] tracking-[-0.01em]
    lg:text-[8rem] lg:leading-[1]
  `,
  historySection: "w-full",
  sectionHeading: `
    mb-[3.2rem] text-center
    md:mb-[6rem]
    lg:mb-[12rem]
  `,
  sectionHeadingEn: `
    font-noto font-medium uppercase tracking-[0.2em] text-white/80
    text-[1.4rem] leading-[130%]
    lg:text-[2.2rem]
  `,
  sectionHeadingKr: `
    mt-[1.2rem] inline-block bg-point px-3 py-1
    font-noto font-bold tracking-[-0.03em]
    text-[3.4rem] leading-[150%]
    md:text-[4.8rem]
    lg:text-[5.6rem]
  `,
  sectionHeadingDesc: `
    mt-[1.6rem]
    font-noto font-normal tracking-[-0.05em] text-white/70
    text-[1.8rem] leading-[150%]
    md:text-[1.8rem]
    lg:text-[2rem]
  `,
  historyRows: `
    flex w-full flex-col items-center
    gap-[4rem]
    xl:items-stretch xl:gap-[20rem]
  `,
  historyRow: `
    flex w-full max-w-[44rem] flex-col items-start
    gap-[4rem]
    xl:max-w-none xl:flex-row xl:items-center xl:gap-0
  `,
  historyRowOdd: "",
  historyRowEven: "",
  historyCard: `
    flex shrink-0 items-stretch
    gap-[2rem]
    xl:min-w-0 xl:shrink
  `,
  historyImageWrap: `relative h-[20rem] w-[15rem] shrink-0 overflow-hidden
    md:h-[26rem] md:w-[20rem]
    xl:h-auto xl:w-[28rem] xl:max-w-[28rem] xl:aspect-[280/373] xl:min-w-0 xl:shrink
  `,
  historyImage: "object-cover",
  historyTextCol: `
    flex min-w-0 flex-col items-start justify-between
    text-left
    xl:shrink-0
  `,
  historyYear: `inline-block px-[0.8rem] py-[0.2rem] font-gilda font-normal tracking-[-0.05em]
    text-[3.2rem] leading-[120%]
    md:text-[4rem]
    xl:px-[1rem] xl:py-[0.3rem] xl:text-[5.6rem]
  `,
  historyYearOdd: "bg-white text-point",
  historyYearEven: "bg-point text-white",
  historyMetaWrap: "mt-auto flex flex-col gap-[0.4rem]",
  historyDate: `
    font-noto font-medium tracking-[0.2em] text-white/80
    text-[1.2rem] leading-[130%]
    md:text-[1.8rem]
    xl:text-[2.2rem]
  `,
  historyTitle: `
    font-noto font-medium tracking-[-0.05em] text-white
    text-[1.8rem] leading-[150%]
    md:text-[2.4rem] md:leading-[100%]
    xl:text-[2.4rem] xl:leading-[100%]
  `,
  historyRowDividerBase: `
    hidden h-px min-w-0 flex-1 self-center origin-left bg-white/35
    xl:block
  `,
  historyCardGap: "hidden xl:block w-[8rem] shrink-0",
  historyDividerGap: "hidden xl:block w-[4rem] shrink-0",
  certificateGrid: `
    grid grid-cols-2
    gap-3
    sm:grid-cols-3
    lg:grid-cols-5
  `,
  certificateCard: "relative overflow-hidden",
  certificateImageRatio: "aspect-[3/4]",
  certificateCaption:
    "absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent",
  certificateTitle: "font-noto text-[1rem] text-white/85",
  certificateDesc: "font-noto text-white/95 text-[1.2rem]",
  ceoSection: `
    flex w-full flex-col items-start
    gap-[6rem]
    lg:flex-row lg:items-start lg:justify-between lg:gap-[4rem]
  `,
  ceoCopyCol: `
    flex flex-col items-start gap-[2rem]
    lg:w-fit lg:shrink-0 lg:gap-[4rem]
  `,
  ceoEnLabel: `
    font-noto font-medium uppercase tracking-[0.24em] text-white/80
    text-[1.4rem] leading-[130%]
    lg:text-[2rem]
  `,
  ceoTitle: `
    font-gilda tracking-[-0.03em] text-white
    text-[5.2rem] leading-[100%]
    lg:text-[7.2rem]
  `,
  ceoBar: "h-[0.4rem] w-[14rem] rounded-full bg-white",
  ceoNameWrap: "font-noto",
  ceoNameText: `
    inline-block bg-point px-[0.8rem] py-[0.2rem]
    text-[3.2rem] leading-[130%] tracking-[-0.03em] text-white
    lg:text-[3.6rem]
  `,
  ceoDescription: `
    whitespace-pre-line
    font-noto text-white/90 tracking-[-0.05em]
    text-[1.8rem] leading-[150%]
    lg:text-[2.2rem]
  `,
  ceoDecor: `
    font-gilda text-point-light tracking-[0.06em]
    text-[5.2rem] leading-none
    lg:text-[6.2rem]
  `,
  ceoSNSChannelsWrap: `
    flex items-center
    gap-[2rem]
  `,
  ceoSNSChannelsLink: `
    inline-flex h-[6rem] w-[6rem] items-center justify-center
    transition-transform duration-200 hover:scale-[1.04]
  `,
  ceoSnsIconWrap: "relative h-[6rem] w-[6rem]",
  ceoSnsIconBase:
    "absolute h-[6rem] w-[6rem] transition-opacity duration-300 ease-out group-hover:opacity-0",
  ceoSnsIconHover:
    "absolute h-[6rem] w-[6rem] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100",
  ceoPhotoWrap: `
    relative w-full max-w-[70rem] overflow-hidden bg-black/10
    aspect-square
  `,
  ceoPhoto: "w-full h-full object-cover",
} as const;

export function SectionHeading({
  headingEn,
  headingKo,
  description,
}: SectionHeadingProps) {
  return (
    <>
      <p className={ABOUT_PAGE_STYLE.sectionHeadingEn}>{headingEn}</p>
      <h3 className={ABOUT_PAGE_STYLE.sectionHeadingKr}>{headingKo}</h3>
      <p className={ABOUT_PAGE_STYLE.sectionHeadingDesc}>{description}</p>
    </>
  );
}

export function renderMultilineText(text: string): ReactNode {
  return text.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}