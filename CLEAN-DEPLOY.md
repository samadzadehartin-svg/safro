# Safro clean deployment

این بسته نسخه تمیز پروژه است و پوشه Legacy ندارد.

## پوشه‌های موردنیاز در ریشه GitHub
- app
- components
- lib
- public
- server

فایل‌های تنظیمات ریشه مثل package.json و next.config.ts نیز باید باقی بمانند.

## پوشه‌های قدیمی که باید از ریپوی قبلی حذف شوند
- .openai
- backend
- build
- db
- drizzle
- examples
- frontend
- legacy-ui
- scripts
- tests
- worker

پس از Commit/Push جدید، Vercel باید deployment تازه بسازد.
