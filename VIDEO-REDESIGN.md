# Video-inspired landing redesign — v1

این نسخه بر اساس زبان بصری ویدیوی ارسالی بازطراحی شده و برای پروژه Safro تطبیق داده شده است.

## تغییرات

- Hero سینمایی تیره با قاب شبیه پنجره هواپیما
- استفاده از GIFهای موجود پروژه برای حفظ وزن و ساختار فعلی assets
- کارت‌های شیشه‌ای اطلاعات/مزیت در Hero
- جستجو و فیلتر تور داخل Hero و متصل به لیست واقعی تورها
- سکشن تصویری/فضاساز بعد از Hero با آمار پویا از داده‌های تور
- Featured Tour پویا بر اساس اولین تور فعال API/fallback
- حفظ مسیرهای فعلی `/tours/:id`, `/staff`, `/admin`
- هدر Home به حالت cinematic تغییر کرده؛ صفحات staff/admin ساختار قبلی را حفظ می‌کنند
- Responsive برای موبایل، تبلت و دسکتاپ

## فایل‌های اصلی تغییرکرده

- `app/page.tsx`
- `app/globals.css`
- `components/buyer-home.tsx`
- `components/site-header.tsx`

## اجرا

```bash
npm install
npm --prefix server install
npm run dev
npm --prefix server run dev
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:4000/api`

## بررسی انجام‌شده

Syntax فایل‌های TSX تغییرکرده با TypeScript parser بررسی شده و parse error ندارد. در محیط تولید این خروجی، اتصال npm registry برای نصب dependencyها timeout شد؛ بنابراین build کامل Next.js در همین محیط قابل اجرا نبود.
