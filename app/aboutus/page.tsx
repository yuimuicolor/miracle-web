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

export default function AboutUsPage() {
	return (
		<main className="bg-bg-dark text-white min-h-screen pt-[180px] pb-32 px-6 sm:px-10 md:px-20">
			<section className="max-w-[1280px] mx-auto">
				<div className="flex items-center gap-4 mb-8">
					<h1 className="font-en-xl-r sm:font-en-xxl-r">ABOUT US<span className="text-point">*</span></h1>
					<div className="h-[2px] bg-white/90 flex-1" />
				</div>

				<div className="space-y-14">
					{introRows.map((row, index) => (
						<div
							key={row.title}
							className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${row.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
						>
							<div className="space-y-5">
								<h2 className="font-kr-l-bold">
									<span className="bg-point px-2 py-1 inline-block">{row.title}</span>
								</h2>
								<p className="font-kr-l-med leading-[1.35]">
									<span className="bg-white text-point px-2 py-1 inline-block">{row.accent}</span>
								</p>
								<p className="font-kr-xs-reg text-white/85 whitespace-pre-line max-w-[560px]">{row.body}</p>
							</div>

							<div className="flex justify-center lg:justify-end">
								<div
									className={`w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] overflow-hidden ${row.imageClass}`}
								>
									<img
										src="/images/main-bg.png"
										alt="about visual"
										className="w-full h-full object-cover saturate-150 contrast-110"
									/>
								</div>
							</div>

							{index === 1 && (
								<div className="lg:col-span-2 pt-4">
									<p className="font-playwrite text-[48px] sm:text-[64px] text-white/95 leading-none break-words">
										Trust Integrity Reliability Transformation
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			</section>

			<section className="max-w-[1280px] mx-auto mt-28">
				<div className="text-center mb-12">
					<p className="font-en-noto-xs-med tracking-[0.32em] text-white/80">HISTORY</p>
					<h3 className="font-kr-l-bold inline-block bg-point px-3 py-1 mt-2">히스토리</h3>
					<p className="font-kr-xs-reg text-white/70 mt-3">미라클의 발자취를 연도별로 확인해보세요.</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{historyItems.map((item) => (
						<article key={`${item.year}-${item.date}`} className="relative">
							<div className="w-full h-[260px] overflow-hidden">
								<img src="/images/main-bg.png" alt={item.title} className="w-full h-full object-cover" />
							</div>
							<span className="absolute top-3 right-3 text-point bg-white/95 px-2 py-1 font-en-xl-r leading-none">
								{item.year}
							</span>
							<div className="mt-3">
								<p className="font-en-s-reg text-white/80">{item.date}</p>
								<p className="font-kr-xs-bold">{item.title}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="max-w-[1280px] mx-auto mt-28">
				<div className="text-center mb-12">
					<p className="font-en-noto-xs-med tracking-[0.32em] text-white/80">CERTIFICATE</p>
					<h3 className="font-kr-l-bold inline-block bg-point px-3 py-1 mt-2">인증서</h3>
					<p className="font-kr-xs-reg text-white/70 mt-3">공식 인증 및 수상 내역입니다.</p>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
					{certificates.map((cert) => (
						<article key={cert.id} className="relative overflow-hidden">
							<div className="aspect-[3/4]">
								<img src="/images/main-bg.png" alt={cert.title} className="w-full h-full object-cover" />
							</div>
							<div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
								<p className="font-en-noto-xs-med text-[10px] text-white/85">{cert.title}</p>
								<p className="font-kr-xxs-reg text-white/95">{cert.desc}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="max-w-[1280px] mx-auto mt-28 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 items-end">
				<div>
					<p className="font-en-noto-xs-med tracking-[0.28em] text-white/80">CHIEF EXECUTIVE OFFICER</p>
					<h3 className="font-en-xxl-r mt-2">C.E.O</h3>
					<div className="w-28 h-[3px] bg-white mt-4" />
					<p className="font-kr-s-reg mt-5">
						<span className="bg-point px-2 py-1">김미라 / MIRA KIM</span>
					</p>
					<p className="font-kr-xs-reg text-white/80 mt-5 leading-[1.6]">
						브랜드 전략과 시각 설계를 연결하며,\n의미 있는 변화가 일어나는 디자인을 만듭니다.\nC.E.O로서 미라클의 방향성을 총괄합니다.
					</p>

					<div className="flex gap-3 mt-8">
						{['IG', 'YT', 'X'].map((channel) => (
							<button
								key={channel}
								className="w-9 h-9 rounded-full border border-white/60 font-en-noto-xs-med text-white/90"
							>
								{channel}
							</button>
						))}
					</div>
				</div>

				<div className="w-full h-[420px] sm:h-[560px] overflow-hidden">
					<img src="/images/main-bg.png" alt="ceo" className="w-full h-full object-cover" />
				</div>
			</section>
		</main>
	);
}
