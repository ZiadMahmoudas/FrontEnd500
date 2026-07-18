# Google Tag Manager + GA4 + Arabic/English

## IDs installed
- GTM: `GTM-P3L52THD`
- GA4: `G-F4L7E4DV5G`

The GTM script is placed in `<head>` and the noscript iframe is the first item after `<body>`. The app sends a `virtual_page_view` event on Next.js route changes. Direct GA4 page views are also enabled.

If you later create a GA4 tag inside GTM using the same Measurement ID, set this variable to avoid duplicate page views:

```env
NEXT_PUBLIC_GA_DIRECT_ENABLED=false
```

## Languages
- Arabic default: `/`
- English: `/en`
- English courses: `/en/courses`

The language button is available in the desktop navbar, mobile drawer, admin area and standalone account pages. Fixed UI text is translated; course and lesson content coming from the API remains exactly as entered by the administrator.

## Vercel variables
```env
NEXT_PUBLIC_GTM_ID=GTM-P3L52THD
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-F4L7E4DV5G
NEXT_PUBLIC_GA_DIRECT_ENABLED=true
NEXT_PUBLIC_SITE_URL=https://elmohager.vercel.app
NEXT_PUBLIC_API_URL=https://lmslearning.runasp.net/api
```

## SEO
- `/sitemap.xml` includes Arabic and English public URLs with hreflang alternates.
- `/robots.txt` allows public pages and blocks admin, account, payment and protected lesson routes in both languages.
