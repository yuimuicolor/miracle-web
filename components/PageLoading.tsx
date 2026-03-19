interface PageLoadingProps {
	label?: string;
}

const STYLE = {
	container:
		"no-header-offset flex min-h-screen-minus-header-offset w-full items-center justify-center bg-bg-dark px-[1.6rem] md:px-[4rem] lg:px-[8rem]",
	stack: "flex flex-col items-center gap-[1.6rem]",
	spinner:
		"h-[4.8rem] w-[4.8rem] animate-spin rounded-full border-[0.4rem] border-white/20 border-t-point-light",
	text:
		"font-noto text-[1.8rem] tracking-[0.08em] text-white/70",
};

export default function PageLoading({ label = "LOADING" }: PageLoadingProps) {
	return (
		<div className={STYLE.container}>
			<div className={STYLE.stack}>
				<div className={STYLE.spinner} aria-hidden="true" />
				<p className={STYLE.text}>{label}</p>
			</div>
		</div>
	);
}
