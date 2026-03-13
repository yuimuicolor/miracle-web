interface SectionTitleProps {
  title: string;
  color?: 'white' | 'black';
}

const STYLE = {
  wrapper: 'flex flex-col md:flex-row justify-center items-center gap-2 md:gap-5 min-[1440px]:gap-15 w-full text-center md:text-left',
  title: `
    font-gilda text-[2.25rem] leading-[1.2] tracking-[-0.05em]
    md:text-[3.5rem] md:leading-[1.2] md:tracking-[-0.05em]
    min-[1440px]:text-[5rem] min-[1440px]:leading-[5rem] min-[1440px]:tracking-[0em]
    font-normal uppercase
  `,
  line: 'w-full md:flex-1 h-0.5',
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