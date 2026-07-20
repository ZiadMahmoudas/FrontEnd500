import { cookies } from "next/headers";
import type { Locale } from "./translations";

/**
 * Static page content is rendered in Arabic so the client translator can switch
 * in both directions without a full reload. The preferred language is still
 * read from the cookie and passed to the root provider for the initial UI.
 */
export async function getServerLocale(): Promise<Locale> {
  return "ar";
}

export async function getPreferredLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "ar";
}

/** One route tree only: language never changes the current URL. */
export function localizedPath(_locale: Locale, path: string): string {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}
