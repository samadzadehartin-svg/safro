# اتصال Safaro به Supabase

## 1) ساخت جدول
در Supabase برو به:
SQL Editor

محتوای فایل زیر را اجرا کن:

supabase_schema.sql

## 2) وارد کردن URL و Key
فایل زیر را باز کن:

assets/js/core.js

این دو خط را پیدا کن:

const SUPABASE_URL = 'PASTE_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'PASTE_SUPABASE_ANON_KEY_HERE';

و مقدارهای پروژه Supabase خودت را جایگزین کن.

## 3) اولین ارسال اطلاعات
بعد از deploy:
- برو پنل مدیریت `/admin/`
- بخش Supabase را می‌بینی
- روی «ارسال همه اطلاعات» بزن

## 4) خواندن اطلاعات در دستگاه دیگر
در پنل مدیریت یا فروش:
- روی «خواندن از Supabase» بزن

## نکته امنیتی
این نسخه برای دمو و استفاده ساده آماده شده است.
Policy ها عمومی هستند تا سایت بدون لاگین Supabase کار کند.
برای نسخه نهایی و واقعی بهتر است Authentication و Policy اختصاصی فعال شود.
