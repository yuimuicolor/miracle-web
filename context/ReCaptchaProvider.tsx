"use client"; // 👈 이게 핵심입니다!

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      language="ko"
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
