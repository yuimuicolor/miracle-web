import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import SectionTitle from "@/components/sections/common/SectionTitle";
import { ABOUT_PAGE_CONTENT } from "@/lib/aboutPageData";
import { STORE_DATA } from "@/lib/siteData";

const STYLE = {
  // ============================================================
  // Page Shell
  // ============================================================
  main: `
    box-border flex min-h-screen w-full flex-col overflow-x-hidden bg-bg-dark text-white
    gap-[6rem]
    px-[1.6rem]
    md:px-[4rem]
    lg:gap-[10rem] lg:px-[8rem]
  `,

  // ============================================================
  // Intro Section
  // ============================================================
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
    text-[1.6rem] leading-[1.5]
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

  // ============================================================
  // Marquee Section
  // ============================================================
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

  // ============================================================
  // History Section
  // ============================================================
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
    text-[1.6rem] leading-[150%]
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

  // ============================================================
  // Certificate Section
  // ============================================================
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

  // ============================================================
  // CEO Section
  // ============================================================
  ceoSection: `
    flex w-full flex-col items-start
    gap-[6rem]
    lg:flex-row lg:items-start lg:justify-between lg:gap-[4rem]
  `,
  ceoCopyCol: `
    flex flex-col items-start gap-[2rem]
    lg:w-fit lg:shrink-0 lg: gap-[4rem]
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
};

const MARQUEE_TEXT = " Trust Integrity Reliability Transformation ";
const MARQUEE_REPEAT_COUNT = 4;
const ANCHOR_PADDING_TOP = "var(--page-offset-top)";

export default function AboutUsPage() {
  const { history, certificates, ceo } = ABOUT_PAGE_CONTENT;
  const ceoSnsMap = {
    IG: STORE_DATA.sns.instagram,
    YT: STORE_DATA.sns.youtube,
    X: STORE_DATA.sns.x,
  } as const;
  const INTRO_BASE_DELAY_MS = 70;
  const INTRO_ROW_STEP_MS = 120;
  const INTRO_INNER_STEP_MS = 110;
  const INTRO_DURATION_MS = 840;
  const INTRO_THRESHOLD = 0.2;
  const INTRO_ROOT_MARGIN = "0px 0px 6% 0px";
  const SECTION_DURATION_MS = 820;
  const SECTION_THRESHOLD = 0.16;
  const SECTION_ROOT_MARGIN = "0px 0px 10% 0px";
  const historyRows = Array.from(
    { length: Math.ceil(history.items.length / 2) },
    (_, rowIndex) => history.items.slice(rowIndex * 2, rowIndex * 2 + 2),
  );

  return (
    <main className={STYLE.main}>
      {/* ==================== Intro Section ==================== */}
      <section id="company" style={{ paddingTop: ANCHOR_PADDING_TOP }}>
        <ScrollReveal
          className={STYLE.titleWrap}
          delayMs={0}
          durationMs={INTRO_DURATION_MS}
          threshold={INTRO_THRESHOLD}
          rootMargin={INTRO_ROOT_MARGIN}
          hiddenClassName="opacity-0 -translate-x-[2.8rem] blur-[8px]"
          visibleClassName="opacity-100 translate-x-0 blur-0"
        >
          <SectionTitle title="ABOUT US" color="white" />
        </ScrollReveal>

        <div className={STYLE.introList}>
          {/* Row 1: 텍스트 왼쪽 · 원형 이미지 오른쪽 */}
          <div className={STYLE.introRow}>
            <ScrollReveal
              className={STYLE.textCol}
              delayMs={INTRO_BASE_DELAY_MS + INTRO_ROW_STEP_MS * 0}
              durationMs={INTRO_DURATION_MS}
              threshold={INTRO_THRESHOLD}
              rootMargin={INTRO_ROOT_MARGIN}
              hiddenClassName="opacity-0 -translate-x-[3.2rem] blur-[8px]"
              visibleClassName="opacity-100 translate-x-0 blur-0"
            >
              <h2 className={STYLE.titleBlock}>
                <span>
                  <span className={STYLE.hlPoint}>독창적인 발상</span>으로
                </span>
                <span>
                  일상에 <span className={STYLE.hlWhite}>기적 같은 변화</span>
                  를.
                </span>
              </h2>
              <p className={STYLE.desc}>
                MIRACLE은 남들과는 조금 다른 시선과 상상력으로,
                <br />
                평범한 하루 속에서도 기적 같은 변화를 함께 발견해 나가는
                브랜드입니다.
                <br />
                우리는 거창한 순간보다, 매일 반복되는 일상 속에 숨어 있는 작은
                가능성에 주목합니다.
                <br />
                <br />
                익숙한 장면 속에서도 새로운 의미를 발견하는 당신의 섬세한
                감각처럼,
                <br />
                MIRACLE 역시 세상을 조금 더 넓고 다채롭게 바라보는 방법을
                고민합니다.
                <br />
                <br />
                작은 변화가 쌓여 결국 큰 차이를 만든다는 믿음으로,
                <br />
                당신의 하루에 자연스럽게 스며드는 경험을 만들어 갑니다.
              </p>
            </ScrollReveal>
            <ScrollReveal
              className={STYLE.imageCircleWrap}
              delayMs={
                INTRO_BASE_DELAY_MS +
                INTRO_ROW_STEP_MS * 0 +
                INTRO_INNER_STEP_MS
              }
              durationMs={INTRO_DURATION_MS}
              threshold={INTRO_THRESHOLD}
              rootMargin={INTRO_ROOT_MARGIN}
              hiddenClassName="opacity-0 -translate-x-[3.2rem] blur-[8px]"
              visibleClassName="opacity-100 translate-x-0 blur-0"
            >
              <Image
                src="/images/about-us/about-photo-1.webp"
                alt="독창적인 발상"
                width={500}
                height={500}
                className={STYLE.imageObj}
              />
            </ScrollReveal>
          </div>

          {/* Row 2: 직사각 이미지 왼쪽 · 텍스트 오른쪽 */}
          <div className={STYLE.introRowReverse}>
            <ScrollReveal
              className={STYLE.textCol}
              delayMs={INTRO_BASE_DELAY_MS + INTRO_ROW_STEP_MS * 1}
              durationMs={INTRO_DURATION_MS}
              threshold={INTRO_THRESHOLD}
              rootMargin={INTRO_ROOT_MARGIN}
              hiddenClassName="opacity-0 -translate-x-[3.2rem] blur-[8px]"
              visibleClassName="opacity-100 translate-x-0 blur-0"
            >
              <h2 className={STYLE.titleBlock}>
                <span>
                  MING: <span className={STYLE.hlPoint}>기적</span>
                </span>
              </h2>
              <p className={STYLE.desc}>
                우리의 매일에는 재밌는 발견이 있습니다.
                <br />
                빈둥거리다 보면 시간이 너무나도 빠르게 지나기 때문입니다.
                <br />
                이런 경우 우리는 믿을 수 없는 경험을 한듯한 기분을 느끼게
                됩니다.
                <br />
                <br />
                “아니, 시간이 이렇게나 지났다고?”
                <br />
                <br />
                하지만 왠지 지루한 시간은 느리게만 지나갑니다.
                <br />
                그럼에도 불구하고 편하고 좋은 시간들은 너무나도 빨리 지나가죠.
                <br />
                <br />
                이것을 우리는 MING:기적, 즉 ‘밍기적’이라고 부르기로 했습니다.
              </p>
            </ScrollReveal>
            <ScrollReveal
              className={STYLE.imageRectWrap}
              delayMs={
                INTRO_BASE_DELAY_MS +
                INTRO_ROW_STEP_MS * 1 +
                INTRO_INNER_STEP_MS
              }
              durationMs={INTRO_DURATION_MS}
              threshold={INTRO_THRESHOLD}
              rootMargin={INTRO_ROOT_MARGIN}
              hiddenClassName="opacity-0 -translate-x-[3.2rem] blur-[8px]"
              visibleClassName="opacity-100 translate-x-0 blur-0"
            >
              <Image
                src="/images/about-us/about-photo-2.webp"
                alt="MING 기적"
                width={600}
                height={400}
                className={STYLE.imageObj}
              />
            </ScrollReveal>
          </div>

          {/* Row 3: 텍스트 왼쪽 · 직사각 이미지 오른쪽 */}
          <div className={STYLE.introRow}>
            <ScrollReveal
              className={STYLE.textCol}
              delayMs={INTRO_BASE_DELAY_MS + INTRO_ROW_STEP_MS * 2}
              durationMs={INTRO_DURATION_MS}
              threshold={INTRO_THRESHOLD}
              rootMargin={INTRO_ROOT_MARGIN}
              hiddenClassName="opacity-0 -translate-x-[3.2rem] blur-[8px]"
              visibleClassName="opacity-100 translate-x-0 blur-0"
            >
              <h2 className={STYLE.titleBlock}>
                <span>
                  <span className={STYLE.hlPoint}>고양이</span>는 귀엽습니다
                </span>
              </h2>
              <p className={STYLE.desc}>
                고양이는 진짜 귀엽습니다.
                <br />
                고양이는 매일 무슨 생각을 할까요?
                <br />
                그것은 알기 어렵지만 확실한 것은 고양이는 진짜 귀엽습니다.
                <br />
                우리는 고양이를 사랑합니다. 고양이는 귀엽기 때문입니다.
              </p>
            </ScrollReveal>
            <ScrollReveal
              className={STYLE.imageRectWrap}
              delayMs={
                INTRO_BASE_DELAY_MS +
                INTRO_ROW_STEP_MS * 2 +
                INTRO_INNER_STEP_MS
              }
              durationMs={INTRO_DURATION_MS}
              threshold={INTRO_THRESHOLD}
              rootMargin={INTRO_ROOT_MARGIN}
              hiddenClassName="opacity-0 -translate-x-[3.2rem] blur-[8px]"
              visibleClassName="opacity-100 translate-x-0 blur-0"
            >
              <Image
                src="/images/about-us/about-photo-3.webp"
                alt="고양이는 귀엽습니다"
                width={600}
                height={400}
                className={STYLE.imageObj}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ==================== Marquee Section ==================== */}
      <ScrollReveal
        className={STYLE.marqueeSection}
        durationMs={SECTION_DURATION_MS}
        threshold={SECTION_THRESHOLD}
        rootMargin={SECTION_ROOT_MARGIN}
        hiddenClassName="opacity-0 -translate-x-[2.4rem] blur-[6px]"
        visibleClassName="opacity-100 translate-x-0 blur-0"
      >
        <div className={STYLE.marqueeTrack} aria-hidden="true">
          {[0, 1].map((setIndex) => (
            <div key={`marquee-set-${setIndex}`} className={STYLE.marqueeSet}>
              {Array.from({ length: MARQUEE_REPEAT_COUNT }).map(
                (_, chunkIndex) => (
                  <span
                    key={`marquee-${setIndex}-${chunkIndex}`}
                    className={STYLE.marqueeChunk}
                  >
                    {MARQUEE_TEXT}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* ==================== History Section ==================== */}
      <section
        id="history"
        className={`${STYLE.historySection}`}
        style={{ paddingTop: ANCHOR_PADDING_TOP }}
      >
        <ScrollReveal
          className={STYLE.sectionHeading}
          durationMs={SECTION_DURATION_MS}
          threshold={SECTION_THRESHOLD}
          rootMargin={SECTION_ROOT_MARGIN}
          hiddenClassName="opacity-0 -translate-x-[2.4rem] blur-[6px]"
          visibleClassName="opacity-100 translate-x-0 blur-0"
        >
          <p className={STYLE.sectionHeadingEn}>{history.headingEn}</p>
          <h3 className={STYLE.sectionHeadingKr}>{history.headingKo}</h3>
          <p className={STYLE.sectionHeadingDesc}>{history.description}</p>
        </ScrollReveal>

        <div className={STYLE.historyRows}>
          {historyRows.map((rowItems, rowIndex) => {
            const isOddRow = rowIndex % 2 === 0;
            const isLastRow = rowIndex === historyRows.length - 1;
            const STAGGER_MS = 110;

            return (
              <div
                key={`history-row-${rowIndex}`}
                className={`${STYLE.historyRow} ${isOddRow ? STYLE.historyRowOdd : STYLE.historyRowEven}`}
              >
                {!isOddRow ? (
                  <ScrollReveal
                    delayMs={0}
                    durationMs={760}
                    threshold={0.12}
                    className={STYLE.historyRowDividerBase}
                    hiddenClassName="opacity-100 scale-x-0"
                    visibleClassName="opacity-100 scale-x-100"
                  />
                ) : null}
                {!isOddRow ? <div className={STYLE.historyDividerGap} /> : null}

                {rowItems.map((item, cardIndex) => (
                  <div key={`${item.year}-${item.date}`} className="contents">
                    <ScrollReveal
                      as="article"
                      delayMs={
                        (isOddRow ? cardIndex : cardIndex + 1) * STAGGER_MS
                      }
                      durationMs={820}
                      className={STYLE.historyCard}
                    >
                      <div className={STYLE.historyImageWrap}>
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          unoptimized
                          sizes="(max-width: 1279px) 15rem, 28rem"
                          className={STYLE.historyImage}
                        />
                      </div>

                      <div className={STYLE.historyTextCol}>
                        <span
                          className={`${STYLE.historyYear} ${isOddRow ? STYLE.historyYearOdd : STYLE.historyYearEven}`}
                        >
                          {item.year}
                        </span>

                        <div className={STYLE.historyMetaWrap}>
                          <p className={STYLE.historyDate}>{item.date}</p>
                          <p className={STYLE.historyTitle}>{item.title}</p>
                        </div>
                      </div>
                    </ScrollReveal>

                    {cardIndex < rowItems.length - 1 ? (
                      <div className={STYLE.historyCardGap} />
                    ) : null}
                  </div>
                ))}

                {isOddRow && !isLastRow ? (
                  <div className={STYLE.historyDividerGap} />
                ) : null}
                {isOddRow && !isLastRow ? (
                  <ScrollReveal
                    delayMs={rowItems.length * STAGGER_MS}
                    durationMs={760}
                    threshold={0.12}
                    className={STYLE.historyRowDividerBase}
                    hiddenClassName="opacity-100 scale-x-0"
                    visibleClassName="opacity-100 scale-x-100"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== Certificate Section ==================== */}
      <section
        id="certificates"
        style={{ paddingTop: ANCHOR_PADDING_TOP }}
      >
        <ScrollReveal
          className={STYLE.sectionHeading}
          durationMs={SECTION_DURATION_MS}
          threshold={SECTION_THRESHOLD}
          rootMargin={SECTION_ROOT_MARGIN}
          hiddenClassName="opacity-0 -translate-x-[2.4rem] blur-[6px]"
          visibleClassName="opacity-100 translate-x-0 blur-0"
        >
          <p className={STYLE.sectionHeadingEn}>{certificates.headingEn}</p>
          <h3 className={STYLE.sectionHeadingKr}>{certificates.headingKo}</h3>
          <p className={STYLE.sectionHeadingDesc}>{certificates.description}</p>
        </ScrollReveal>

        <div className={STYLE.certificateGrid}>
          {certificates.items.map((cert, index) => (
            <ScrollReveal
              key={cert.id}
              as="article"
              className={STYLE.certificateCard}
              delayMs={index * 65}
              durationMs={SECTION_DURATION_MS}
              threshold={SECTION_THRESHOLD}
              rootMargin={SECTION_ROOT_MARGIN}
              hiddenClassName="opacity-0 -translate-x-[2.4rem] blur-[6px]"
              visibleClassName="opacity-100 translate-x-0 blur-0"
            >
              <div className={STYLE.certificateImageRatio}>
                <img
                  src="/images/main-bg.png"
                  alt={cert.title}
                  className={STYLE.imageObj}
                />
              </div>
              <div className={STYLE.certificateCaption}>
                <p className={STYLE.certificateTitle}>{cert.title}</p>
                <p className={STYLE.certificateDesc}>{cert.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ==================== CEO Section ==================== */}
      <section
        id="ceo"
        className={STYLE.ceoSection}
        style={{ paddingTop: ANCHOR_PADDING_TOP }}
      >
        <ScrollReveal
          className={STYLE.ceoCopyCol}
          durationMs={SECTION_DURATION_MS}
          threshold={SECTION_THRESHOLD}
          rootMargin={SECTION_ROOT_MARGIN}
          hiddenClassName="opacity-0 -translate-x-[2.4rem] blur-[6px]"
          visibleClassName="opacity-100 translate-x-0 blur-0"
        >
          <div className="flex flex-col gap-8">
            <p className={STYLE.ceoEnLabel}>{ceo.label}</p>
            <h3 className={STYLE.ceoTitle}>{ceo.title}</h3>
          </div>
          <div className={STYLE.ceoBar} />
          <p className={STYLE.ceoNameWrap}>
            <span className={STYLE.ceoNameText}>{ceo.name}</span>
          </p>
          <p className={STYLE.ceoDescription}>{ceo.description}</p>
          <p className={STYLE.ceoDecor}>***</p>

          <div className={STYLE.ceoSNSChannelsWrap}>
            {ceo.socialChannels.map((channel) => {
              const snsItem = ceoSnsMap[channel as keyof typeof ceoSnsMap];

              if (!snsItem) return null;

              return (
                <a
                  key={channel}
                  href={snsItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${STYLE.ceoSNSChannelsLink} group`}
                  aria-label={snsItem.label}
                >
                  <span className={STYLE.ceoSnsIconWrap}>
                    <Image
                      src={snsItem.iconSrc}
                      alt={snsItem.label}
                      width={60}
                      height={60}
                      className={STYLE.ceoSnsIconBase}
                    />
                    <Image
                      src={snsItem.hoverIconSrc}
                      alt={snsItem.label}
                      width={60}
                      height={60}
                      className={STYLE.ceoSnsIconHover}
                    />
                  </span>
                </a>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal
          className={STYLE.ceoPhotoWrap}
          delayMs={120}
          durationMs={SECTION_DURATION_MS}
          threshold={SECTION_THRESHOLD}
          rootMargin={SECTION_ROOT_MARGIN}
          hiddenClassName="opacity-0 -translate-x-[2.4rem] blur-[6px]"
          visibleClassName="opacity-100 translate-x-0 blur-0"
        >
          <img
            src="/images/about-us/ceo-photo.webp"
            alt={ceo.imageAlt}
            className={STYLE.ceoPhoto}
          />
        </ScrollReveal>
      </section>
    </main>
  );
}
