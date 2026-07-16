# منصة المهاجر — FrontEnd

واجهة منصة الأستاذ محمود المهاجر باستخدام Next.js وTypeScript.

## التشغيل المحلي

```bash
npm install
npm run dev
```

افتح:

```text
http://localhost:3000
```

فحص اتصال ASP.NET Core:

```text
http://localhost:3000/system-status
```

## رابط ASP.NET Core

المشروع مضبوط محليًا على:

```env
NEXT_PUBLIC_API_URL=http://lmslearning.runasp.net/api
```

وفي الإنتاج يستخدم:

```env
NEXT_PUBLIC_API_URL=https://lmslearning.runasp.net/api
```

رابط Swagger ليس رابط API. لا تستخدم `/swagger/index.html` داخل Next.js.

## SEO

راجع:

- `SEO_SETUP_AR.md`
- `API_CONNECTION_AR.md`

المشروع يحتوي على Metadata وOpen Graph وSitemap وRobots وSchema وGoogle Analytics اختياري.
