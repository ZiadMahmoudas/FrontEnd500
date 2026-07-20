"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { translateArabicText, type Locale } from "@/lib/i18n/translations";

type LanguageContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  isEnglish: boolean;
  switchLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const textOriginals = new WeakMap<Text, string>();
const attributeOriginals = new WeakMap<Element, Map<string, string>>();
const attrs = ["placeholder", "title", "aria-label", "alt", "data-label"] as const;
const ignoredTags = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA"]);
let titleOriginal = "";

function shouldSkip(node: Node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  if (!element) return false;
  if (ignoredTags.has(element.tagName)) return true;
  return Boolean(element.closest("[data-no-translate], [translate='no'], [contenteditable='true']"));
}

function translateTextNode(node: Text, locale: Locale) {
  if (shouldSkip(node)) return;
  const current = node.nodeValue ?? "";
  if (!textOriginals.has(node) && /[\u0600-\u06FF]/.test(current)) textOriginals.set(node, current);
  const original = textOriginals.get(node);
  if (!original) return;
  const next = locale === "en" ? translateArabicText(original) : original;
  if (node.nodeValue !== next) node.nodeValue = next;
}

function translateAttributes(element: Element, locale: Locale) {
  if (shouldSkip(element)) return;
  let originals = attributeOriginals.get(element);
  for (const attr of attrs) {
    const current = element.getAttribute(attr);
    if (!current) continue;
    if (!originals && /[\u0600-\u06FF]/.test(current)) {
      originals = new Map();
      attributeOriginals.set(element, originals);
    }
    if (originals && !originals.has(attr) && /[\u0600-\u06FF]/.test(current)) originals.set(attr, current);
    const original = originals?.get(attr);
    if (!original) continue;
    const next = locale === "en" ? translateArabicText(original) : original;
    if (current !== next) element.setAttribute(attr, next);
  }
}

function translateTree(root: Node, locale: Locale) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, locale);
    return;
  }
  if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root as Element, locale);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current: Node | null = walker.currentNode;
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) translateTextNode(current as Text, locale);
    else if (current.nodeType === Node.ELEMENT_NODE) translateAttributes(current as Element, locale);
    current = walker.nextNode();
  }
}

function translateHead(locale: Locale) {
  const title = document.title;
  if (/[\u0600-\u06FF]/.test(title)) titleOriginal = title;
  if (titleOriginal) document.title = locale === "en" ? translateArabicText(titleOriginal) : titleOriginal;
  document.querySelectorAll<HTMLMetaElement>('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]').forEach(meta => {
    const current = meta.content;
    const originalKey = "i18nOriginal";
    const dataset = meta.dataset as DOMStringMap & { i18nOriginal?: string };
    if (!dataset[originalKey] && /[\u0600-\u06FF]/.test(current)) dataset[originalKey] = current;
    const original = dataset[originalKey];
    if (original) meta.content = locale === "en" ? translateArabicText(original) : original;
  });
}

function readStoredLocale(fallback: Locale): Locale {
  try {
    return localStorage.getItem("elmohager-locale") === "en" ? "en" : fallback;
  } catch {
    return fallback;
  }
}

export function LanguageProvider({ children, initialLocale = "ar" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const translating = useRef(false);

  useEffect(() => {
    const stored = readStoredLocale(initialLocale);
    if (stored !== locale) setLocale(stored);
  // Initial preference must be read exactly once; route changes must not reset it.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "ar";
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
    document.documentElement.dataset.locale = locale;
    document.body.dataset.locale = locale;
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    try { localStorage.setItem("elmohager-locale", locale); } catch { /* storage may be unavailable */ }

    translating.current = true;
    translateTree(document.body, locale);
    translateHead(locale);
    document.documentElement.classList.remove("i18n-booting");
    translating.current = false;

    const observer = new MutationObserver(mutations => {
      if (translating.current) return;
      translating.current = true;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target, locale);
        else {
          mutation.addedNodes.forEach(node => translateTree(node, locale));
          if (mutation.target.nodeType === Node.ELEMENT_NODE) translateAttributes(mutation.target as Element, locale);
        }
      }
      translateHead(locale);
      translating.current = false;
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...attrs],
    });

    const originalAlert = window.alert.bind(window);
    const originalConfirm = window.confirm.bind(window);
    const originalPrompt = window.prompt.bind(window);
    window.alert = (message?: unknown) => originalAlert(locale === "en" ? translateArabicText(String(message ?? "")) : String(message ?? ""));
    window.confirm = (message?: string) => originalConfirm(locale === "en" ? translateArabicText(message || "") : message || "");
    window.prompt = (message?: string, defaultValue?: string) => originalPrompt(locale === "en" ? translateArabicText(message || "") : message || "", defaultValue);

    return () => {
      observer.disconnect();
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    };
  }, [locale, pathname]);

  const switchLocale = useCallback((next: Locale) => {
    if (next === locale) return;
    startTransition(() => setLocale(next));
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    dir: locale === "en" ? "ltr" : "rtl",
    isEnglish: locale === "en",
    switchLocale,
    toggleLocale: () => switchLocale(locale === "en" ? "ar" : "en"),
  }), [locale, switchLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
