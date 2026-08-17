# Paris Luxury Stack

یک لندینگ مدرن و لوکس با الهام از ویدیوی مرجع، با استک زیر:

- Frontend: Next.js + TypeScript
- Styling: Tailwind CSS + DaisyUI
- Motion: Framer Motion
- Backend: Node.js + NestJS
- API docs: Swagger

## اجرا

پیش‌نیاز: Node.js 20+ و npm

```bash
npm install
cp .env.example .env
npm run dev
```

سپس:

- سایت: http://localhost:3000
- API: http://localhost:4000/api
- Swagger: http://localhost:4000/docs

## ساختار

```text
apps/
  web/   # Next.js
  api/   # NestJS
```

## API فرم تماس

`POST /api/contact`

نمونه بدنه:

```json
{
  "name": "Ali",
  "email": "ali@example.com",
  "message": "I want a premium travel website."
}
```

در نسخه فعلی درخواست‌ها در حافظه سرور نگه داشته می‌شوند. برای نسخه production می‌توان این سرویس را به PostgreSQL/Prisma متصل کرد.

## شخصی‌سازی سریع

متن‌های صفحه اصلی داخل `apps/web/app/page.tsx` هستند. رنگ‌ها و استایل‌های پایه داخل `apps/web/app/globals.css` قرار دارند.
