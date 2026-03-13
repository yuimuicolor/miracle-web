const introRows = [
	{
		title: '독창적인 발상 으로',
		accent: '일상에 기적 같은 변화 를.',
		body: '미라클은 브랜드의 본질을 깊게 해석하고, 감각적인 시각 언어로 재구성합니다.\n작은 차이가 큰 인상을 만든다는 믿음으로 한 장면씩 완성합니다.',
		imageClass: 'rounded-full',
		reverse: false,
	},
	{
		title: 'MING: 기적',
		accent: '보이지 않는 가치를 보이게.',
		body: '전략적 사고와 크리에이티브의 접점에서 고객의 문제를 해결합니다.\n단순히 예쁜 디자인을 넘어 성과를 만드는 브랜드 경험을 만듭니다.',
		imageClass: 'rounded-[120px]',
		reverse: true,
	},
	{
		title: '고양이는 귀엽습니다',
		accent: '디테일은 결국 설득력이 됩니다.',
		body: '우리는 문장, 그리드, 여백, 타이포그래피 같은 기본 요소를 집요하게 다룹니다.\n브랜드가 오래 기억되도록 감정의 밀도를 디자인합니다.',
		imageClass: 'rounded-[120px]',
		reverse: false,
	},
];

const historyItems = [
	{ year: '2016', date: '01-03', title: '브랜드 스튜디오 설립' },
	{ year: '2017', date: '04-05', title: 'MIRACLE 리브랜딩 공개' },
	{ year: '2018', date: '05-06', title: '디지털 캠페인 전개' },
	{ year: '2019', date: '11-16', title: '브랜드 전략팀 확장' },
	{ year: '2022', date: '04-01', title: '크리에이티브 랩 론칭' },
	{ year: '2025', date: '11-11', title: 'K-브랜드 글로벌 진출' },
];

const certificates = Array.from({ length: 10 }).map((_, index) => ({
	id: index + 1,
	title: `TITLE | ${index + 1}호`,
	desc: '브랜드 디자인 최우수상',
}));

const STYLE = {
	main: 'bg-bg-dark text-white min-h-screen pt-[11.25rem] pb-32 px-6 sm:px-10 md:px-20',
	sectionBase: 'max-w-[80rem] mx-auto',
	headerRow: 'flex items-center gap-4 mb-8',
	mainTitle: 'font-en-xl-r sm:font-en-xxl-r',
	pointStar: 'text-point',
	titleLine: 'h-[0.125rem] bg-white/90 flex-1',
	introList: 'space-y-14',
	introGrid: (reverse: boolean) =>
		`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`,
	introTextWrap: 'space-y-5',
	introBadgeTitle: 'font-kr-l-bold',
	introBadgeTitleText: 'bg-point px-2 py-1 inline-block',
	introAccent: 'font-kr-l-med leading-[1.35]',
	introAccentText: 'bg-white text-point px-2 py-1 inline-block',
	introBody: 'font-kr-xs-reg text-white/85 whitespace-pre-line max-w-[35rem]',
	introVisualWrap: 'flex justify-center lg:justify-end',
	introVisual: (imageClass: string) => `w-[17.5rem] h-[17.5rem] sm:w-[22.5rem] sm:h-[22.5rem] overflow-hidden ${imageClass}`,
	introImage: 'w-full h-full object-cover saturate-150 contrast-110',
	trustWrap: 'lg:col-span-2 pt-4',
	trustText: 'font-playwrite text-[3rem] sm:text-[4rem] text-white/95 leading-none break-words',
	sectionGapTop: 'mt-28',
	sectionHeading: 'text-center mb-12',
	sectionHeadingEn: 'font-en-noto-xs-med tracking-[0.32em] text-white/80',
	sectionHeadingKr: 'font-kr-l-bold inline-block bg-point px-3 py-1 mt-2',
	sectionHeadingDesc: 'font-kr-xs-reg text-white/70 mt-3',
	historyGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
	historyCard: 'relative',
	historyImageWrap: 'w-full h-[16.25rem] overflow-hidden',
	historyImage: 'w-full h-full object-cover',
	historyYear: 'absolute top-3 right-3 text-point bg-white/95 px-2 py-1 font-en-xl-r leading-none',
	historyMetaWrap: 'mt-3',
	historyDate: 'font-en-s-reg text-white/80',
	historyTitle: 'font-kr-xs-bold',
	certificateGrid: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3',
	certificateCard: 'relative overflow-hidden',
	certificateImageRatio: 'aspect-[3/4]',
	certificateCaption: 'absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent',
	certificateTitle: 'font-en-noto-xs-med text-[0.625rem] text-white/85',
	certificateDesc: 'font-kr-xxs-reg text-white/95',
	ceoSection: 'max-w-[80rem] mx-auto mt-28 grid grid-cols-1 lg:grid-cols-[22.5rem_1fr] gap-10 items-end',
	ceoEnLabel: 'font-en-noto-xs-med tracking-[0.28em] text-white/80',
	ceoTitle: 'font-en-xxl-r mt-2',
	ceoBar: 'w-28 h-[0.1875rem] bg-white mt-4',
	ceoNameWrap: 'font-kr-s-reg mt-5',
	ceoNameText: 'bg-point px-2 py-1',
	ceoDescription: 'font-kr-xs-reg text-white/80 mt-5 leading-[1.6] whitespace-pre-line',
	ceoSocialWrap: 'flex gap-3 mt-8',
	ceoSocialButton: 'w-9 h-9 rounded-full border border-white/60 font-en-noto-xs-med text-white/90',
	ceoVisualWrap: 'w-full h-[26.25rem] sm:h-[35rem] overflow-hidden',
	ceoVisual: 'w-full h-full object-cover',
};

export default function AboutUsPage() {
	return (
		<main className={STYLE.main}>
			<section className={STYLE.sectionBase}>
				<div className={STYLE.headerRow}>
					<h1 className={STYLE.mainTitle}>ABOUT US<span className={STYLE.pointStar}>*</span></h1>
					<div className={STYLE.titleLine} />
				</div>

				<div className={STYLE.introList}>
					{introRows.map((row, index) => (
						<div
							key={row.title}
							className={STYLE.introGrid(row.reverse)}
						>
							<div className={STYLE.introTextWrap}>
								<h2 className={STYLE.introBadgeTitle}>
									<span className={STYLE.introBadgeTitleText}>{row.title}</span>
								</h2>
								<p className={STYLE.introAccent}>
									<span className={STYLE.introAccentText}>{row.accent}</span>
								</p>
								<p className={STYLE.introBody}>{row.body}</p>
							</div>

							<div className={STYLE.introVisualWrap}>
								<div className={STYLE.introVisual(row.imageClass)}>
									<img
										src="/images/main-bg.png"
										alt="about visual"
										className={STYLE.introImage}
									/>
								</div>
							</div>

							{index === 1 && (
								<div className={STYLE.trustWrap}>
									<p className={STYLE.trustText}>
										Trust Integrity Reliability Transformation
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			</section>

			<section className={`${STYLE.sectionBase} ${STYLE.sectionGapTop}`}>
				<div className={STYLE.sectionHeading}>
					<p className={STYLE.sectionHeadingEn}>HISTORY</p>
					<h3 className={STYLE.sectionHeadingKr}>히스토리</h3>
					<p className={STYLE.sectionHeadingDesc}>미라클의 발자취를 연도별로 확인해보세요.</p>
				</div>

				<div className={STYLE.historyGrid}>
					{historyItems.map((item) => (
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
					<p className={STYLE.sectionHeadingEn}>CERTIFICATE</p>
					<h3 className={STYLE.sectionHeadingKr}>인증서</h3>
					<p className={STYLE.sectionHeadingDesc}>공식 인증 및 수상 내역입니다.</p>
				</div>

				<div className={STYLE.certificateGrid}>
					{certificates.map((cert) => (
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
					<p className={STYLE.ceoEnLabel}>CHIEF EXECUTIVE OFFICER</p>
					<h3 className={STYLE.ceoTitle}>C.E.O</h3>
					<div className={STYLE.ceoBar} />
					<p className={STYLE.ceoNameWrap}>
						<span className={STYLE.ceoNameText}>김미라 / MIRA KIM</span>
					</p>
					<p className={STYLE.ceoDescription}>
						브랜드 전략과 시각 설계를 연결하며,{'\n'}의미 있는 변화가 일어나는 디자인을 만듭니다.{"\n"}C.E.O로서 미라클의 방향성을 총괄합니다.
					</p>

					<div className={STYLE.ceoSocialWrap}>
						{['IG', 'YT', 'X'].map((channel) => (
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
					<img src="/images/main-bg.png" alt="ceo" className={STYLE.ceoVisual} />
				</div>
			</section>
		</main>
	);
}
