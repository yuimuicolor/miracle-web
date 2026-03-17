import Link from "next/link";
import path from "node:path";
import { readdirSync } from "node:fs";
import MoreButton from "../MoreButton";
import AboutSlider from "./AboutSlider";
import SectionTitle from "./common/SectionTitle";
import { HOME_CONTENT } from "@/lib/siteData";

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

const STYLE = {
  section: `w-full h-full min-h-screen xl:h-screen bg-bg-dark
    px-[1.6rem] md:px-[4rem] lg:px-[8rem]
    pt-[10rem] md:pt-[14rem] lg:pt-[17rem]
    pb-[8rem] md:pb-[12rem] xl:pb-[8rem]
  `,
  content:
    "mx-auto flex w-full flex-col gap-[2rem] md:gap-[4rem] xl:justify-between xl:gap-[6rem]",
  body: "flex flex-col gap-[3rem] md:gap-[4rem] xl:flex-row xl:justify-between",
  textWrap: "flex flex-col items-start gap-[2rem] lg:gap-[2.8rem]",
  sliderWrap: "w-full lg:max-w-[600px] xl:max-w-[700px]",
  lead: `flex flex-col gap-[0.8rem] lg:gap-[2rem]
  font-noto tracking-[-0.03em] text-white
  text-[3.2rem] md:text-[4.8rem] lg:text-[5.6rem]`,
  leadLine: "leading-[1.5] lg:leading-[1.3]",
  leadSegmentPoint:
    "inline px-[0.8rem] font-bold text-white [box-decoration-break:clone] [-webkit-box-decoration-break:clone] bg-point",
  leadSegmentInverse:
    "inline px-[0.8rem] font-bold text-point [box-decoration-break:clone] [-webkit-box-decoration-break:clone] bg-white",
  desc: "text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] leading-[1.5] tracking-[-0.05em] text-white",
};

export default function AboutSection() {
  const slides = getAboutSlides();
  const { aboutSection } = HOME_CONTENT;

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <SectionTitle title={aboutSection.sectionTitle} color="white" />
        <div className={STYLE.body}>
          <div className={STYLE.textWrap}>
            <p className={STYLE.lead}>
              <span className={STYLE.leadLine}>
                <span className={STYLE.leadSegmentPoint}>독창적인 발상</span>
                으로
              </span>
              <span className={STYLE.leadLine}>
                일상에 <span className={STYLE.leadSegmentInverse}>기적 같은 변화</span>를.
              </span>
            </p>

            <p className={`${STYLE.desc} whitespace-pre-line`}>{aboutSection.description}</p>

            <Link href="/aboutus">
              <MoreButton text={aboutSection.moreButtonText} size="S" mode="light" />
            </Link>
          </div>

          <div className={STYLE.sliderWrap}>
            <AboutSlider slides={slides} />
          </div>
        </div>
      </div>
    </section>
  );
}
