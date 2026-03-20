import {  } from "@/lib/siteData";

interface LogoProps {
  className?: string;
  src?: string; 
  alt?: string; 
}

export default function Logo({ 
  className = "max-w-[16rem]", 
  src = "/images/miracle-main-logo.png", // 데이터 로딩 전 보여줄 기본값
  alt = "Miracle" 
}: LogoProps) {
  return (
    <div className={`w-full ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-auto w-full"
        loading="eager"
      />
    </div>
  );
}