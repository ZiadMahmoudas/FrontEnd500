const DEFAULT_API_URL = "http://127.0.0.1:5188/api";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
const TOKEN_KEY = "codepath_token";
const AUTH_EVENT = "codepath-auth-change";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function emitAuthChange(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
}

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
    emitAuthChange();
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    emitAuthChange();
  }
}

function networkError(): ApiError {
  return new ApiError(
    "تعذر الاتصال بخادم المنصة. تأكد من اتصال الإنترنت ثم أعد المحاولة.",
    0,
  );
}


export function normalizeLocalMediaUrl(value: string): string {
  if (!value) return value;
  try {
    const fallbackOrigin = typeof window !== "undefined" ? window.location.origin : "http://127.0.0.1:3000";
    const url = new URL(value, fallbackOrigin);
    const isLegacyLocalApi = (url.hostname === "127.0.0.1" || url.hostname === "localhost") && (url.port === "8080" || url.port === "8081");
    if (isLegacyLocalApi) {
      const apiOrigin = new URL(API_URL).origin;
      const replacement = new URL(apiOrigin);
      url.protocol = replacement.protocol;
      url.hostname = replacement.hostname;
      url.port = replacement.port;
    }
    return url.toString();
  } catch {
    return value;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw networkError();
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    if (response.status === 401) clearToken();
    throw new ApiError(payload.message || "تعذر تنفيذ الطلب.", response.status, payload.errors);
  }
  return payload as T;
}

export async function apiDownload(path: string, filename?: string): Promise<void> {
  const token = getStoredToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, { headers, cache: "no-store" });
  } catch {
    throw networkError();
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401) clearToken();
    throw new ApiError(payload.message || "تعذر تحميل الملف.", response.status);
  }
  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="?([^";]+)"?/i);
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename || match?.[1] || "download";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export { API_URL, AUTH_EVENT };
