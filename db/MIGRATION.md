# گزارش مهاجرت Safro

## انجام‌شده

- حذف اجرای مستقیم HTML/CSS/JS قدیمی از مسیرهای اصلی
- پیاده‌سازی App Router در Next.js برای مشتری، جزئیات تور، فروش و مدیریت
- Tailwind CSS 4 + DaisyUI 5 با تم روشن/تیره اختصاصی Safro
- RTL فارسی و ریسپانسیو موبایل/تبلت/دسکتاپ
- نوار ناوبری موبایل و CTA ثابت رزرو در صفحه تور
- NestJS REST API برای تورها، سفارش‌ها و آمار داشبورد
- انتقال ۱۴ تور نمونه نسخه قبلی به `server/data/seed.json`
- ذخیره‌سازی توسعه‌ای سمت سرور در JSON به‌جای localStorage/Supabase مرورگر
- ریدایرکت مسیرهای قدیمی `/buyer/index.html`، `/staff/index.html` و `/admin/index.html`
- PWA manifest و service worker با مسیرهای نسخه جدید

## نسخه قدیمی

کدهای قدیمی به‌عنوان مرجع در `legacy-ui/` نگه داشته شده‌اند و دیگر از مسیر اصلی اجرا نمی‌شوند.

## تفاوت با نسخه Legacy

نسخه جدید هسته خرید/رزرو/مدیریت تور را منتقل می‌کند. قابلیت‌های تخصصی قدیمی مثل import/export اکسل، کاتالوگ مستقل ایرلاین/هتل/ارز، خدمات ویزا، مدیریت اکانت‌های کارکنان و بعضی گزارش‌های جزئی هنوز در رابط جدید بازنویسی نشده‌اند و سورس آن‌ها در `legacy-ui` باقی مانده است.

## پیشنهاد Production

- جایگزینی `StoreService` با PostgreSQL/Supabase server-side repository
- افزودن Auth + RBAC برای `/staff` و `/admin`
- اعتبارسنجی DTOها با `class-validator`
- آپلود تصاویر روی object storage
- تست E2E برای رزرو و CRUD تورها
