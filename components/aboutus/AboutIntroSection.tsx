import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import SectionTitle from "@/components/sections/common/SectionTitle";
import {
  ABOUT_PAGE_STYLE,
  ANCHOR_PADDING_TOP,
  INTRO_REVEAL,
} from "@/lib/constants/aboutPage";

const INTRO_ROWS = [
  {
    rowClassName: ABOUT_PAGE_STYLE.introRow,
    imageClassName: ABOUT_PAGE_STYLE.imageCircleWrap,
    imageSrc: "/images/about-us/about-photo-1.webp",
    imageAlt: "독창적인 발상",
    imageWidth: 500,
    imageHeight: 500,
    title: (
      <>
        <span>
          <span className={ABOUT_PAGE_STYLE.hlPoint}>독창적인 발상</span>으로
        </span>
        <span>
          일상에{" "}
          <span className={ABOUT_PAGE_STYLE.hlWhite}>기적 같은 변화</span>
          를.
        </span>
      </>
    ),
    body: (
      <>
        MIRACLE은 남들과는 조금 다른 시선과 상상력으로,
        <br />
        평범한 하루 속에서도 기적 같은 변화를 함께 발견해 나가는 브랜드입니다.
        <br />
        우리는 거창한 순간보다, 매일 반복되는 일상 속에 숨어 있는 작은 가능성에
        주목합니다.
        <br />
        <br />
        익숙한 장면 속에서도 새로운 의미를 발견하는 당신의 섬세한 감각처럼,
        <br />
        MIRACLE 역시 세상을 조금 더 넓고 다채롭게 바라보는 방법을 고민합니다.
        <br />
        <br />
        작은 변화가 쌓여 결국 큰 차이를 만든다는 믿음으로,
        <br />
        당신의 하루에 자연스럽게 스며드는 경험을 만들어 갑니다.
      </>
    ),
  },
  {
    rowClassName: ABOUT_PAGE_STYLE.introRowReverse,
    imageClassName: ABOUT_PAGE_STYLE.imageRectWrap,
    imageSrc: "/images/about-us/about-photo-2.webp",
    imageAlt: "MING 기적",
    imageWidth: 600,
    imageHeight: 400,
    title: (
      <>
        <span>
          MING: <span className={ABOUT_PAGE_STYLE.hlPoint}>기적</span>
        </span>
      </>
    ),
    body: (
      <>
        우리의 매일에는 재밌는 발견이 있습니다.
        <br />
        빈둥거리다 보면 시간이 너무나도 빠르게 지나기 때문입니다.
        <br />
        이런 경우 우리는 믿을 수 없는 경험을 한듯한 기분을 느끼게 됩니다.
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
      </>
    ),
  },
  {
    rowClassName: ABOUT_PAGE_STYLE.introRow,
    imageClassName: ABOUT_PAGE_STYLE.imageRectWrap,
    imageSrc: "/images/about-us/about-photo-3.webp",
    imageAlt: "고양이는 귀엽습니다",
    imageWidth: 600,
    imageHeight: 400,
    title: (
      <>
        <span>
          <span className={ABOUT_PAGE_STYLE.hlPoint}>고양이</span>는 귀엽습니다
        </span>
      </>
    ),
    body: (
      <>
        고양이는 진짜 귀엽습니다.
        <br />
        고양이는 매일 무슨 생각을 할까요?
        <br />
        그것은 알기 어렵지만 확실한 것은 고양이는 진짜 귀엽습니다.
        <br />
        우리는 고양이를 사랑합니다. 고양이는 귀엽기 때문입니다.
      </>
    ),
  },
] as const;

export default function AboutIntroSection() {
  return (
    <section id="company" style={{ paddingTop: ANCHOR_PADDING_TOP }}>
      <ScrollReveal
        className={ABOUT_PAGE_STYLE.titleWrap}
        delayMs={0}
        durationMs={INTRO_REVEAL.durationMs}
        threshold={INTRO_REVEAL.threshold}
        rootMargin={INTRO_REVEAL.rootMargin}
        hiddenClassName={INTRO_REVEAL.titleHiddenClassName}
        visibleClassName={INTRO_REVEAL.visibleClassName}
      >
        <SectionTitle title="ABOUT US" color="white" />
      </ScrollReveal>

      <div className={ABOUT_PAGE_STYLE.introList}>
        {INTRO_ROWS.map((row, rowIndex) => (
          <div key={row.imageSrc} className={row.rowClassName}>
            <ScrollReveal
              className={ABOUT_PAGE_STYLE.textCol}
              delayMs={
                INTRO_REVEAL.baseDelayMs + INTRO_REVEAL.rowStepMs * rowIndex
              }
              durationMs={INTRO_REVEAL.durationMs}
              threshold={INTRO_REVEAL.threshold}
              rootMargin={INTRO_REVEAL.rootMargin}
              hiddenClassName={INTRO_REVEAL.hiddenClassName}
              visibleClassName={INTRO_REVEAL.visibleClassName}
            >
              <h2 className={ABOUT_PAGE_STYLE.titleBlock}>{row.title}</h2>
              <p className={ABOUT_PAGE_STYLE.desc}>{row.body}</p>
            </ScrollReveal>

            <ScrollReveal
              className={row.imageClassName}
              delayMs={
                INTRO_REVEAL.baseDelayMs +
                INTRO_REVEAL.rowStepMs * rowIndex +
                INTRO_REVEAL.innerStepMs
              }
              durationMs={INTRO_REVEAL.durationMs}
              threshold={INTRO_REVEAL.threshold}
              rootMargin={INTRO_REVEAL.rootMargin}
              hiddenClassName={INTRO_REVEAL.hiddenClassName}
              visibleClassName={INTRO_REVEAL.visibleClassName}
            >
              {/* 이미지를 감싸는 부모 컨테이너 */}
              <div
                className={row.imageClassName} // <-- 여기서 데이터에 있는 클래스를 사용!
                style={{
                  position: "relative",
                  width: "100%",
                  // 이미지 로딩 전에도 자리를 딱 차지하게 만드는 마법의 속성
                  aspectRatio: `${row.imageWidth} / ${row.imageHeight}`,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={row.imageSrc}
                  alt={row.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={rowIndex === 0}
                />
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}
