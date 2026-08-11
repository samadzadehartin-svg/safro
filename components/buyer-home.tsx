"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Tour } from "@/lib/types";
import { CalendarIcon, PhoneIcon, PlaneIcon, SearchIcon, StarIcon, UsersIcon } from "./icons";
import { TourCard } from "./tour-card";

const fa = new Intl.NumberFormat("fa-IR");

export function BuyerHome() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    api.tours.list().then(setTours).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => tours.filter((tour) => {
    if (tour.status !== "active") return false;
    if (type !== "all" && tour.type !== type) return false;
    const q = query.trim().toLocaleLowerCase("fa");
    return !q || `${tour.title} ${tour.dest} ${tour.airline}`.toLocaleLowerCase("fa").includes(q);
  }), [query, tours, type]);

  const activeTours = useMemo(() => tours.filter((tour) => tour.status === "active"), [tours]);
  const destinations = useMemo(() => Array.from(new Set(activeTours.map((t) => t.dest))).slice(0, 6), [activeTours]);
  const featured = activeTours[0];

  return (
    <main className="overflow-hidden bg-[#f4f5f7] text-slate-950">
      <section className="cinematic-hero relative isolate min-h-[760px] overflow-hidden bg-[#04070d] text-white lg:min-h-[850px]">
        <div className="cinematic-grid absolute inset-0 opacity-50" />
        <div className="cinematic-glow cinematic-glow-a" />
        <div className="cinematic-glow cinematic-glow-b" />
        <div className="hero-landmarks absolute inset-x-0 bottom-0 h-[58%] opacity-35" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-7xl flex-col px-4 pb-7 pt-16 sm:px-6 sm:pt-20 lg:min-h-[850px] lg:px-8 lg:pb-10 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-2 text-xs font-bold text-white/75 backdrop-blur-xl sm:text-sm">
              <span className="size-2 rounded-full bg-[#ffb629] shadow-[0_0_16px_#ffb629]" />
              تجربه‌ی تازه‌ی سفر با سفرو
            </div>
            <h1 className="text-balance text-4xl font-black leading-[1.18] tracking-[-.04em] sm:text-6xl lg:text-[72px]">
              دنیا را از یک قاب
              <span className="block bg-gradient-to-l from-[#ffbd38] via-[#ffd889] to-white bg-clip-text text-transparent">تازه‌تر ببین.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              تور را مقایسه کن، تاریخ و هتل را ببین و درخواست رزرو را مستقیم ثبت کن؛ از انتخاب مقصد تا بازگشت، یک مسیر ساده و روشن.
            </p>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-[1040px] flex-1 sm:mt-10">
            <div className="plane-window-shell relative mx-auto h-[390px] w-[270px] sm:h-[475px] sm:w-[330px] lg:h-[520px] lg:w-[365px]">
              <div className="plane-window-ring plane-window-ring-outer" />
              <div className="plane-window-ring plane-window-ring-inner" />
              <div className="plane-window-view absolute inset-[26px] overflow-hidden sm:inset-[31px]">
                <img
                  src="/assets/images/paris-eiffel.gif"
                  alt="نمای سفر از پنجره هواپیما"
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,5,15,.05),rgba(2,7,15,.32)_55%,rgba(1,4,10,.82))]" />
                <div className="absolute inset-x-5 bottom-8 text-center sm:bottom-10">
                  <span className="text-[10px] font-bold uppercase tracking-[.32em] text-white/55">SAFRO EXPERIENCE</span>
                  <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">پاریس، این‌بار متفاوت</h2>
                  <p className="mt-2 text-xs leading-6 text-white/65">یک تجربه‌ی انتخاب‌شده، نه فقط یک مقصد.</p>
                  <a href="#tours" className="btn mt-4 min-h-0 h-9 rounded-full border-0 bg-white px-5 text-xs font-black text-slate-950 hover:bg-[#ffbd38]">
                    دیدن تورها
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-feature-card hero-feature-right lg:absolute lg:right-0 lg:top-[42%] lg:w-[290px]">
              <div className="feature-icon"><StarIcon className="size-4" /></div>
              <div>
                <strong className="block text-sm">انتخاب شفاف و واقعی</strong>
                <p className="mt-1 text-xs leading-6 text-white/52">قیمت، ایرلاین، هتل و تاریخ را قبل از ثبت درخواست کنار هم ببین.</p>
              </div>
            </div>

            <div className="hero-feature-card hero-feature-left lg:absolute lg:left-0 lg:top-[42%] lg:w-[290px]">
              <div className="feature-icon"><PhoneIcon className="size-4" /></div>
              <div>
                <strong className="block text-sm">همراهی از انتخاب تا بازگشت</strong>
                <p className="mt-1 text-xs leading-6 text-white/52">درخواستت ثبت می‌شود و تیم فروش برای هماهنگی نهایی کنارت است.</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-5 w-full max-w-5xl rounded-[26px] border border-white/12 bg-black/30 p-2.5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-3">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <label className="input h-12 w-full max-w-none flex-1 border-white/10 bg-white/[.08] text-white focus-within:border-[#ffbd38]/60">
                <SearchIcon className="size-5 text-[#ffbd38]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} className="grow placeholder:text-white/35" placeholder="مقصد، نام تور یا ایرلاین..." />
              </label>
              <select className="select h-12 w-full max-w-none border-white/10 bg-white/[.08] text-white sm:w-40" value={type} onChange={(e) => setType(e.target.value)}>
                <option className="text-slate-900" value="all">همه تورها</option>
                <option className="text-slate-900" value="international">خارجی</option>
                <option className="text-slate-900" value="domestic">داخلی</option>
              </select>
              <a href="#tours" className="btn h-12 min-h-0 border-0 bg-[#ffb629] px-7 font-black text-[#171009] shadow-[0_10px_40px_rgba(255,182,41,.2)] hover:bg-[#ffc95d]">جستجوی سفر</a>
            </div>
          </div>

          <div className="mx-auto mt-4 flex min-h-8 max-w-4xl flex-wrap justify-center gap-2">
            {destinations.map((dest) => (
              <button key={dest} onClick={() => setQuery(dest)} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs font-medium text-white/55 transition hover:border-[#ffbd38]/40 hover:text-white">
                {dest}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07101f] text-white">
        <div className="cloud-band absolute inset-0 opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#07101f_0%,rgba(7,16,31,.7)_42%,#07101f_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="text-xs font-black tracking-[.2em] text-[#ffbd38]">سفری که فقط «رزرو» نیست</span>
            <h2 className="mt-4 text-3xl font-black leading-[1.45] tracking-[-.03em] sm:text-5xl">برای انتخاب بهتر، باید تصویر کامل‌تری از سفر داشته باشی.</h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/58 sm:text-base">طراحی جدید سفرو از همان ایده‌ی ویدیو الهام گرفته: تصویر قوی، اطلاعات کم اما مهم، و یک مسیر مستقیم تا تصمیم‌گیری. بدون شلوغی و بدون گم شدن بین صفحه‌ها.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-end sm:gap-4">
            <div className="metric-card"><strong>{fa.format(activeTours.length || 9)}+</strong><span>تور فعال</span></div>
            <div className="metric-card"><strong>۲۴/۷</strong><span>دسترسی به اطلاعات سفر</span></div>
            <div className="metric-card"><strong>{fa.format(destinations.length || 6)}</strong><span>مقصد منتخب</span></div>
            <div className="metric-card"><strong>۱ مسیر</strong><span>از انتخاب تا درخواست رزرو</span></div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="bg-[#07101f] px-4 pb-6 text-white sm:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-white/[.04] shadow-2xl shadow-black/20">
            <div className="grid min-h-[410px] lg:grid-cols-[1.08fr_.92fr]">
              <div className="relative min-h-[330px] overflow-hidden lg:min-h-full">
                <img src={featured.img?.replace(/^\.\.\//, "/") || "/assets/images/paris-eiffel.gif"} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,31,.18),rgba(7,16,31,.72))] lg:bg-[linear-gradient(270deg,rgba(7,16,31,.16),rgba(7,16,31,.72))]" />
                <div className="absolute bottom-5 right-5 flex gap-2">
                  <span className="badge border-white/15 bg-black/30 text-white backdrop-blur">{featured.dest}</span>
                  {featured.label && <span className="badge border-0 bg-[#ffb629] text-slate-950">{featured.label}</span>}
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <span className="text-xs font-bold text-[#ffbd38]">پیشنهاد این هفته</span>
                <h3 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{featured.title}</h3>
                <p className="mt-4 leading-8 text-white/58">{featured.desc}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="featured-meta"><PlaneIcon className="size-4" /><span>{featured.airline}</span></div>
                  <div className="featured-meta"><CalendarIcon className="size-4" /><span>{featured.duration}</span></div>
                  <div className="featured-meta"><UsersIcon className="size-4" /><span>{featured.origin || "تهران"}</span></div>
                  <div className="featured-meta"><StarIcon className="size-4" /><span>{featured.rating ?? 4.8} امتیاز</span></div>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div><small className="block text-white/42">شروع قیمت از</small><strong className="mt-1 block text-xl text-[#ffbd38]">{fa.format(featured.newPrice || featured.price)} تومان</strong></div>
                  <a href={`/tours/${featured.id}`} className="btn border-0 bg-white px-6 font-black text-slate-950 hover:bg-[#ffb629]">مشاهده جزئیات</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="tours" className="relative bg-[#f4f5f7]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-black text-[#9b6512]">پیشنهادهای سفرو</span>
              <h2 className="mt-2 text-3xl font-black tracking-[-.03em] text-slate-950 sm:text-4xl">تور مناسب خودت را پیدا کن</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">جستجو و فیلتر بالا روی همین لیست اعمال می‌شود؛ انتخاب کن و مستقیم وارد جزئیات و ثبت درخواست شو.</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">{fa.format(visible.length)} تور قابل نمایش</span>
          </div>

          {loading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-[420px] rounded-3xl" />)}</div>}
          {error && <div className="alert alert-error"><span>اتصال به API برقرار نشد: {error}. بک‌اند NestJS را روی پورت ۴۰۰۰ اجرا کن.</span></div>}
          {!loading && !error && visible.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><h3 className="text-xl font-bold">توری پیدا نشد</h3><p className="mt-2 text-slate-500">عبارت جستجو یا فیلتر را تغییر بده.</p></div>}
          {!loading && !error && <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map((tour) => <TourCard key={tour.id} tour={tour} />)}</div>}
        </div>
      </section>
    </main>
  );
}
