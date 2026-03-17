"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";

const INFO = {
  businessName: "자연도소금빵 성수점",
  address: "대한민국 서울특별시 성동구 연무장길 56-1",
  phone: "010-2555-2555",
  email: "miracle@email.com",
  businessHours: "월-금 09시-18시 (공휴일/주말 휴무)",
  mapQuery: "자연도소금빵 성수점 대한민국 서울특별시 성동구 연무장길 56-1",
  mapLink:
    "https://www.google.com/maps/place/%EC%9E%90%EC%97%B0%EB%8F%84%EC%86%8C%EA%B8%88%EB%B9%B5+%EC%84%B1%EC%88%98%EC%A0%90/@37.5423025,127.0553657,21z/data=!4m6!3m5!1s0x357ca58daad46ea9:0x4922f006043fcb1e!8m2!3d37.5423017!4d127.0554582!16s%2Fg%2F11vctr0f09",
  sns: {
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    x: "https://x.com/",
  },
};

const STYLE = {
  section: "w-full bg-point",
  panel: `w-full min-h-screen bg-bg-dark
		rounded-b-[12rem] md:rounded-b-[20rem] lg:rounded-b-[30rem]
		px-[4rem] md:px-[12rem] lg:px-[16rem]
		pt-[10rem] md:pt-[14rem] lg:pt-[17rem]
        pb-[8rem] md:pb-[12rem]`,
  content:
    "mx-auto flex w-full max-w-[1200px] flex-col gap-[4rem] px-[1.6rem] md:gap-[5rem] md:px-[4rem] lg:gap-[6rem] lg:px-0",
  titleRow:
    `flex flex-col items-center w-[calc(100%+8rem)] -mx-[4rem] 
	md:w-[calc(100%+24rem)] md:-mx-[12rem]
	lg:w-[calc(100%+32rem)] lg:-mx-[16rem] lg:gap-[2rem]`,
  titleHead: "flex w-full items-center gap-[0.8rem] md:gap-[2rem] lg:gap-[4rem]",
  titleLine: "h-px flex-1 bg-white/60",
  title:
    "font-gilda text-[4.4rem] leading-[1] text-white md:text-[5.4rem] lg:text-[6.4rem]",
  stars:
    `font-gilda text-[5.6rem] text-point-light leading-[1.2] tracking-[-0.05em]
	lg:text-8rem lg:mb-[3rem]`,
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
    "font-noto text-[1.6rem] leading-[1.35] text-white/90 transition-colors duration-200 group-hover:text-white md:text-[1.8rem] lg:text-[2.0rem]",
  extIcon:
    "mt-[0.2rem] h-[1.6rem] w-[1.6rem] md:h-[1.8rem] md:w-[1.8rem] lg:h-[2rem] lg:w-[2rem] text-white/55 transition-all duration-200 group-hover:text-white/90 group-hover:translate-x-[0.1rem]",
  chip: "inline-flex w-fit flex-col gap-[0.4rem] rounded-[0.8rem] bg-point px-[1.2rem] py-[1rem] text-white mt-[0.8rem] md:mt-[0.8rem] lg:mt-[0.4rem]",
  chipTitle:
    "font-noto font-bold text-[1.6rem] leading-[1.2] md:text-[1.8rem] lg:text-[2.0rem]",
  chipBody:
    "font-noto text-[1.6rem] leading-[1.3] md:text-[1.8rem] lg:text-[2.0rem]",
  snsRow: "mt-[2rem] flex items-center gap-[2rem] md:gap-[4rem] lg:mt-[2.4rem] lg:gap-[4rem]",
  snsLink:
    "inline-flex h-[6rem] w-[6rem] items-center justify-center text-white transition-transform duration-200 hover:scale-[1.04]",
  snsIconWrap: "relative h-[6rem] w-[6rem]",
  snsIconBase:
    "absolute h-[6rem] w-[6rem] transition-opacity duration-300 ease-out group-hover:opacity-0",
  snsIconHover:
    "absolute  h-[6rem] w-[6rem] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100",
};

const toDialNumber = (phone: string) => phone.replace(/[^\d+]/g, "");

export default function InformationSection() {
  const encodedMapQuery = encodeURIComponent(INFO.mapQuery);

  const openDirections = () => {
    window.open(INFO.mapLink, "_blank", "noopener,noreferrer");
  };

  const mapEmbedUrl = `https://maps.google.com/maps?hl=ko&q=${encodedMapQuery}&t=m&z=18&ie=UTF8&iwloc=B&output=embed`;

  return (
    <section className={STYLE.section}>
      <div className={STYLE.panel}>
        <div className={STYLE.titleRow}>
          <div className={STYLE.titleHead}>
            <span className={STYLE.titleLine} />
            <h2 className={STYLE.title}>INFORMATION</h2>
            <span className={STYLE.titleLine} />
          </div>
          <p className={STYLE.stars}>***</p>
        </div>

        <div className={STYLE.content}>
          <div className={STYLE.body}>
            <div className={STYLE.mapWrap}>
              <iframe
                title="MIRACLE 위치 지도"
                className={STYLE.mapFrame}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedUrl}
              />
            </div>

            <div className={STYLE.infoCol}>
              <button
                type="button"
                className={STYLE.infoLink}
                onClick={openDirections}
              >
                <Image
                  src="/images/icon/icon_location.png"
                  alt="위치"
                  width={40}
                  height={40}
                  className={STYLE.mainIcon}
                />
                <div className={STYLE.infoTextWrap}>
                  <span className={STYLE.infoText}>{INFO.address}</span>
                  <ExternalLink className={STYLE.extIcon} />
                </div>
              </button>

              <a
                href={`tel:${toDialNumber(INFO.phone)}`}
                className={STYLE.infoLink}
              >
                <Image
                  src="/images/icon/icon_phone.png"
                  alt="전화"
                  width={40}
                  height={40}
                  className={STYLE.mainIcon}
                />
                <div className={STYLE.infoTextWrap}>
                  <span className={STYLE.infoText}>{INFO.phone}</span>
                  <ExternalLink className={STYLE.extIcon} />
                </div>
              </a>

              <a href={`mailto:${INFO.email}`} className={STYLE.infoLink}>
                <Image
                  src="/images/icon/icon_round-mail.png"
                  alt="이메일"
                  width={40}
                  height={40}
                  className={STYLE.mainIcon}
                />
                <div className={STYLE.infoTextWrap}>
                  <span className={STYLE.infoText}>{INFO.email}</span>
                  <ExternalLink className={STYLE.extIcon} />
                </div>
              </a>

              <div className={STYLE.chip}>
                <p className={STYLE.chipTitle}>영업시간</p>
                <p className={STYLE.chipBody}>{INFO.businessHours}</p>
              </div>

              <div className={STYLE.snsRow}>
                <a
                  href={INFO.sns.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${STYLE.snsLink} group`}
                  aria-label="Instagram"
                >
                  <span className={STYLE.snsIconWrap}>
                    <Image
                      src="/images/icon/icon-sns-instagram.png"
                      alt="Instagram"
                      width={60}
                      height={60}
                      className={STYLE.snsIconBase}
                    />
                    <Image
                      src="/images/icon/icon-sns-instagram-hover.png"
                      alt="Instagram"
                      width={60}
                      height={60}
                      className={STYLE.snsIconHover}
                    />
                  </span>
                </a>
                <a
                  href={INFO.sns.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${STYLE.snsLink} group`}
                  aria-label="YouTube"
                >
                  <span className={STYLE.snsIconWrap}>
                    <Image
                      src="/images/icon/icon-sns-youtube.png"
                      alt="YouTube"
                      width={60}
                      height={60}
                      className={STYLE.snsIconBase}
                    />
                    <Image
                      src="/images/icon/icon-sns-youtube-hover.png"
                      alt="YouTube"
                      width={60}
                      height={60}
                      className={STYLE.snsIconHover}
                    />
                  </span>
                </a>
                <a
                  href={INFO.sns.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${STYLE.snsLink} group`}
                  aria-label="X"
                >
                  <span className={STYLE.snsIconWrap}>
                    <Image
                      src="/images/icon/icon-sns-x.png"
                      alt="X"
                      width={60}
                      height={60}
                      className={STYLE.snsIconBase}
                    />
                    <Image
                      src="/images/icon/icon-sns-x-hover.png"
                      alt="X"
                      width={60}
                      height={60}
                      className={STYLE.snsIconHover}
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
