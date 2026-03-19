import ContactUsSection from "@/components/sections/ContactUsSection";
import InformationSection from "@/components/sections/InformationSection";

const STYLE = {
	page: "no-header-offset no-footer-offset w-full bg-point",
};

export default function ContactPage() {
	return (
		<div className={STYLE.page}>
			<div id="information">
				<InformationSection />
			</div>
			<div id="contact-us">
				<ContactUsSection />
			</div>
		</div>
	);
}
