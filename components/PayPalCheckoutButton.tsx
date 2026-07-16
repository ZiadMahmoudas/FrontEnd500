"use client";

import { useEffect, useId, useState } from "react";
import { createPayPalOrder, capturePayPalOrder } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError?: (error: unknown) => void;
        style?: Record<string, string>;
      }) => { render: (selector: string) => Promise<void>; close?: () => void };
    };
  }
}

export default function PayPalCheckoutButton({ courseId, onSuccess }: { courseId: number; onSuccess?: () => void }) {
  const rawId = useId();
  const containerId = `paypal-${rawId.replace(/:/g, "")}`;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const currency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD";

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    const render = async () => {
      if (!window.paypal || cancelled) return;
      const buttons = window.paypal.Buttons({
        style: { layout: "vertical", shape: "pill", label: "paypal" },
        createOrder: async () => {
          const response = await createPayPalOrder(courseId);
          return response.order.id;
        },
        onApprove: async ({ orderID }) => {
          setError("");
          const response = await capturePayPalOrder(orderID);
          setMessage(response.message || "تم تفعيل الكورس بنجاح.");
          onSuccess?.();
        },
        onError: (reason) => {
          setError(reason instanceof ApiError ? reason.message : "تعذر إتمام الدفع عبر PayPal.");
        },
      });
      await buttons.render(`#${containerId}`);
    };

    const existing = document.querySelector<HTMLScriptElement>("script[data-codepath-paypal]");
    if (existing) {
      if (window.paypal) render();
      else existing.addEventListener("load", render, { once: true });
    } else {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture`;
      script.async = true;
      script.dataset.codepathPaypal = "true";
      script.addEventListener("load", render, { once: true });
      script.addEventListener("error", () => setError("تعذر تحميل PayPal."), { once: true });
      document.head.appendChild(script);
    }
    return () => { cancelled = true; };
  }, [clientId, containerId, courseId, currency, onSuccess]);

  if (!clientId) {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-700">أضف <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> داخل ملف البيئة لتشغيل زر PayPal.</div>;
  }

  return <div><div id={containerId} />{message && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">{message}</p>}{error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600">{error}</p>}</div>;
}
