# ربط Next.js مع ASP.NET Core

## الرابط المستخدم في الفرونت

```env
NEXT_PUBLIC_API_URL=https://lmslearning.runasp.net/api
```

لا تستخدم:

```text
https://lmslearning.runasp.net/swagger/index.html
```

لأن Swagger واجهة توثيق فقط، بينما الطلبات تبدأ من `/api`.

## اختبار مباشر

افتح:

```text
https://lmslearning.runasp.net/api/health
```

ثم افتح داخل Next.js:

```text
/system-status
```

## إعداد CORS في ASP.NET Core

يجب أن يحتوي إعداد الاستضافة على رابط Next.js النهائي، مثل:

```json
{
  "App": {
    "FrontEndUrl": "https://YOUR-FRONTEND-DOMAIN.com",
    "AllowedOrigins": "https://YOUR-FRONTEND-DOMAIN.com,http://localhost:3000,http://127.0.0.1:3000"
  }
}
```

بعد تعديل متغيرات البيئة أو appsettings أعد تشغيل تطبيق ASP.NET Core.
