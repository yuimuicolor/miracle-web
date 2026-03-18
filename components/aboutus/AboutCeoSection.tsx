import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ABOUT_PAGE_STYLE,
  ANCHOR_PADDING_TOP,
  SECTION_REVEAL,
  SECTION_REVEAL_EFFECT,
} from "@/components/aboutus/aboutPageShared";
import { ABOUT_PAGE_CONTENT } from "@/lib/aboutPageData";
import { STORE_DATA } from "@/lib/siteData";

const CEO_SNS_MAP = {
  IG: STORE_DATA.sns.instagram,
  YT: STORE_DATA.sns.youtube,
  X: STORE_DATA.sns.x,
} as const;

export default function AboutCeoSection() {
  const { ceo } = ABOUT_PAGE_CONTENT;

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
          {ceo.socialChannels.map((channel) => {
            const snsItem = CEO_SNS_MAP[channel as keyof typeof CEO_SNS_MAP];

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