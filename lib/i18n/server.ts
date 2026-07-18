import { headers } from "next/headers";
import type { Locale } from "./translations";

export async function getServerLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  return requestHeaders.get("x-elmohager-locale") === "en" ? "en" : "ar";
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? `/en${normalized}` || "/en" : normalized || "/";
}
