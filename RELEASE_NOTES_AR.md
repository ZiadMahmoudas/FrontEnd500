# منصة المهاجر — نسخة GTM وGA4 والعربي/الإنجليزي

## التتبع
- Google Tag Manager: `GTM-P3L52THD`
- Google Analytics 4: `G-F4L7E4DV5G`
- ملف تحقق Google Search Console موجود داخل `public`.

> التتبع المباشر لـ GA4 يعمل افتراضيًا. عند إنشاء Google Tag داخل GTM بنفس Measurement ID، غيّر `NEXT_PUBLIC_GA_DIRECT_ENABLED=false` حتى لا تتكرر زيارات الصفحات.

## اللغات
- العربية: `/`
- الإنجليزية: `/en`
- يمكن تبديل اللغة من الناف بار وقائمة الهاتف ولوحة الإدارة.
- الصفحات العامة المهمة لديها Metadata وCanonical وhreflang عربي/إنجليزي.
- النصوص الثابتة في الواجهة مترجمة، أما عنوان ووصف الكورس أو الدرس القادم من قاعدة البيانات فيظهر باللغة التي أدخلها الأدمن.

## Vercel Environment Variables
```env
NEXT_PUBLIC_API_URL=https://lmslearning.runasp.net/api
NEXT_PUBLIC_SITE_URL=https://elmohager.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=201110037311
NEXT_PUBLIC_GTM_ID=GTM-P3L52THD
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-F4L7E4DV5G
NEXT_PUBLIC_GA_DIRECT_ENABLED=true
GOOGLE_SITE_VERIFICATION=OG1djowz4G3O5lUyi9bj0iwwhfDedCdxco4fOiWDc3E
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_PAYPAL_CURRENCY=USD
```

## الاختبار
- `npm run lint`
- `npm run build`
- أو شغّل `VERIFY_FRONTEND.bat` على Windows.
