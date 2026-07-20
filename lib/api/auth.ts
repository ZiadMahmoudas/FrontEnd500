import { apiFetch, clearToken, saveToken } from "./client";

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  guardianPhone?: string;
  email?: string;
  role: "student" | "admin" | "instructor";
  grade?: string;
  governorate?: string;
  avatarUrl?: string;
  status?: string;
}

interface AuthResponse {
  success: true;
  token: string;
  user: AuthUser;
}

export async function login(payload: { identifier: string; password: string }) {
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  saveToken(response.token);
  return response;
}

export async function register(payload: {
  name: string;
  phone: string;
  guardianPhone: string;
  email?: string;
  password: string;
  grade: string;
  governorate: string;
}) {
  const response = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  saveToken(response.token);
  return response;
}

export async function forgotPassword(identifier: string) {
  return apiFetch<{
    success: true;
    requestId?: number;
    expiresInMinutes?: number;
    delivery?: "email" | "support";
    destination?: string;
    whatsappUrl?: string;
    debugCode?: string;
    message: string;
  }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function resetPassword(payload: { requestId: number; code: string; newPassword: string }) {
  return apiFetch<{ success: true; message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function me() {
  return apiFetch<{ success: true; user: AuthUser }>("/auth/me");
}

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}
