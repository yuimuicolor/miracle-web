import { ABOUT_PAGE_CONTENT } from "@/lib/aboutPageData";

const STYLE = {
	main: `
		min-h-screen bg-bg-dark text-white
		px-6 pt-[11.25rem] pb-32
		sm:px-10
		md:px-20
	`,
	sectionBase: 'max-w-[80rem] mx-auto',
	headerRow: 'flex items-center gap-4 mb-8',
	mainTitle: 'font-en-xl-r sm:font-en-xxl-r',
	pointStar: 'text-point',
	titleLine: 'h-[0.125rem] bg-white/90 flex-1',
	introList: 'space-y-14',
	introGrid: (reverse: boolean) => `
		grid grid-cols-1 items-center gap-8
		lg:grid-cols-2
		${reverse ? 'lg:[&>*:first-child]:order-2' : ''}
	`,
	introTextWrap: 'space-y-5',
	introBadgeTitle: 'font-kr-l-bold',
	introBadgeTitleText: 'bg-point px-2 py-1 inline-block',
	introBadgeTitlePlain: 'px-1 py-1 inline-block',
	introAccent: 'font-kr-l-med leading-[1.35]',
	introAccentText: 'bg-white text-point px-2 py-1 inline-block',
	introAccentPlain: 'px-1 py-1 inline-block',
	introBody: 'font-kr-xs-reg text-white/85 whitespace-pre-line max-w-[35rem]',
	introBodyPoint: 'text-point font-kr-xs-bold',
	introBodyInverse: 'bg-white text-point px-1',
	introVisualWrap: 'flex justify-center lg:justify-end',
	introVisual: (imageClass: string) => `
		h-[17.5rem] w-[17.5rem] overflow-hidden
		sm:h-[22.5rem] sm:w-[22.5rem]
		${imageClass}
	`,
	introImage: 'w-full h-full object-cover saturate-150 contrast-110',
	trustWrap: 'lg:col-span-2 pt-4',
	trustText: `
		font-playwrite leading-none break-words text-white/95
		text-[3rem]
		sm:text-[4rem]
	`,
	sectionGapTop: 'mt-28',
	sectionHeading: 'text-center mb-12',
	sectionHeadingEn: 'font-en-noto-xs-med tracking-[0.32em] text-white/80',
	sectionHeadingKr: 'font-kr-l-bold inline-block bg-point px-3 py-1 mt-2',
	sectionHeadingDesc: 'font-kr-xs-reg text-white/70 mt-3',
	historyGrid: 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3',
	historyCard: 'relative',
	historyImageWrap: 'w-full h-[16.25rem] overflow-hidden',
	historyImage: 'w-full h-full object-cover',
	historyYear: 'absolute top-3 right-3 text-point bg-white/95 px-2 py-1 font-en-xl-r leading-none',
	historyMetaWrap: 'mt-3',
	historyDate: 'font-en-s-reg text-white/80',
	historyTitle: 'font-kr-xs-bold',
	certificateGrid: 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5',
	certificateCard: 'relative overflow-hidden',
	certificateImageRatio: 'aspect-[3/4]',
	certificateCaption: 'absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent',
	certificateTitle: 'font-en-noto-xs-med text-[0.625rem] text-white/85',
	certificateDesc: 'font-kr-xxs-reg text-white/95',
	ceoSection: `
		mx-auto mt-28 grid max-w-[80rem] grid-cols-1 items-end gap-10
		lg:grid-cols-[22.5rem_1fr]
	`,
	ceoEnLabel: 'font-en-noto-xs-med tracking-[0.28em] text-white/80',
	ceoTitle: 'font-en-xxl-r mt-2',
	ceoBar: 'w-28 h-[0.1875rem] bg-white mt-4',
	ceoNameWrap: 'font-kr-s-reg mt-5',
	ceoNameText: 'bg-point px-2 py-1',
	ceoDescription: 'mt-5 font-kr-xs-reg leading-[1.6] text-white/80 whitespace-pre-line',
	ceoSocialWrap: 'flex gap-3 mt-8',
	ceoSocialButton: 'w-9 h-9 rounded-full border border-white/60 font-en-noto-xs-med text-white/90',
	ceoVisualWrap: 'h-[26.25rem] w-full overflow-hidden sm:h-[35rem]',
	ceoVisual: 'w-full h-full object-cover',
};

export default function AboutUsPage() {
	const { pageTitle, pageTitleStar, introRows, trustText, history, certificates, ceo } = ABOUT_PAGE_CONTENT;

	const renderIntroCopy = (index: number) => {
		switch (index) {
			case 0:
				return {
					title: (
						<>
							<span className={STYLE.introBadgeTitleText}>독창적인 발상</span>
							<span className={STYLE.introBadgeTitlePlain}>으로</span>
						</>
					),
					accent: (
						<>
							<span className={STYLE.introAccentPlain}>일상에 </span>
							<span className={STYLE.introAccentText}>기적 같은 변화</span>
							<span className={STYLE.introAccentPlain}>를.</span>
						</>
					),
					body: (
						<>
							미라클은 브랜드의 본질을 깊게 해석하고, 감각적인 시각 언어로 재구성합니다.
							<br />
							작은 차이가 <span className={STYLE.introBodyPoint}>큰 인상</span>을 만든다는 믿음으로
							 한 장면씩 완성합니다.
						</>
					),
				};
			case 1:
				return {
					title: (
						<>
							<span className={STYLE.introBadgeTitlePlain}>MING:</span>
							<span className={STYLE.introBadgeTitleText}>기적</span>
						</>
					),
					accent: (
						<>
							<span className={STYLE.introAccentText}>보이지 않는 가치</span>
							<span className={STYLE.introAccentPlain}>를 보이게.</span>
						</>
					),
					body: (
						<>
							전략적 사고와 크리에이티브의 접점에서 고객의 문제를 해결합니다.
							<br />
							단순히 예쁜 디자인을 넘어
							 <span className={STYLE.introBodyInverse}>성과를 만드는 브랜드 경험</span>을 만듭니다.
						</>
					),
				};
			default:
				return {
					title: (
						<>
							<span className={STYLE.introBadgeTitleText}>고양이</span>
							는 귀엽습니다
						</>
					),
					accent: (
						<>
							디테일은 결국 <span className={STYLE.introAccentText}>설득력</span>이 됩니다.
						</>
					),
					body: (
						<>
							우리는 문장, 그리드, 여백, 타이포그래피 같은 기본 요소를 집요하게 다룹니다.
							<br />
							브랜드가 오래 기억되도록
							 <span className={STYLE.introBodyPoint}>감정의 밀도</span>를 디자인합니다.
						</>
					),
				};
		}
	};

	return (
		<main className={STYLE.main}>
			<section className={STYLE.sectionBase}>
				<div className={STYLE.headerRow}>
					<h1 className={STYLE.mainTitle}>{pageTitle}<span className={STYLE.pointStar}>{pageTitleStar}</span></h1>
					<div className={STYLE.titleLine} />
				</div>

				<div className={STYLE.introList}>
					{introRows.map((row, index) => (
						(() => {
							const copy = renderIntroCopy(index);

							return (
						<div
							key={`intro-row-${index}`}
							className={STYLE.introGrid(row.reverse)}
						>
							<div className={STYLE.introTextWrap}>
								<h2 className={STYLE.introBadgeTitle}>
									{copy.title}
								</h2>
								<p className={STYLE.introAccent}>
									{copy.accent}
								</p>
								<p className={STYLE.introBody}>{copy.body}</p>
							</div>

							<div className={STYLE.introVisualWrap}>
								<div className={STYLE.introVisual(row.imageClass)}>
									<img
										src="/images/main-bg.png"
										alt={`about-intro-${index + 1}`}
										className={STYLE.introImage}
									/>
								</div>
							</div>

							{index === 1 && (
								<div className={STYLE.trustWrap}>
									<p className={STYLE.trustText}>
										{trustText}
									</p>
								</div>
							)}
						</div>
							);
						})()
					))}
				</div>
			</section>

			<section className={`${STYLE.sectionBase} ${STYLE.sectionGapTop}`}>
				<div className={STYLE.sectionHeading}>
					<p className={STYLE.sectionHeadingEn}>{history.headingEn}</p>
					<h3 className={STYLE.sectionHeadingKr}>{history.headingKo}</h3>
					<p className={STYLE.sectionHeadingDesc}>{history.description}</p>
				</div>

				<div className={STYLE.historyGrid}>
					{history.items.map((item) => (
						<article key={`${item.year}-${item.date}`} className={STYLE.historyCard}>
							<div className={STYLE.historyImageWrap}>
								<img src="/images/main-bg.png" alt={item.title} className={STYLE.historyImage} />
							</div>
							<span className={STYLE.historyYear}>
								{item.year}
							</span>
							<div className={STYLE.historyMetaWrap}>
								<p className={STYLE.historyDate}>{item.date}</p>
								<p className={STYLE.historyTitle}>{item.title}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className={`${STYLE.sectionBase} ${STYLE.sectionGapTop}`}>
				<div className={STYLE.sectionHeading}>
					<p className={STYLE.sectionHeadingEn}>{certificates.headingEn}</p>
					<h3 className={STYLE.sectionHeadingKr}>{certificates.headingKo}</h3>
					<p className={STYLE.sectionHeadingDesc}>{certificates.description}</p>
				</div>

				<div className={STYLE.certificateGrid}>
					{certificates.items.map((cert) => (
						<article key={cert.id} className={STYLE.certificateCard}>
							<div className={STYLE.certificateImageRatio}>
								<img src="/images/main-bg.png" alt={cert.title} className={STYLE.historyImage} />
							</div>
							<div className={STYLE.certificateCaption}>
								<p className={STYLE.certificateTitle}>{cert.title}</p>
								<p className={STYLE.certificateDesc}>{cert.desc}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className={STYLE.ceoSection}>
				<div>
					<p className={STYLE.ceoEnLabel}>{ceo.label}</p>
					<h3 className={STYLE.ceoTitle}>{ceo.title}</h3>
					<div className={STYLE.ceoBar} />
					<p className={STYLE.ceoNameWrap}>
						<span className={STYLE.ceoNameText}>{ceo.name}</span>
					</p>
					<p className={STYLE.ceoDescription}>{ceo.description}</p>

					<div className={STYLE.ceoSocialWrap}>
						{ceo.socialChannels.map((channel) => (
							<button
								key={channel}
								className={STYLE.ceoSocialButton}
							>
								{channel}
							</button>
						))}
					</div>
				</div>

				<div className={STYLE.ceoVisualWrap}>
					<img src="/images/main-bg.png" alt={ceo.imageAlt} className={STYLE.ceoVisual} />
				</div>
			</section>
		</main>
	);
}
