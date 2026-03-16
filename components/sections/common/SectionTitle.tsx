interface SectionTitleProps {
  title: string;
  color?: 'white' | 'black';
}

const STYLE = {

  wrapper: `w-full flex flex-col justify-center items-center text-center gap-[0.8rem]
   sm:flex-row sm:text-left
   sm:gap-[2rem]  md:gap-[6rem]
  `,
    
  title: `
    font-gilda font-normal uppercase 
    text-[3.6rem] leading-[3.6rem] tracking-[-0.05em]
    sm:text-[5.6rem] sm:leading-[5.6rem] sm:tracking-[-0.05em]
    md:text-[8rem] md:leading-[8rem] md:tracking-[0em]
  `,
  line: 'h-[0.1rem] sm:flex-1',
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