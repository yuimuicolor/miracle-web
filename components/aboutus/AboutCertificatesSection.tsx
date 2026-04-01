import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { 
  ABOUT_PAGE_STYLE,
  ANCHOR_PADDING_TOP,
  SECTION_REVEAL,
  SECTION_REVEAL_EFFECT } from "@/lib/constants/aboutPage";
import { SectionHeading } from "./SharedAboutPage";
import { getCertificatesItemsByServer } from "@/lib/api/certificates";
import { CertificateItem } from "@/lib/types/aboutUs";
import { supabaseServer } from "@/lib/supabase/server";

export default async function AboutCertificatesSection() {

  const certificates = await getCertificatesItemsByServer(supabaseServer);

  return (
    <section id="certificates" style={{ paddingTop: ANCHOR_PADDING_TOP }}>
      <ScrollReveal
        className={ABOUT_PAGE_STYLE.sectionHeading}
        durationMs={SECTION_REVEAL.durationMs}
        threshold={SECTION_REVEAL.threshold}
        rootMargin={SECTION_REVEAL.rootMargin}
        {...SECTION_REVEAL_EFFECT}
      >
        <SectionHeading
          headingEn="CERTIFICATES"
          headingKo="인증서"
          description="미라클이 보유한 인증서와 수상 내역을 소개합니다."
        />
      </ScrollReveal>

      <div className={ABOUT_PAGE_STYLE.certificateGrid}>
        {certificates.map((item: CertificateItem, index: number) => (
          <ScrollReveal
            key={item.id}
            as="article"
            className={ABOUT_PAGE_STYLE.certificateCard}
            delayMs={index * 65}
            durationMs={SECTION_REVEAL.durationMs}
            threshold={SECTION_REVEAL.threshold}
            rootMargin={SECTION_REVEAL.rootMargin}
            {...SECTION_REVEAL_EFFECT}
          >
            <div className={ABOUT_PAGE_STYLE.certificateImageRatio}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                loading="eager"
                sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw"
                className={ABOUT_PAGE_STYLE.imageObj}
              />
            </div>
            <div className={ABOUT_PAGE_STYLE.certificateCaption}>
              <p className={ABOUT_PAGE_STYLE.certificateTitle}>{item.title}</p>
              <p className={ABOUT_PAGE_STYLE.certificateDesc}>{item.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}