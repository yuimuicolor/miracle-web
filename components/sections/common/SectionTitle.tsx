interface SectionTitleProps {
  title: string;
  color?: 'white' | 'black';
}

const STYLE = {
  wrapper: `w-full flex flex-col justify-center items-start text-left
    gap-[0.8rem]
    md:flex-row md:items-center
    md:gap-[2rem]
    lg:gap-[6rem]
  `,

  title: `
    font-gilda font-normal uppercase antialiased [text-rendering:geometricPrecision] [-webkit-font-smoothing:antialiased]
    text-[3.4rem] leading-[1.08] tracking-[-0.01em]
    md:text-[5.6rem] md:leading-[5.6rem] md:tracking-[-0.05em]
    lg:text-[8rem] lg:leading-[8rem] lg:tracking-[0em]
  `,
  line: 'w-full h-[0.1rem] md:flex-1',
  textColor: (color: 'white' | 'black') => (color === 'black' ? 'text-black' : 'text-white'),
  lineColor: (color: 'white' | 'black') => (color === 'black' ? 'bg-black' : 'bg-white'),
  starColor: (color: 'white' | 'black') => (color === 'black' ? 'text-point' : 'text-point-light'),
};

const SectionTitle = ({ title, color = 'white' }: SectionTitleProps) => {
  return (
    <div className={STYLE.wrapper}>
        <h3 className={`${STYLE.title} ${STYLE.textColor(color)}`}>
          {title} <span className={STYLE.starColor(color)}>*</span>
        </h3>
      <div className={`${STYLE.line} ${STYLE.lineColor(color)}`}></div>
    </div>
  );
};

export default SectionTitle;