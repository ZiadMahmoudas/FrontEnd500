import { apiFetch } from "./client";
import type { Course, CourseReview, Lesson, ReviewSummary } from "@/lib/types";

export async function getCourses(): Promise<Course[]> {
  const response = await apiFetch<{ success: true; courses: Course[] }>("/courses");
  return response.courses;
}

export async function getCourseBySlug(slug: string): Promise<{ course: Course; units: { id: string; title: string; sort_order: number }[]; lessons: Lesson[]; hasAccess: boolean; canReview: boolean }> {
  const response = await apiFetch<{ success: true; course: Course; units: { id: string; title: string; sort_order: number }[]; lessons: Lesson[]; has_access: boolean; can_review?: boolean }>(`/courses/${encodeURIComponent(slug)}`);
  return { course: response.course, units: response.units, lessons: response.lessons, hasAccess: response.has_access, canReview: Boolean(response.can_review) };
}

export async function getCourseById(id: string): Promise<{ course: Course; hasAccess: boolean }> {
  const response = await apiFetch<{ success: true; course: Course; has_access: boolean }>(`/courses-id/${encodeURIComponent(id)}`);
  return { course: response.course, hasAccess: response.has_access };
}

export async function getCourseReviews(courseId: string) {
  return apiFetch<{ success: true; reviews: CourseReview[]; summary: ReviewSummary }>(`/courses-id/${courseId}/reviews`);
}

export async function getMyCourseReview(courseId: string) {
  return apiFetch<{ success: true; review: CourseReview | null; can_review: boolean }>(`/courses-id/${courseId}/reviews/mine`);
}

export async function saveCourseReview(courseId: string, payload: { rating: number; comment: string; image_upload_id?: string; remove_image?: boolean }) {
  return apiFetch<{ success: true; message: string }>(`/courses-id/${courseId}/reviews`, { method: "POST", body: JSON.stringify(payload) });
}
