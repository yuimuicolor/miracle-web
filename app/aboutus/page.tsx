import AboutCeoSection from "@/components/aboutus/AboutCeoSection";
import AboutCertificatesSection from "@/components/aboutus/AboutCertificatesSection";
import AboutHistorySection from "@/components/aboutus/AboutHistorySection";
import AboutIntroSection from "@/components/aboutus/AboutIntroSection";
import AboutMarqueeSection from "@/components/aboutus/AboutMarqueeSection";
import { ABOUT_PAGE_STYLE } from "@/components/aboutus/aboutPageShared";

export default function AboutUsPage() {
  return (
    <main className={ABOUT_PAGE_STYLE.main}>
      <AboutIntroSection />
      <AboutMarqueeSection />
      <AboutHistorySection />
      <AboutCertificatesSection />
      <AboutCeoSection />
    </main>
  );
}
