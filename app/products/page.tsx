import ProductsPageGrid from "@/components/products/ProductsPageGrid";
import ScrollReveal from "@/components/ScrollReveal";
import { HOME_REVEAL } from "@/components/sections/homeMotion";
import SectionTitle from "@/components/sections/common/SectionTitle";
import { getAllProducts } from "@/lib/productsData";
import { HOME_CONTENT } from "@/lib/siteData";
import { useSettings } from "@/context/SiteSettingsContext";
import { getSiteSettings } from "@/lib/siteSettings";

const STYLE = {
	section: `
		w-full bg-bg-light
		px-[1.6rem] pt-[10rem] pb-[8rem]
		md:px-[4rem] md:pt-[14rem] md:pb-[10rem]
		lg:px-[8rem] lg:pt-[17rem] lg:pb-[12rem]
	`,
	content: `
		mx-auto flex w-full flex-col
		gap-[4rem]
		lg:gap-[6rem]
	`,
	titleWrap: `
		flex flex-col gap-[0.8rem]
		md:gap-[1.2rem]
		lg:gap-[2rem]
	`,
	subText: `
		font-noto text-black
		text-[1.8rem]
		lg:text-[2rem]
	`,
};

export default async function ProductsPage() {;
	const settings = await getSiteSettings();
    if (!settings) return null;

    const { productsSection } = HOME_CONTENT;
    const products = await getAllProducts();

	return (
		<section className={STYLE.section}>
			<div className={STYLE.content}>
				<ScrollReveal className={STYLE.titleWrap} {...HOME_REVEAL.sectionTitle}>
					<SectionTitle title={productsSection.sectionTitle} color="black" />
					<p className={STYLE.subText}>
						<strong className="font-bold">{settings.brandName}</strong>
						{productsSection.description}
					</p>
				</ScrollReveal>

				<ScrollReveal className="w-full" delayMs={120} {...HOME_REVEAL.sectionBody}>
					<ProductsPageGrid products={products} />
				</ScrollReveal>
			</div>
		</section>
	);
}
