import { apiFetch, saveToken } from "./client";
import type { AuthUser } from "./auth";

export interface StudentDashboardData {
  user: AuthUser;
  courses: Array<{ id: number; slug: string; title: string; image_url: string; grade: string; status: string; activated_at?: string; expires_at?: string; progress: number | string }>;
  recent_lessons: Array<{ id: number; title: string; thumbnail_url: string; duration_minutes: number; course_title: string; watched_seconds: number; updated_at: string }>;
  stats: { courses_count: number | string; completed_lessons: number | string | null; watched_seconds: number | string };
}

export async function getStudentDashboard() {
  return apiFetch<{ success: true } & StudentDashboardData>("/student/dashboard");
}

export async function getStudentProfile() {
  return apiFetch<{ success: true; user: AuthUser }>("/student/profile");
}

export async function updateStudentProfile(payload: {
  name: string;
  phone: string;
  guardianPhone: string;
  email?: string;
  grade: string;
  governorate?: string;
}) {
  const response = await apiFetch<{ success: true; message: string; token: string; user: AuthUser }>("/student/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  saveToken(response.token);
  return response;
}

export async function uploadStudentAvatar(file: File) {
  const form = new FormData();
  form.append("avatar", file);
  return apiFetch<{ success: true; message: string; avatarUrl: string }>("/student/profile/avatar", {
    method: "POST",
    body: form,
  });
}

export async function deleteStudentAvatar() {
  return apiFetch<{ success: true; message: string }>("/student/profile/avatar", { method: "DELETE" });
}

export async function changeStudentPassword(payload: { currentPassword: string; newPassword: string }) {
  return apiFetch<{ success: true; message: string }>("/student/profile/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
