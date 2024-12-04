import { NextResponse } from "next/server";

const { match } = require("@formatjs/intl-localematcher");
const Negotiator = require("negotiator");

let defaultLocale = "en";
let locales = ["en", "de", "bn"];

const geLocale = (request) => {
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  let headers = { "accept-language": acceptedLanguage };
  let languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
};

export function middleware(request, next) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/` && pathname !== `/${locale}`)
  );

  if (pathnameIsMissingLocale) {
    const locale = geLocale(request);

    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api)
    "/((?!api|assets|.*\\..*|_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
