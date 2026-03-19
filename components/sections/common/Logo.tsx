import { BRAND_DATA } from "@/lib/siteData";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "max-w-[16rem]" }: LogoProps) {
  return (
    <div className={`w-full ${className}`}>
      <img
        src={BRAND_DATA.logoSrc}
        alt={BRAND_DATA.logoAlt}
        className="h-auto w-full"
        loading="eager"
      />
    </div>
  );
}