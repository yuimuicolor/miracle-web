"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import { HOME_CONTENT, STORE_DATA } from "@/lib/siteData";

const STYLE = {
  section: "w-full bg-point",
  panel: `
    bg-bg-dark
    rounded-b-[12rem] pt-[10rem] pb-[8rem]
    md:rounded-b-[20rem]  md:pt-[14rem] md:pb-[12rem]
    lg:rounded-b-[30rem] lg:pt-[17rem] lg:min-h-screen 
  `,
  content: `
    mx-auto flex max-w-[1000px] xl:max-w-[1200px] flex-col
    gap-[4rem] px-[1.6rem]
    md:gap-[5rem] md:px-[4rem]
    lg:gap-[6rem] lg:px-0
  `,
  titleRow: `
    w-full flex flex-col items-center
    lg:gap-[2rem]
  `,
  titleHead: "flex w-full items-center gap-[0.8rem] md:gap-[2rem] lg:gap-[4rem]",
  titleLine: "h-px flex-1 bg-white/60",
  title: `
    font-gilda font-normal uppercase antialiased [text-rendering:geometricPrecision] [-webkit-font-smoothing:antialiased]
    text-[3.4rem] leading-[1.08] tracking-[-0.01em]
    md:text-[5.6rem] md:leading-[5.6rem] md:tracking-[-0.05em]
    lg:text-[6.4rem] lg:leading-[6.4rem]
    xl:text-[8rem] xl:leading-[8rem] xl:tracking-[0em]
  `,
  stars: `
    font-gilda leading-[1.2] tracking-[-0.05em] text-point-light
    text-[4rem]
    lg:mb-[3rem] lg:text-[8rem]
  `,
  body: "flex flex-col items-center gap-[4rem] lg:items-start lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-[6rem]",
  mapWrap: "w-full overflow-hidden rounded-[1.6rem] bg-white/8",
  mapFrame: "h-[26rem] w-full border-0 md:h-[30rem] lg:h-[36rem]",
  infoCol: "w-full flex flex-col items-center gap-[1.2rem] md:gap-[1.2rem] lg:items-start lg:gap-[1.6rem]",
  infoLink:
    "group inline-flex items-center justify-start gap-[0.8rem] text-left text-white/85 transition-all duration-200 hover:text-white hover:translate-x-[0.2rem] md:justify-center lg:justify-start",
  infoTextWrap: "flex items-center gap-[0.4rem]",
  mainIcon:
    "h-[2.4rem] w-[2.4rem] md:h-[3.2rem] md:w-[3.2rem] lg:h-[4rem] lg:w-[4rem] flex-shrink-0",
  infoText:
    "font-noto text-[1.8rem] leading-[1.35] text-white/90 transition-colors duration-200 group-hover:text-white lg:text-[2.0rem]",
  extIcon:
    "mt-[0.2rem] h-[1.6rem] w-[1.6rem] md:h-[1.8rem] md:w-[1.8rem] lg:h-[2rem] lg:w-[2rem] text-white/55 transition-all duration-200 group-hover:text-white/90 group-hover:translate-x-[0.1rem]",
  chip: `
    mt-[0.8rem] inline-flex w-fit flex-col gap-[0.4rem] rounded-[0.8rem] bg-point px-[1.2rem] py-[1rem] text-white
    md:mt-[0.8rem]
    lg:mt-[0.4rem]
  `,
  chipTitle:
    "font-noto font-bold text-[1.8rem] leading-[1.2] lg:text-[2.0rem]",
  chipBody:
    "font-noto text-[1.8rem] leading-[1.3] lg:text-[2.0rem]",
  snsRow: `
    mt-[2rem] flex items-center gap-[2rem]
    md:gap-[4rem]
    lg:mt-[2.4rem] lg:gap-[4rem]
  `,
  snsLink:
    "inline-flex h-[6rem] w-[6rem] items-center justify-center text-white transition-transform duration-200 hover:scale-[1.04]",
  snsIconWrap: "relative h-[6rem] w-[6rem]",
  snsIconBase:
    "absolute h-[6rem] w-[6rem] transition-opacity duration-300 ease-out group-hover:opacity-0",
  snsIconHover:
    "absolute h-[6rem] w-[6rem] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100",
};

const toDialNumber = (phone: string) => phone.replace(/[^\d+]/g, "");

export default function InformationSection() {
  const { informationSection } = HOME_CONTENT;
  const encodedMapQuery = encodeURIComponent(STORE_DATA.mapQuery);
  const snsEntries = Object.values(STORE_DATA.sns);

  const openDirections = () => {
    window.open(STORE_DATA.mapLink, "_blank", "noopener,noreferrer");
  };

  const mapEmbedUrl = `https://maps.google.com/maps?hl=ko&q=${encodedMapQuery}&t=m&z=18&ie=UTF8&iwloc=B&output=embed`;

  return (
    <section className={STYLE.section}>
      <div className={STYLE.panel}>
        <ScrollReveal className={STYLE.titleRow} {...HOME_REVEAL.sectionTitle}>
          <div className={STYLE.titleHead}>
            <span className={STYLE.titleLine} />
            <h2 className={STYLE.title}>{informationSection.sectionTitle}</h2>
            <span className={STYLE.titleLine} />
          </div>
          <p className={STYLE.stars}>{informationSection.starsText}</p>
        </ScrollReveal>

        <div className={STYLE.content}>
          <div className={STYLE.body}>
            <ScrollReveal className={STYLE.mapWrap} delayMs={80} {...HOME_REVEAL.mediaBlock}>
              <iframe
                title={informationSection.mapTitle}
                className={STYLE.mapFrame}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedUrl}
              />
            </ScrollReveal>

            <div className={STYLE.infoCol}>
              <ScrollReveal delayMs={140} {...HOME_REVEAL.textBlock}>
                <button
                  type="button"
                  className={STYLE.infoLink}
                  onClick={openDirections}
                >
                  <Image
                    src={STORE_DATA.infoIcons.location}
                    alt={informationSection.locationIconAlt}
                    width={40}
                    height={40}
                    className={STYLE.mainIcon}
                  />
                  <div className={STYLE.infoTextWrap}>
                    <span className={STYLE.infoText}>{STORE_DATA.address}</span>
                    <ExternalLink className={STYLE.extIcon} />
                  </div>
                </button>
              </ScrollReveal>

              <ScrollReveal delayMs={220} {...HOME_REVEAL.textBlock}>
                <a
                  href={`tel:${toDialNumber(STORE_DATA.phone)}`}
                  className={STYLE.infoLink}
                >
                  <Image
                    src={STORE_DATA.infoIcons.phone}
                    alt={informationSection.phoneIconAlt}
                    width={40}
                    height={40}
                    className={STYLE.mainIcon}
                  />
                  <div className={STYLE.infoTextWrap}>
                    <span className={STYLE.infoText}>{STORE_DATA.phone}</span>
                    <ExternalLink className={STYLE.extIcon} />
                  </div>
                </a>
              </ScrollReveal>

              <ScrollReveal delayMs={300} {...HOME_REVEAL.textBlock}>
                <a href={`mailto:${STORE_DATA.email}`} className={STYLE.infoLink}>
                  <Image
                    src={STORE_DATA.infoIcons.email}
                    alt={informationSection.emailIconAlt}
                    width={40}
                    height={40}
                    className={STYLE.mainIcon}
                  />
                  <div className={STYLE.infoTextWrap}>
                    <span className={STYLE.infoText}>{STORE_DATA.email}</span>
                    <ExternalLink className={STYLE.extIcon} />
                  </div>
                </a>
              </ScrollReveal>

              <ScrollReveal delayMs={380} {...HOME_REVEAL.card}>
                <div className={STYLE.chip}>
                <p className={STYLE.chipTitle}>{informationSection.businessHoursLabel}</p>
                <p className={STYLE.chipBody}>{STORE_DATA.businessHours}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal className={STYLE.snsRow} delayMs={460} {...HOME_REVEAL.button}>
                {snsEntries.map((snsItem) => (
                  <a
                    key={snsItem.label}
                    href={snsItem.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${STYLE.snsLink} group`}
                    aria-label={snsItem.label}
                  >
                    <span className={STYLE.snsIconWrap}>
                      <Image
                        src={snsItem.iconSrc}
                        alt={snsItem.label}
                        width={60}
                        height={60}
                        className={STYLE.snsIconBase}
                      />
                      <Image
                        src={snsItem.hoverIconSrc}
                        alt={snsItem.label}
                        width={60}
                        height={60}
                        className={STYLE.snsIconHover}
                      />
                    </span>
                  </a>
                ))}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
