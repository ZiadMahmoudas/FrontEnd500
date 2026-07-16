# إعداد SEO لمنصة المهاجر

## 1) متغيرات البيئة المطلوبة

ضع القيم التالية في استضافة Next.js:

```env
NEXT_PUBLIC_API_URL=https://lmslearning.runasp.net/api
NEXT_PUBLIC_SITE_URL=https://YOUR-FINAL-DOMAIN.com
NEXT_PUBLIC_WHATSAPP_NUMBER=201110037311
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=ضع-كود-التحقق-فقط
BING_SITE_VERIFICATION=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_PAYPAL_CURRENCY=USD
```

مهم: رابط API الصحيح ينتهي بـ `/api` وليس `/swagger/index.html`.

## 2) الصفحات التي يسمح بأرشفتها

- `/`
- `/courses`
- `/courses/course-slug`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/refund-policy`

## 3) الصفحات المحظورة من الأرشفة

- `/admin/*`
- `/dashboard`
- `/login`
- `/register`
- `/checkout/*`
- `/payment-proof`
- `/lessons/*`
- `/qr/*`
- `/system-status`

هذه الصفحات تحتوي بيانات خاصة أو وظائف تسجيل ودفع ولا يجب أن تظهر في Google.

## 4) Google Search Console

1. أضف الموقع كـ Domain Property لو عندك دومين، أو URL Prefix لو تستخدم رابط استضافة.
2. اختر HTML Tag للتحقق.
3. انسخ قيمة `content` فقط وضعها في `GOOGLE_SITE_VERIFICATION`.
4. أعد نشر Next.js.
5. أرسل ملف Sitemap من:

```text
https://YOUR-DOMAIN.com/sitemap.xml
```

6. استخدم URL Inspection للصفحة الرئيسية وصفحة الكورسات واطلب الفهرسة.

## 5) Google Analytics 4

1. أنشئ GA4 Property وWeb Data Stream.
2. انسخ Measurement ID الذي يبدأ بـ `G-`.
3. ضعه في `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. أعد نشر الموقع.
5. افتح Realtime في Analytics ثم افتح الموقع في نافذة خاصة للتأكد من وصول الزيارة.

## 6) معاينة واتساب وOpen Graph

المشروع يستخدم الصورة:

```text
/public/brand/og-share.jpg
```

ويولّد Meta Tags تلقائيًا من Next.js. بعد تغيير صورة المشاركة، قد يحتفظ واتساب بالنسخة القديمة مؤقتًا؛ جرّب مشاركة رابط جديد بمعامل مثل `?v=2` بعد النشر.

## 7) فحص اتصال الـAPI

افتح:

```text
https://YOUR-FRONTEND.com/system-status
```

لو Swagger يعمل لكن فحص الاتصال يفشل، راجع إعداد CORS في ASP.NET Core وأضف رابط الـFrontend النهائي داخل:

```text
App:FrontEndUrl
App:AllowedOrigins
```

وتأكد أن الـAPI متاح عبر HTTPS.
