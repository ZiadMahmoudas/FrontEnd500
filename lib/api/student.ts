import { apiFetch } from "./client";
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
