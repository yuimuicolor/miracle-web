import Link from "next/link";
import path from "node:path";
import { readdirSync } from "node:fs";
import MoreButton from "../MoreButton";
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
  leadLine: "whitespace-nowrap",
  leadHighlight: "px-[1rem] bg-point font-bold",
  leadAccent: "px-[1rem] bg-white font-bold text-point-light",
  desc: "text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] leading-[1.5] tracking-[-0.05em] text-white/70",
};

export default function AboutSection() {
  const slides = getAboutSlides();

  return (
    <section className={STYLE.section}>
      <div className={STYLE.content}>
        <SectionTitle title="About Us" color="white" />
        <div className={STYLE.body}>
          <div className={STYLE.textWrap}>
            <p className={STYLE.lead}>
              <span className={STYLE.leadLine}>
                <span className={STYLE.leadHighlight}>독창적인 발상</span>으로
              </span>
              <span className={STYLE.leadLine}>
                일상에 <span className={STYLE.leadAccent}>기적 같은 변화</span>
                를.
              </span>
            </p>

            <p className={STYLE.desc}>
              MIRACLE은 남들과는 다른 상상력으로 당신의 일상에서 <br />
              기적과 같은 변화를 함께 만들어 가는 친구가 되기를 꿈꿉니다.
            </p>

            <Link href="/aboutus">
              <MoreButton text="MORE" size="S" mode="light" />
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
