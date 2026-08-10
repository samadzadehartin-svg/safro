# Safro — Next.js + NestJS

مهاجرت رابط سفرو به معماری جدید:

- **Frontend:** Next.js (App Router) + React + Tailwind CSS 4 + DaisyUI 5
- **Backend:** Node.js + NestJS REST API
- **Responsive:** هدر، کارت‌ها، فرم رزرو، پنل فروش و مدیریت برای موبایل/تبلت/دسکتاپ
- **Data:** در حالت توسعه JSON file store با seed داده‌های نسخه قبلی؛ آماده جایگزینی با PostgreSQL/Supabase در لایه NestJS

## اجرا در لوکال

ابتدا وابستگی‌های هر دو بخش را نصب کن:

```bash
cp .env.example .env.local
npm install
npm --prefix server install
```

سپس در دو ترمینال اجرا کن:

```bash
# Terminal 1 — Next.js
npm run dev

# Terminal 2 — NestJS
npm --prefix server run dev
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000/api`
- Health: `http://localhost:4000/api/health`

## مسیرها

- `/` پنل مشتری و فهرست تورها
- `/tours/:id` جزئیات + ثبت درخواست رزرو
- `/staff` ساخت/ویرایش تور و تغییر وضعیت
- `/admin` آمار و مدیریت وضعیت درخواست‌های رزرو

## API اصلی

- `GET /api/tours`
- `GET /api/tours/:id`
- `POST /api/tours`
- `PATCH /api/tours/:id`
- `DELETE /api/tours/:id`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/dashboard/summary`

## داده‌ها

`server/data/seed.json` شامل ۱۴ تور نمونه نسخه قبلی است. در اولین write، داده فعال در `server/data/store.json` ذخیره می‌شود.

برای production بهتر است `StoreService` با repository دیتابیس (PostgreSQL + Prisma/TypeORM یا Supabase server client) جایگزین شود و auth پنل‌های staff/admin اضافه گردد.

## GIF به‌جای عکس

رسانه‌های اصلی تورها در این نسخه به GIF متحرک تغییر کرده‌اند و فایل‌ها داخل مسیر زیر هستند:

```text
public/assets/images/*.gif
```

برای جایگزینی با GIFهای خودت، فایل جدید را در همین پوشه قرار بده و مقدار `img` یا `gallery` تور را به مسیر GIF بده؛ مثال:

```json
{
  "img": "../assets/images/istanbul-hagia-sophia.gif",
  "gallery": [
    "../assets/images/istanbul-hagia-sophia.gif",
    "../assets/images/istanbul-hagia-sophia-2.gif"
  ]
}
```

فرانت برای سازگاری با داده‌های قدیمی، مسیرهای `.svg` تور را هم به‌صورت خودکار به فایل هم‌نام `.gif` تبدیل می‌کند. برای سرعت بهتر موبایل، GIF کارت‌های تور با lazy loading بارگذاری می‌شود. پیشنهاد می‌شود GIFهای سفارشی را نزدیک نسبت `16:9`، عرض حدود `800px` و تا حد امکان کم‌حجم نگه داری.

## دیپلوی روی Vercel

برای Vercel، فرانت و بک‌اند باید به‌صورت دو Project از همین repository دیپلوی شوند:

1. **Backend:** Root Directory = `server`
2. **Frontend:** Root Directory = ریشه پروژه
3. بعد از Deploy بک‌اند، در Environment Variables فرانت مقدار `API_INTERNAL_URL` را برابر آدرس بک‌اند قرار بده.

جزئیات کامل در `VERCEL.md` است.
