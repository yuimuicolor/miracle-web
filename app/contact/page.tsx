import ContactUsSection from "@/components/sections/ContactUsSection";
import InformationSection from "@/components/sections/InformationSection";

const STYLE = {
  page: "snap-container no-header-offset no-footer-offset w-full bg-point",
  snapSection: "lg:snap-start lg:snap-always w-full",
};

export default function ContactPage() {
  return (
    <div className={STYLE.page}>
      <div id="information" className={STYLE.snapSection}>
        <InformationSection />
      </div>
      <div id="contact-us" className={STYLE.snapSection}>
        <ContactUsSection />
      </div>
    </div>
  );
}