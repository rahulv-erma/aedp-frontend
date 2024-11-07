import { NextRequest, NextResponse } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";

import { LOCALES, DEFAULT_LOCALE, AUTH_PATHS, ROUTES } from "@/constants";

import { getAuthToken } from "./utils";

const I18nMiddleware = createI18nMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  urlMappingStrategy: "rewrite",
  resolveLocaleFromRequest: (request) => {
    // this determines the language when an uncommitted request (aka the user
    // hasn't set their language yet) arrives and the i18n middleware will by
    // default try to match the locale to the one set on the user's computer.
    // instead, we just wat the default locale to always be English
    return DEFAULT_LOCALE;
  },
});

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname, origin } = nextUrl;

  if (
    request.nextUrl.pathname.startsWith(
      "/.well-known/apple-developer-merchantid-domain-association",
    )
  ) {
    if (process.env.NEXT_PUBLIC_GROW_PROD) {
      return NextResponse.rewrite(
        new URL("/.well-known/prod-apple-domain-verification.txt", request.url),
      );
    } else {
      return NextResponse.rewrite(
        new URL("/.well-known/test-apple-domain-verification.txt", request.url),
      );
    }
  }

  const isAuthPath = AUTH_PATHS.map((p) => "/" + p).includes(pathname);
  const isIndexPath = pathname === "/";
  if (!!getAuthToken()) {
    if (isAuthPath || isIndexPath) {
      return NextResponse.redirect(new URL(ROUTES.therapists, origin));
    }
  } else {
    if (!isAuthPath) {
      return NextResponse.redirect(new URL(ROUTES.login, origin));
    }
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    "/(.well-known/.*)",
    "/((?!api|static|.*\\..*|_next|robots.txt).*)",
  ],
};
