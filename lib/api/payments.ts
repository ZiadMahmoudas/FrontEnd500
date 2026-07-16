import { apiFetch } from "./client";
import type { PaymentMethod } from "@/lib/types";

export interface PaymentSettings {
  vodafone_cash: { number: string; account_name: string };
  instapay: { mobile: string; account_name: string; ipa: string };
  whatsapp: { number: string };
  paypal: { mode: "sandbox" | "live"; currency: string; enabled: boolean };
}

export async function getPaymentSettings() {
  return apiFetch<{ success: true } & PaymentSettings>("/payments/settings");
}

export async function submitManualPayment(data: FormData) {
  return apiFetch<{ success: true; payment_id: number; order_code: string; status: string; message: string }>("/payments/manual", { method: "POST", body: data });
}

export async function enrollFreeCourse(courseId: number) {
  return apiFetch<{ success: true; status: string; order_code?: string; message: string }>("/payments/free", { method: "POST", body: JSON.stringify({ course_id: courseId }) });
}

export async function createPayPalOrder(courseId: number) {
  return apiFetch<{ success: true; order: { id: string }; payment_id: number; order_code: string }>("/payments/paypal/create", { method: "POST", body: JSON.stringify({ course_id: courseId }) });
}

export async function capturePayPalOrder(orderId: string) {
  return apiFetch<{ success: true; status: string; message: string }>("/payments/paypal/capture", { method: "POST", body: JSON.stringify({ order_id: orderId }) });
}

export interface MyPayment {
  id: number;
  order_code: string;
  amount: number | string;
  course_price_egp: number | string;
  currency: string;
  method: PaymentMethod;
  status: "pending" | "approved" | "rejected" | "failed" | "cancelled" | "refunded";
  transaction_id?: string;
  payer_name?: string;
  payer_phone?: string;
  transfer_to?: string;
  account_name?: string;
  transferred_at?: string;
  provider_order_id?: string;
  provider_capture_id?: string;
  failure_reason?: string;
  created_at: string;
  paid_at?: string;
  course_title: string;
  course_slug: string;
}

export async function getMyPayments() {
  return apiFetch<{ success: true; payments: MyPayment[] }>("/payments/mine");
}
