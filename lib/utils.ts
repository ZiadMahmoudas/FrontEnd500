import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number) {
  if (price === 0) return "مجاني";
  return `${price.toLocaleString("ar-EG")} ج.م`;
}

export function formatNumber(n: number) {
  return n.toLocaleString("ar-EG");
}
