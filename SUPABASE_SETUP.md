# اتصال همین نسخه Safaro به Supabase

## مرحله ۱: ساخت پروژه
در سایت Supabase یک Project جدید بساز.

## مرحله ۲: ساخت جدول
در Supabase برو به:

SQL Editor

کل محتوای فایل زیر را اجرا کن:

supabase_schema.sql

بعد از اجرا باید جدول زیر ساخته شود:

safaro_store

## مرحله ۳: گرفتن URL و ANON KEY
در Supabase برو به:

Project Settings > API

این دو مقدار را کپی کن:

Project URL
anon public key

## مرحله ۴: وارد کردن داخل سایت
در پروژه این فایل را باز کن:

assets/js/core.js

این خطوط را پیدا کن:

const SUPABASE_URL = 'PASTE_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'PASTE_SUPABASE_ANON_KEY_HERE';

و مقدارهای Supabase را جایگزین کن.

## مرحله ۵: آپلود روی Vercel
پروژه را در GitHub جایگزین کن و deploy بگیر.

## مرحله ۶: تست اتصال
وارد پنل مدیریت شو:

/admin/

در بخش Supabase روی:

تست اتصال

بزن.

اگر موفق بود، روی:

ارسال همه اطلاعات

بزن تا تورها، ویزاها، سفارش‌ها، شماره‌ها و کاربران فروش به دیتابیس بروند.

## مرحله ۷: استفاده روی دستگاه دیگر
روی دستگاه دیگر وارد سایت شو و در پنل مدیریت یا فروش روی:

خواندن از Supabase

بزن.

## داده‌هایی که sync می‌شوند
- settings
- tours
- orders
- leads
- contactStaff
- discounts
- visaServices
- hotelCatalog
- staffAccounts
- customerTrail

## نکته امنیتی
این نسخه برای شروع و تست سریع است.
چون سایت static است، Policy ها برای anon key باز هستند.
برای نسخه نهایی واقعی، باید Supabase Auth و RLS اختصاصی برای مدیر/کارشناس تنظیم شود.
