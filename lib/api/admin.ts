import { apiDownload, apiFetch } from "./client";
import type { CourseReview, CourseStatus, Grade, PaymentMethod, PaymentStatus } from "@/lib/types";

export interface AdminDashboardData {
  stats: { students: number; active_subscriptions: number; pending_payments: number; revenue: number; courses: number; lessons: number };
  recent_payments: AdminPayment[];
  recent_students: Array<{ id: number; name: string; phone: string; grade?: string; governorate?: string; status: string; avatar_url?: string; created_at: string }>;
  weekly_activity: Array<{ day: string; interactions: number }>;
}

export interface AdminPayment {
  id: number;
  order_code: string;
  student_name: string;
  student_phone: string;
  student_email?: string;
  student_grade?: string;
  course_title: string;
  course_slug?: string;
  amount: number | string;
  course_price_egp: number | string;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  proof_path?: string;
  payer_name?: string;
  payer_phone?: string;
  transfer_to?: string;
  account_name?: string;
  transferred_at?: string;
  provider_order_id?: string;
  provider_capture_id?: string;
  source?: string;
  created_at: string;
  paid_at?: string;
  reviewed_at?: string;
  reviewer_name?: string;
  notes?: string;
  failure_reason?: string;
}

export interface AdminCourse {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  image_url: string;
  image_source: "url" | "upload";
  image_path?: string | null;
  image_upload_id?: string;
  display_image_url?: string;
  grade: Grade;
  price: number | string;
  paypal_price: number | string;
  status: CourseStatus;
  is_new: number | boolean;
  views_count: number;
  rating: number | string;
  tags_json?: string | string[] | null;
  lessons_count: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CoursePayload {
  slug: string;
  title: string;
  short_description: string;
  description: string;
  image_url: string;
  image_source: "url" | "upload";
  image_path?: string | null;
  image_upload_id?: string;
  display_image_url?: string;
  grade: Grade;
  price: number;
  paypal_price: number;
  status: CourseStatus;
  is_new: boolean;
  tags: string[];
}

export interface AdminUnit {
  id: number;
  course_id: number;
  title: string;
  sort_order: number;
}

export interface AdminCourseOption {
  id: number;
  title: string;
  status: CourseStatus;
  units: AdminUnit[];
}

export interface AdminLesson {
  id: number;
  course_id: number;
  unit_id?: number | null;
  title: string;
  description: string;
  duration_minutes: number;
  sort_order: number;
  is_free: number | boolean;
  video_source: "none" | "upload" | "youtube" | "vimeo" | "embed" | "external";
  video_url?: string | null;
  video_path?: string | null;
  video_mime?: string | null;
  pdf_source: "none" | "upload" | "url";
  pdf_url?: string | null;
  pdf_path?: string | null;
  pdf_mime?: string | null;
  thumbnail_source: "url" | "upload";
  thumbnail_url: string;
  thumbnail_path?: string | null;
  display_thumbnail_url?: string;
  status: CourseStatus;
  course_title: string;
  course_slug: string;
  unit_title?: string | null;
  has_video: number | boolean;
  has_pdf: number | boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStudent {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  grade?: Grade | null;
  governorate?: string | null;
  status: "active" | "disabled";
  avatar_url?: string | null;
  created_at: string;
  subscriptions_count: number;
}

export interface AdminQrCode {
  id: number;
  code: string;
  target_type: "course" | "lesson" | "pdf";
  target_id: number;
  target_title?: string | null;
  target_status?: CourseStatus | null;
  scans: number;
  is_active: boolean | number;
  expires_at?: string | null;
  created_at: string;
  link: string;
  image_url: string;
}


export interface AdminPlatformSettings {
  platform_name: string;
  instructor_name: string;
  support_email: string;
  vodafone_cash_number: string;
  vodafone_cash_account_name: string;
  instapay_mobile: string;
  instapay_account_name: string;
  instapay_ipa: string;
  whatsapp_number: string;
  paypal_mode: string;
  paypal_currency: string;
  paypal_enabled: boolean;
}

export type PaymentFilters = { status?: string; method?: string; date_from?: string; date_to?: string; search?: string; course_id?: string };
export type LessonFilters = { status?: string; course_id?: string; search?: string };

function queryString(filters: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
  const query = params.toString();
  return query ? `?${query}` : "";
}


export async function getAdminSettings() {
  return apiFetch<{ success: true; settings: AdminPlatformSettings }>("/admin/settings");
}

export async function updateAdminSettings(payload: Omit<AdminPlatformSettings, "paypal_mode" | "paypal_currency" | "paypal_enabled">) {
  return apiFetch<{ success: true; message: string }>("/admin/settings", { method: "PUT", body: JSON.stringify(payload) });
}

export async function getAdminDashboard() {
  return apiFetch<{ success: true } & AdminDashboardData>("/admin/dashboard");
}

export async function getAdminCourses() {
  return apiFetch<{ success: true; courses: AdminCourse[] }>("/admin/courses");
}

export async function createAdminCourse(payload: CoursePayload) {
  return apiFetch<{ success: true; course_id: number }>("/admin/courses", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminCourse(id: number, payload: CoursePayload) {
  return apiFetch<{ success: true; message: string }>(`/admin/courses/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function archiveAdminCourse(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/courses/${id}`, { method: "DELETE" });
}

export async function getAdminCourseOptions() {
  return apiFetch<{ success: true; courses: AdminCourseOption[] }>("/admin/course-options");
}

export async function createAdminUnit(payload: { course_id: number; title: string; sort_order: number }) {
  return apiFetch<{ success: true; unit_id: number; message: string }>("/admin/units", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminUnit(id: number, payload: { title: string; sort_order: number }) {
  return apiFetch<{ success: true; message: string }>(`/admin/units/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function deleteAdminUnit(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/units/${id}`, { method: "DELETE" });
}

export async function getAdminLessons(filters: LessonFilters = {}) {
  return apiFetch<{ success: true; lessons: AdminLesson[] }>(`/admin/lessons${queryString(filters)}`);
}

export interface LessonPayload {
  course_id: number;
  unit_id?: number | null;
  title: string;
  description: string;
  duration_minutes: number;
  sort_order: number;
  is_free: boolean;
  status: CourseStatus;
  video_source: "none" | "upload" | "youtube" | "vimeo" | "embed" | "external";
  video_url?: string;
  video_upload_id?: string;
  pdf_source: "none" | "upload" | "url";
  pdf_url?: string;
  pdf_upload_id?: string;
  thumbnail_source: "url" | "upload";
  thumbnail_url?: string;
  thumbnail_upload_id?: string;
}

export async function createAdminLesson(payload: LessonPayload) {
  return apiFetch<{ success: true; lesson_id: number; message: string }>("/admin/lessons", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminLesson(id: number, payload: LessonPayload) {
  return apiFetch<{ success: true; message: string }>(`/admin/lessons/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}


export async function getAdminLessonMediaUrl(id: number, type: "video" | "pdf") {
  return apiFetch<{ success: true; url: string; fallback_url?: string; expires_in: number }>(`/lessons/${id}/access-token`, { method: "POST", body: JSON.stringify({ type }) });
}

export async function deleteAdminLesson(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/lessons/${id}`, { method: "DELETE" });
}

export async function getAdminStudents(search = "") {
  return apiFetch<{ success: true; students: AdminStudent[] }>(`/admin/students${queryString({ search })}`);
}

export async function setAdminStudentStatus(id: number, status: "active" | "disabled") {
  return apiFetch<{ success: true; message: string }>(`/admin/students/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export async function activateAdminSubscription(studentId: number, payload: { course_id: number; method: PaymentMethod; expires_at?: string }) {
  return apiFetch<{ success: true; message: string }>(`/admin/students/${studentId}/subscriptions`, { method: "POST", body: JSON.stringify(payload) });
}

export async function getAdminQrCodes() {
  return apiFetch<{ success: true; qr_codes: AdminQrCode[] }>("/admin/qrcodes");
}

export async function createAdminQrCode(payload: { target_type: "course" | "lesson" | "pdf"; target_id: number; expires_at?: string }) {
  return apiFetch<{ success: true; id: number; code: string; link: string; image_url: string; message: string }>("/admin/qrcodes", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateAdminQrCode(id: number, payload: { is_active: boolean; expires_at?: string }) {
  return apiFetch<{ success: true; message: string }>(`/admin/qrcodes/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteAdminQrCode(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/qrcodes/${id}`, { method: "DELETE" });
}

export async function getAdminPayments(filters: PaymentFilters = {}) {
  return apiFetch<{ success: true; payments: AdminPayment[]; summary: { count: number; approved_count: number; pending_count: number; approved_egp: number } }>(`/admin/payments${queryString(filters)}`);
}

export async function reviewPayment(id: number, status: "approved" | "rejected", notes = "") {
  return apiFetch<{ success: true; message: string }>(`/admin/payments/${id}`, { method: "PATCH", body: JSON.stringify({ status, notes }) });
}

export async function exportPayments(filters: PaymentFilters = {}) {
  return apiDownload(`/admin/payments-export${queryString(filters)}`, `payments-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export async function downloadPaymentProof(id: number) {
  return apiDownload(`/admin/payments/${id}/proof`);
}


export async function getAdminReviews(filters: { status?: string; search?: string } = {}) {
  return apiFetch<{ success: true; reviews: CourseReview[] }>(`/admin/reviews${queryString(filters)}`);
}

export async function updateAdminReview(id: number, payload: { status: "pending" | "published" | "rejected"; admin_reply?: string }) {
  return apiFetch<{ success: true; message: string }>(`/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteAdminReview(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/reviews/${id}`, { method: "DELETE" });
}

export interface AdminSubscription {
  id: number;
  course_id: number;
  course_title: string;
  status: string;
  method: PaymentMethod;
  payment_id?: number | null;
  activated_at?: string | null;
  expires_at?: string | null;
  created_at: string;
}

export async function deleteAdminCoursePermanently(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/courses/${id}/permanent`, { method: "DELETE" });
}

export async function deleteAdminStudent(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/students/${id}`, { method: "DELETE" });
}

export async function getAdminStudentSubscriptions(id: number) {
  return apiFetch<{ success: true; subscriptions: AdminSubscription[] }>(`/admin/students/${id}/subscriptions`);
}

export async function deleteAdminSubscription(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/subscriptions/${id}`, { method: "DELETE" });
}

export async function deleteAdminPayment(id: number) {
  return apiFetch<{ success: true; message: string }>(`/admin/payments/${id}`, { method: "DELETE" });
}

export async function getMaintenanceSummary() {
  return apiFetch<{ success: true; demo: { courses: number; students: number }; content?: { courses: number; lessons: number; students: number; payments: number; subscriptions: number } }>("/admin/maintenance/summary");
}

export async function cleanupDemoData(confirmation: string) {
  return apiFetch<{ success: true; message: string; removed_courses: number; removed_students: number }>("/admin/maintenance/cleanup-demo", {
    method: "POST",
    body: JSON.stringify({ confirmation }),
  });
}


export async function clearPlatformContent(confirmation: string) {
  return apiFetch<{ success: true; message: string; removed_students: number }>("/admin/maintenance/clear-content", {
    method: "POST",
    body: JSON.stringify({ confirmation }),
  });
}
