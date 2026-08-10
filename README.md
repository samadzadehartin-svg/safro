# Safro — Next.js + NestJS

مهاجرت رابط سفرو به معماری جدید:

- **Frontend:** Next.js (App Router) + React + Tailwind CSS 4 + DaisyUI 5
- **Backend:** Node.js + NestJS REST API
- **Responsive:** هدر، کارت‌ها، فرم رزرو، پنل فروش و مدیریت برای موبایل/تبلت/دسکتاپ
- **Data:** در حالت توسعه JSON file store با seed داده‌های نسخه قبلی؛ آماده جایگزینی با PostgreSQL/Supabase در لایه NestJS

## اجرا

```bash
cp .env.example .env.local
npm install
npm run dev
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
