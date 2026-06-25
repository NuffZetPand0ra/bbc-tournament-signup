import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for those starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico, sitemap.xml, robots.txt, manifest.json, icons/
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|.*\\.png$).*)"],
};
