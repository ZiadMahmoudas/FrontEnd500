"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
const hrefOriginals = new WeakMap<HTMLAnchorElement, string>();
const attrs = ["placeholder", "title", "aria-label", "alt"] as const;
const ignoredTags = new Set(["SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA"]);

function shouldSkip(node: Node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
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

function localizeAnchor(element: Element, locale: Locale) {
  if (!(element instanceof HTMLAnchorElement)) return;
  const href = element.getAttribute("href");
  if (!href || !href.startsWith("/") || href.startsWith("//")) return;
  if (/^\/(?:_next|api)(?:\/|$)/.test(href) || /\.[^/]+$/.test(href)) return;
  if (!hrefOriginals.has(element)) hrefOriginals.set(element, href.replace(/^\/en(?=\/|$)/, "") || "/");
  const original = hrefOriginals.get(element) || "/";
  const next = locale === "en" ? (original === "/" ? "/en" : `/en${original}`) : original;
  if (href !== next) element.setAttribute("href", next);
}

function translateTree(root: Node, locale: Locale) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, locale);
    return;
  }
  if (root.nodeType === Node.ELEMENT_NODE) {
    translateAttributes(root as Element, locale);
    localizeAnchor(root as Element, locale);
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current: Node | null = walker.currentNode;
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) translateTextNode(current as Text, locale);
    else if (current.nodeType === Node.ELEMENT_NODE) {
      translateAttributes(current as Element, locale);
      localizeAnchor(current as Element, locale);
    }
    current = walker.nextNode();
  }
}

function stripLocale(path: string) {
  if (path === "/en" || path === "/ar") return "/";
  return path.replace(/^\/(en|ar)(?=\/)/, "") || "/";
}

export function LanguageProvider({ children, initialLocale = "ar" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const translating = useRef(false);

  useEffect(() => {
    setLocale(pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ar");
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
    document.documentElement.dataset.locale = locale;
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("elmohager-locale", locale);

    translating.current = true;
    translateTree(document.body, locale);
    translating.current = false;

    const observer = new MutationObserver(mutations => {
      if (translating.current) return;
      translating.current = true;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target, locale);
        else {
          mutation.addedNodes.forEach(node => translateTree(node, locale));
          if (mutation.target.nodeType === Node.ELEMENT_NODE) {
            translateAttributes(mutation.target as Element, locale);
            localizeAnchor(mutation.target as Element, locale);
          }
        }
      }
      translating.current = false;
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...attrs, "href"] });
    return () => observer.disconnect();
  }, [locale, pathname]);

  const switchLocale = useCallback((next: Locale) => {
    if (next === locale) return;
    const base = stripLocale(window.location.pathname);
    const targetPath = next === "en" ? (base === "/" ? "/en" : `/en${base}`) : base;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("elmohager-locale", next);
    window.location.assign(`${targetPath}${window.location.search}${window.location.hash}`);
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
