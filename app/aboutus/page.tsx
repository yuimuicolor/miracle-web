import Image from "next/image";
import SectionTitle from "@/components/sections/common/SectionTitle";
import { ABOUT_PAGE_CONTENT } from "@/lib/aboutPageData";

const STYLE = {
  main: `
		min-h-screen bg-bg-dark text-white flex flex-col
		gap-[6rem] lg:gap-[10rem]
		px-[1.6rem] md:px-[4rem] lg:px-[8rem]
	`,

  // ── Intro section ─────────────────────────────────────────────────────
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
  textCol:
    "flex w-full min-w-0 flex-col gap-[4rem] xl:w-auto xl:max-w-[72rem] xl:shrink-0",
  titleBlock: `
		flex flex-col
		gap-[0.8rem] font-noto font-bold tracking-[-0.03em] text-white
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

  // ── Marquee ────────────────────────────────────────────────────────────
  marqueeSection: `w-full`,

  marqueeTrack: "flex whitespace-nowrap animate-marquee",
  marqueeChunk: `
		font-playwrite font-extralight shrink-0 text-white/80
		text-[4rem] leading-none tracking-[-0.01em]
		pr-[5rem]
		lg:text-[8rem] lg:pr-[10rem]
	`,

  // ── History / Certs / CEO (기존 유지) ──────────────────────────────────
  sectionBase: "max-w-[80rem] mx-auto",
  sectionGapTop: "mt-28",
  sectionHeading: "text-center mb-12",
  sectionHeadingEn: "font-noto tracking-[0.32em] text-white/80 text-[1.2rem]",
  sectionHeadingKr:
    "font-noto font-bold inline-block bg-point px-3 py-1 mt-2 text-[2.4rem]",
  sectionHeadingDesc: "font-noto text-white/70 mt-3 text-[1.4rem]",
  historyGrid: "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3",
  historyCard: "relative",
  historyImageWrap: "w-full h-[16.25rem] overflow-hidden",
  historyImage: "w-full h-full object-cover",
  historyYear:
    "absolute top-3 right-3 text-point bg-white/95 px-2 py-1 font-noto font-bold leading-none text-[1.4rem]",
  historyMetaWrap: "mt-3",
  historyDate: "font-noto text-white/80 text-[1.2rem]",
  historyTitle: "font-noto font-bold text-[1.4rem]",
  certificateGrid: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
  certificateCard: "relative overflow-hidden",
  certificateImageRatio: "aspect-[3/4]",
  certificateCaption:
    "absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent",
  certificateTitle: "font-noto text-[1rem] text-white/85",
  certificateDesc: "font-noto text-white/95 text-[1.2rem]",
  ceoSection: `
		mx-auto mt-28 grid max-w-[80rem] grid-cols-1 items-end gap-10
		lg:grid-cols-[22.5rem_1fr]
	`,
  ceoEnLabel: "font-noto tracking-[0.28em] text-white/80 text-[1.2rem]",
  ceoTitle: "font-gilda mt-2 text-[4rem] lg:text-[6rem]",
  ceoBar: "w-28 h-[0.1875rem] bg-white mt-4",
  ceoNameWrap: "font-noto mt-5 text-[1.6rem]",
  ceoNameText: "bg-point px-2 py-1",
  ceoDescription:
    "mt-5 font-noto leading-[1.6] text-white/80 whitespace-pre-line text-[1.4rem]",
  ceoSocialWrap: "flex gap-3 mt-8",
  ceoSocialButton:
    "w-9 h-9 rounded-full border border-white/60 font-noto text-white/90 text-[1.2rem]",
  ceoVisualWrap: "h-[26.25rem] w-full overflow-hidden sm:h-[35rem]",
  ceoVisual: "w-full h-full object-cover",
};

const MARQUEE_TEXT = "Trust  Integrity  Reliability  Transformation";

export default function AboutUsPage() {
  const { history, certificates, ceo } = ABOUT_PAGE_CONTENT;

  return (
    <main className={STYLE.main}>
      {/* ── About US 인트로 ─────────────────────────────── */}
      <section>
        <div className={STYLE.titleWrap}>
          <SectionTitle title="ABOUT US" color="white" />
        </div>

        <div className={STYLE.introList}>
          {/* Row 1: 텍스트 왼쪽 · 원형 이미지 오른쪽 */}
          <div className={STYLE.introRow}>
            <div className={STYLE.textCol}>
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
            </div>
            <div className={STYLE.imageCircleWrap}>
              <Image
                src="/images/about-us/about-photo-1.webp"
                alt="독창적인 발상"
                width={500}
                height={500}
                className={STYLE.imageObj}
              />
            </div>
          </div>

          {/* Row 2: 직사각 이미지 왼쪽 · 텍스트 오른쪽 */}
          <div className={STYLE.introRowReverse}>
            <div className={STYLE.textCol}>
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
            </div>
            <div className={STYLE.imageRectWrap}>
              <Image
                src="/images/about-us/about-photo-2.webp"
                alt="MING 기적"
                width={600}
                height={400}
                className={STYLE.imageObj}
              />
            </div>
          </div>

          {/* Row 3: 텍스트 왼쪽 · 직사각 이미지 오른쪽 */}
          <div className={STYLE.introRow}>
            <div className={STYLE.textCol}>
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
            </div>
            <div className={STYLE.imageRectWrap}>
              <Image
                src="/images/about-us/about-photo-3.webp"
                alt="고양이는 귀엽습니다"
                width={600}
                height={400}
                className={STYLE.imageObj}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 마키 레터링 ──────────────────────────────────── */}
      <div className={STYLE.marqueeSection}>
        <div className={STYLE.marqueeTrack} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={STYLE.marqueeChunk}>
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      <section className={`${STYLE.sectionBase} ${STYLE.sectionGapTop}`}>
        <div className={STYLE.sectionHeading}>
          <p className={STYLE.sectionHeadingEn}>{history.headingEn}</p>
          <h3 className={STYLE.sectionHeadingKr}>{history.headingKo}</h3>
          <p className={STYLE.sectionHeadingDesc}>{history.description}</p>
        </div>

        <div className={STYLE.historyGrid}>
          {history.items.map((item) => (
            <article
              key={`${item.year}-${item.date}`}
              className={STYLE.historyCard}
            >
              <div className={STYLE.historyImageWrap}>
                <img
                  src={`/images/about-us/history-${history.items.indexOf(item) + 1}.webp`}
                  alt={item.title}
                  className={STYLE.historyImage}
                />
              </div>
              <span className={STYLE.historyYear}>{item.year}</span>
              <div className={STYLE.historyMetaWrap}>
                <p className={STYLE.historyDate}>{item.date}</p>
                <p className={STYLE.historyTitle}>{item.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${STYLE.sectionBase} ${STYLE.sectionGapTop}`}>
        <div className={STYLE.sectionHeading}>
          <p className={STYLE.sectionHeadingEn}>{certificates.headingEn}</p>
          <h3 className={STYLE.sectionHeadingKr}>{certificates.headingKo}</h3>
          <p className={STYLE.sectionHeadingDesc}>{certificates.description}</p>
        </div>

        <div className={STYLE.certificateGrid}>
          {certificates.items.map((cert) => (
            <article key={cert.id} className={STYLE.certificateCard}>
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
            </article>
          ))}
        </div>
      </section>

      <section className={STYLE.ceoSection}>
        <div>
          <p className={STYLE.ceoEnLabel}>{ceo.label}</p>
          <h3 className={STYLE.ceoTitle}>{ceo.title}</h3>
          <div className={STYLE.ceoBar} />
          <p className={STYLE.ceoNameWrap}>
            <span className={STYLE.ceoNameText}>{ceo.name}</span>
          </p>
          <p className={STYLE.ceoDescription}>{ceo.description}</p>

          <div className={STYLE.ceoSocialWrap}>
            {ceo.socialChannels.map((channel) => (
              <button key={channel} className={STYLE.ceoSocialButton}>
                {channel}
              </button>
            ))}
          </div>
        </div>

        <div className={STYLE.ceoVisualWrap}>
          <img
            src="/images/about-us/ceo-photo.webp"
            alt={ceo.imageAlt}
            className={STYLE.ceoVisual}
          />
        </div>
      </section>
    </main>
  );
}
