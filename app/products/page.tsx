import ProductsPageGrid from "@/components/products/ProductsPageGrid";
import SectionTitle from "@/components/sections/common/SectionTitle";
import { PRODUCTS } from "@/lib/productsData";
import { BRAND_DATA, HOME_CONTENT } from "@/lib/siteData";

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
		text-[1.6rem]
		md:text-[1.8rem]
		lg:text-[2rem]
	`,
};

export default function ProductsPage() {
	const { productsSection } = HOME_CONTENT;

	return (
		<section className={STYLE.section}>
			<div className={STYLE.content}>
				<div className={STYLE.titleWrap}>
					<SectionTitle title={productsSection.sectionTitle} color="black" />
					<p className={STYLE.subText}>
						<strong className="font-bold">{BRAND_DATA.name}</strong>
						{productsSection.description}
					</p>
				</div>

				<ProductsPageGrid products={PRODUCTS} />
			</div>
		</section>
	);
}
