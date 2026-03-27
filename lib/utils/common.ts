export const getBaseUrl = () => {
    // 브라우저 환경에서는 빈 문자열을 반환하여 상대 경로로 API 요청을 보냅니다.
  if (typeof window !== "undefined") return "";
  // 서버 환경에서는 환경 변수에서 사이트 URL을 가져오거나, 기본값으로 localhost:3000을 사용합니다.
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};
