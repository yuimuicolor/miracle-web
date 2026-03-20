// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // /admin으로 시작하는 모든 경로를 보호하되, /admin/login은 제외
  matcher: ["/admin/:path*((?!login).*)"],
};