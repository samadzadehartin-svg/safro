"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Tour } from "@/lib/types";
import { SearchIcon } from "./icons";
import { TourCard } from "./tour-card";

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

  const destinations = useMemo(() => Array.from(new Set(tours.filter(t => t.status === "active").map(t => t.dest))).slice(0, 6), [tours]);

  return (
    <>
      <section className="hero-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.08fr_.92fr] lg:px-6 lg:py-20">
          <div>
            <span className="badge badge-primary badge-outline mb-5">سفر بعدی از همین‌جا شروع می‌شود</span>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.35] sm:text-5xl lg:text-6xl">یک سفر خوب، با <span className="text-primary">انتخاب درست</span> شروع می‌شود.</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-base-content/70 sm:text-lg">تورهای داخلی و خارجی را مقایسه کن، هتل و تاریخ را ببین و درخواست رزرو را مستقیم ثبت کن.</p>
            <div className="mt-8 rounded-3xl border border-base-300 bg-base-100 p-3 shadow-xl shadow-primary/5 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="input flex w-full max-w-none flex-1 items-center gap-2 bg-base-100"><SearchIcon className="size-5 text-primary" /><input value={query} onChange={e => setQuery(e.target.value)} className="grow" placeholder="مقصد، نام تور یا ایرلاین..." /></label>
                <select className="select w-full max-w-none sm:w-40" value={type} onChange={e => setType(e.target.value)}><option value="all">همه تورها</option><option value="international">خارجی</option><option value="domestic">داخلی</option></select>
                <a href="#tours" className="btn btn-primary px-7">جستجو</a>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm"><span className="py-2 text-base-content/60">مقصدهای محبوب:</span>{destinations.map(dest => <button key={dest} onClick={() => setQuery(dest)} className="btn btn-ghost btn-sm rounded-full bg-base-100/60">{dest}</button>)}</div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-7 rounded-[3rem] bg-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-base-100 p-3 shadow-2xl">
              <img src="/assets/images/safarro-middle-hero.png" alt="سفر با سفرو" className="aspect-[4/4.15] w-full rounded-[2rem] object-cover" />
              <div className="absolute bottom-7 right-7 rounded-2xl bg-base-100/90 p-4 shadow-lg backdrop-blur"><span className="text-sm text-base-content/60">پشتیبانی سفر</span><strong className="mt-1 block text-lg">از انتخاب تا بازگشت ✈️</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section id="tours" className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><span className="text-sm font-semibold text-primary">پیشنهادهای سفرو</span><h2 className="mt-2 text-2xl font-black sm:text-3xl">تور مناسب خودت را پیدا کن</h2></div><span className="text-sm text-base-content/60">{new Intl.NumberFormat("fa-IR").format(visible.length)} تور قابل نمایش</span></div>
        {loading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="skeleton h-[420px] rounded-3xl" />)}</div>}
        {error && <div className="alert alert-error"><span>اتصال به API برقرار نشد: {error}. بک‌اند NestJS را روی پورت ۴۰۰۰ اجرا کن.</span></div>}
        {!loading && !error && visible.length === 0 && <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center"><h3 className="text-xl font-bold">توری پیدا نشد</h3><p className="mt-2 text-base-content/60">عبارت جستجو یا فیلتر را تغییر بده.</p></div>}
        {!loading && !error && <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map(tour => <TourCard key={tour.id} tour={tour} />)}</div>}
      </section>
    </>
  );
}
