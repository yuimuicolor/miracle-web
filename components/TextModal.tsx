interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function TextModal({ isOpen, onClose, title, content }: TextModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 px-[2rem] backdrop-blur-sm"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <div 
        className="relative w-full max-w-[60rem] bg-white p-[3rem] md:p-[5rem]"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        <h2 className="mb-[2.4rem] text-[2.4rem] md:text-[3.2rem] font-bold text-black">
          {title}
        </h2>
        
        <div className="max-h-[50vh] overflow-y-auto pr-[1rem] text-[1.8rem] lg:text-[2.0rem] leading-[1.8] text-gray-600 whitespace-pre-wrap break-keep">
          {content}
        </div>

        <button 
          onClick={onClose}
          className="mt-[4rem] h-[6rem] w-full bg-point text-[1.8rem] font-bold text-white transition-opacity hover:opacity-90"
        >
          확인
        </button>
      </div>
    </div>
  );
}