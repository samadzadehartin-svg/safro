# رفع خطای 404 در Vercel

اگر آدرس‌هایی مثل `/buyer/`، `/staff/` یا `/admin/` خطای `404: NOT_FOUND` دادند، مشکل از تنظیمات مسیر در Vercel است.

در این نسخه فایل `vercel.json` اصلاح شده و مسیرهای زیر مستقیم به فایل درست وصل می‌شوند:

- `/` → `buyer/index.html`
- `/buyer` و `/buyer/` → `buyer/index.html`
- `/staff` و `/staff/` → `staff/index.html`
- `/admin` و `/admin/` → `admin/index.html`

## تنظیمات مهم در Vercel

در Project Settings → Build & Development Settings:

- Framework Preset: `Other`
- Build Command: خالی
- Output Directory: خالی یا `.`
- Install Command: خالی

اگر Output Directory را روی `buyer` گذاشته باشی، آدرس `/buyer/` ممکن است 404 بدهد. در این پروژه باید کل ریشه سایت deploy شود، نه فقط پوشه buyer.

بعد از آپلود نسخه جدید، در مرورگر `Ctrl + F5` بزن.
