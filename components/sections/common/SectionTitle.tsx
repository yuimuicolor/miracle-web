interface SectionTitleProps {
  title: string;
  color?: 'white' | 'black';
}

const SectionTitle = ({ title, color = 'white' }: SectionTitleProps) => {
  const textColorClass = color === 'black' ? 'text-black' : 'text-white';
  const lineColorClass = color === 'black' ? 'bg-black' : 'bg-white';
  const starColorClass = color === 'black' ? 'text-point' : 'text-point-light';

  return (
    <div className="flex flex-row justify-center items-center mb-10 w-full">
      <h2 className={`font-gilda text-[80px] mr-4 uppercase ${textColorClass}`}>
        {title} <span className={starColorClass}>*</span>
      </h2>
      <div className={`flex-1 h-[2px] ${lineColorClass}`}></div>
    </div>
  );
};

export default SectionTitle;