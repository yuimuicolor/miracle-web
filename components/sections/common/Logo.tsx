import { useSettings } from "@/context/SiteSettingsContext";


export default  function Logo() {
  const settings = useSettings();

  if (!settings) {
    return null; // 설정이 없으면 로고를 렌더링하지 않음
  }

  return (
    <div className={`w-full`}>
      <img
        src={settings?.brandLogoSrc}
        alt={settings?.brandLogoAlt}
        loading="eager"
      />
    </div>
  );
}