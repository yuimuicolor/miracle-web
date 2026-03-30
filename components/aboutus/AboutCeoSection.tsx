import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ABOUT_PAGE_STYLE,
  ANCHOR_PADDING_TOP,
  SECTION_REVEAL,
  SECTION_REVEAL_EFFECT,
} from "@/lib/constants/aboutPage";


export default function AboutCeoSection() {
  const ceo = {
    label: "CHIEF EXECUTIVE OFFICER",
    title: "C.E.O",
    name: "김미라 / MIRA KIM",
    description:
      "브랜드 전략과 시각 설계를 연결하며,\n의미 있는 변화가 일어나는 디자인을 만듭니다.\nC.E.O로서 미라클의 방향성을 총괄합니다.",
    sns: {
      instagram: {
        href: "https://www.instagram.com/mira.kim_official",
        label: "Instagram",
        iconSrc: "/images/icon/icon-sns-instagram.png",
        hoverIconSrc: "/images/icon/icon-sns-instagram-hover.png",
      },
      youtube: {
        href: "https://www.youtube.com/@miracle-mira",
        label: "YouTube",
        iconSrc: "/images/icon/icon-sns-youtube.png",
        hoverIconSrc: "/images/icon/icon-sns-youtube-hover.png",
      },
      x: {
        href: "https://twitter.com/mira_kim_official",
        label: "X (Twitter)",
        iconSrc: "/images/icon/icon-sns-x.png",
        hoverIconSrc: "/images/icon/icon-sns-x-hover.png",
      },
    },
    imageAlt: "ceo",
  };


  return (
    <section
      id="ceo"
      className={ABOUT_PAGE_STYLE.ceoSection}
      style={{ paddingTop: ANCHOR_PADDING_TOP }}
    >
      <ScrollReveal
        className={ABOUT_PAGE_STYLE.ceoCopyCol}
        durationMs={SECTION_REVEAL.durationMs}
        threshold={SECTION_REVEAL.threshold}
        rootMargin={SECTION_REVEAL.rootMargin}
        {...SECTION_REVEAL_EFFECT}
      >
        <div className="flex flex-col gap-8">
          <p className={ABOUT_PAGE_STYLE.ceoEnLabel}>{ceo.label}</p>
          <h3 className={ABOUT_PAGE_STYLE.ceoTitle}>{ceo.title}</h3>
        </div>
        <div className={ABOUT_PAGE_STYLE.ceoBar} />
        <p className={ABOUT_PAGE_STYLE.ceoNameWrap}>
          <span className={ABOUT_PAGE_STYLE.ceoNameText}>{ceo.name}</span>
        </p>
        <p className={ABOUT_PAGE_STYLE.ceoDescription}>{ceo.description}</p>
        <p className={ABOUT_PAGE_STYLE.ceoDecor}>***</p>

        <div className={ABOUT_PAGE_STYLE.ceoSNSChannelsWrap}>
          {Object.keys(ceo.sns).map((channel) => {
            const snsItem = ceo.sns[channel as keyof typeof ceo.sns];

            if (!snsItem) return null;

            return (
              <a
                key={channel}
                href={snsItem.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ABOUT_PAGE_STYLE.ceoSNSChannelsLink} group`}
                aria-label={snsItem.label}
              >
                <span className={ABOUT_PAGE_STYLE.ceoSnsIconWrap}>
                  <Image
                    src={snsItem.iconSrc}
                    alt={snsItem.label}
                    width={60}
                    height={60}
                    className={ABOUT_PAGE_STYLE.ceoSnsIconBase}
                  />
                  <Image
                    src={snsItem.hoverIconSrc}
                    alt={snsItem.label}
                    width={60}
                    height={60}
                    className={ABOUT_PAGE_STYLE.ceoSnsIconHover}
                  />
                </span>
              </a>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal
        className={ABOUT_PAGE_STYLE.ceoPhotoWrap}
        delayMs={120}
        durationMs={SECTION_REVEAL.durationMs}
        threshold={SECTION_REVEAL.threshold}
        rootMargin={SECTION_REVEAL.rootMargin}
        {...SECTION_REVEAL_EFFECT}
      >
        <Image
          src="/images/about-us/ceo-photo.webp"
          alt={ceo.imageAlt}
          fill
          sizes="(max-width: 1023px) 100vw, 70rem"
          className={ABOUT_PAGE_STYLE.ceoPhoto}
        />
      </ScrollReveal>
    </section>
  );
}