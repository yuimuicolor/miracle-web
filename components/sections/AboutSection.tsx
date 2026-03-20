import Link from "next/link";
import path from "node:path";
import { readdirSync } from "node:fs";
import MoreButton from "../MoreButton";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import AboutSlider from "./AboutSlider";
import SectionTitle from "./common/SectionTitle";

const ABOUT_SLIDER_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "about-slider",
);
const WEBP_FILE_REGEX = /\.webp$/i;
const IMAGE_FILE_REGEX = /\.(png|jpe?g|webp|avif|gif)$/i;

const getAboutSlides = () => {
  try {
    const allFiles = readdirSync(ABOUT_SLIDER_DIR).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );

    const preferredWebp = allFiles.filter((fileName) =>
      WEBP_FILE_REGEX.test(fileName),
    );
    const fallbackImages = allFiles.filter((fileName) =>
      IMAGE_FILE_REGEX.test(fileName),
    );
    const files = (
      preferredWebp.length > 0 ? preferredWebp : fallbackImages
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (files.length === 0) {
      return ["/images/main-bg.png"];
    }

    return files.map((fileName) => `/images/about-slider/${fileName}`);
  } catch {
    return ["/images/main-bg.png"];
  }
};

const ABOUT_SLIDES = getAboutSlides();

const STYLE = {
  section: `
    flex w-full bg-bg-dark
    px-[1.6rem] pb-[8rem] pt-header-offset
    md:px-[4rem] md:pb-[12rem]
    lg:px-[8rem]
    xl:h-screen xl:pt-[17rem] xl:pb-[8rem]
  `,
  content: `
    mx-auto flex flex-1 flex-col justify-center gap-[2rem]
    md:gap-[4rem]
    xl:gap-[6rem]
  `,
  body: `
    flex flex-col gap-[3rem]
    md:gap-[4rem]
    xl:flex-row xl:justify-between
  `,
  textWrap: "flex flex-col items-start gap-[2rem] lg:gap-[2.8rem] lg:flex-shrink-0",
  sliderWrap: "w-full  xl:max-w-[700px] xl:flex-shrink-1",
  lead: `
    flex flex-col gap-[0.8rem] font-noto tracking-[-0.03em] text-white
    text-[3.2rem]
    md:text-[4.8rem]
    lg:gap-[2rem] lg:text-[5.6rem]
  `,
  leadLine: "leading-[1.5] lg:leading-[1.3]",
  leadSegmentPoint: `
    inline bg-point px-[0.8rem] font-bold text-white
    [box-decoration-break:clone] [-webkit-box-decoration-break:clone]
  `,
  leadSegmentInverse: `
    inline bg-white px-[0.8rem] font-bold text-point
    [box-decoration-break:clone] [-webkit-box-decoration-break:clone]
  `,
  desc: `
    leading-[1.5] tracking-[-0.05em] text-white
    text-[1.8rem]
    lg:text-[2rem]
  `,
};

export default function AboutSection() {

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <ScrollReveal {...HOME_REVEAL.sectionTitle}>
          <SectionTitle title="About Us" color="white" />
        </ScrollReveal>
        <div className={STYLE.body}>
          <ScrollReveal className={STYLE.textWrap} delayMs={80} {...HOME_REVEAL.textBlock}>
            <p className={STYLE.lead}>
              <span className={STYLE.leadLine}>
                <span className={STYLE.leadSegmentPoint}>독창적인 발상</span>
                으로
              </span>
              <span className={STYLE.leadLine}>
                일상에 <span className={STYLE.leadSegmentInverse}>기적 같은 변화</span>를.
              </span>
            </p>

            <p className={`${STYLE.desc} whitespace-pre-line`}>MIRACLE은 남들과는 다른 상상력으로 당신의 일상에서<br/>기적과 같은 변화를 함께 만들어 가는 친구가 되기를 꿈꿉니다.</p>

            <Link href="/aboutus">
              <MoreButton text="MORE" size="S" mode="light" />
            </Link>
          </ScrollReveal>

          <ScrollReveal className={STYLE.sliderWrap} delayMs={180} {...HOME_REVEAL.mediaBlock}>
            <AboutSlider slides={ABOUT_SLIDES} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
