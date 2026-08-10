"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Tour } from "@/lib/types";
import { CalendarIcon, PlaneIcon, StarIcon, UsersIcon } from "./icons";

const money = (n: number) => `${new Intl.NumberFormat("fa-IR").format(n)} تومان`;
const img = (src?: string) => src?.replace(/^\.\.\//, "/").replace(/^assets\//, "/assets/").replace(/\.svg$/, ".gif") || "/assets/images/default.gif";

export function TourDetails({ id }: { id: number }) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hotelIndex, setHotelIndex] = useState(0);
  const [roomType, setRoomType] = useState<"double"|"single">("double");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);

  useEffect(() => { api.tours.one(id).then(t => { setTour(t); setDate(t.dates?.[0] || ""); }).finally(() => setLoading(false)); }, [id]);
  const hotel = tour?.hotels?.[hotelIndex];
  const unitPrice = useMemo(() => {
    if (!tour) return 0;
    const double = hotel?.dblPrice || hotel?.price || tour.price;
    const single = hotel?.sglPrice || Math.ceil(double * 1.35 / 100000) * 100000;
    return roomType === "single" ? single : double;
  }, [hotel, roomType, tour]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tour) return;
    const form = new FormData(e.currentTarget);
    setMessage("در حال ثبت درخواست...");
    try {
      await api.orders.create({ tourId: tour.id, tourTitle: tour.title, fullName: String(form.get("name")), phone: String(form.get("phone")), passengers, date, hotel: hotel?.name, roomType, totalPrice: unitPrice * passengers });
      setMessage("درخواست شما ثبت شد؛ کارشناس فروش با شما تماس می‌گیرد.");
      e.currentTarget.reset();
    } catch { setMessage("ثبت درخواست انجام نشد. اتصال API را بررسی کن."); }
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10"><div className="skeleton h-[70vh] rounded-3xl" /></main>;
  if (!tour) return <main className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">تور پیدا نشد</h1><Link href="/" className="btn btn-primary mt-5">بازگشت</Link></main>;

  return <main className="mx-auto max-w-7xl px-4 py-8 pb-28 lg:px-6 lg:py-12">
    <div className="breadcrumbs mb-6 text-sm"><ul><li><Link href="/">تورهای سفر</Link></li><li>{tour.dest}</li><li>{tour.title}</li></ul></div>
    <section className="grid gap-7 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-2 shadow-sm"><img src={img(tour.gallery?.[0] || tour.img)} alt={tour.title} decoding="async" fetchPriority="high" className="h-[280px] w-full rounded-[1.6rem] object-cover sm:h-[430px]" /></div>
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex flex-wrap gap-2">{tour.label && <span className="badge badge-secondary">{tour.label}</span>}<span className="badge badge-outline">{tour.type === "domestic" ? "داخلی" : "خارجی"}</span></div><h1 className="text-2xl font-black sm:text-3xl">{tour.title}</h1></div><div className="badge badge-lg bg-warning/10 text-warning"><StarIcon className="size-4 fill-current" /> {tour.rating ?? 4.5}</div></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="info-tile"><PlaneIcon/><span><small>ایرلاین</small><b>{tour.airline}</b></span></div><div className="info-tile"><CalendarIcon/><span><small>مدت سفر</small><b>{tour.duration}</b></span></div><div className="info-tile"><UsersIcon/><span><small>مبدأ</small><b>{tour.origin || "تهران"}</b></span></div></div>
          {tour.desc && <p className="mt-6 leading-8 text-base-content/75">{tour.desc}</p>}
        </div>
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 sm:p-7"><h2 className="text-xl font-black">انتخاب تاریخ سفر</h2><div className="mt-4 flex flex-wrap gap-2">{tour.dates?.map(d => <button key={d} onClick={() => setDate(d)} className={`btn btn-sm ${date === d ? "btn-primary" : "btn-outline"}`}>{d}</button>)}</div></div>
        <div className="rounded-3xl border border-base-300 bg-base-100 p-5 sm:p-7"><h2 className="text-xl font-black">انتخاب هتل</h2><div className="mt-4 grid gap-3">{tour.hotels?.map((h,i)=><button key={`${h.name}-${i}`} onClick={()=>setHotelIndex(i)} className={`flex w-full items-center justify-between rounded-2xl border p-4 text-right transition ${hotelIndex===i ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary/40"}`}><span><b className="block">{h.name}</b><small className="text-base-content/60">{"★".repeat(h.star || 3)} · ظرفیت {h.capacity ?? "—"}</small></span><strong className="text-primary">{money(h.price || h.dblPrice || tour.price)}</strong></button>)}</div></div>
        {(tour.includes?.length || tour.itinerary?.length) && <div className="grid gap-6 md:grid-cols-2"><div className="rounded-3xl border border-base-300 bg-base-100 p-6"><h2 className="text-lg font-black">خدمات تور</h2><ul className="mt-4 space-y-3">{tour.includes?.map(x=><li key={x} className="flex gap-2"><span className="text-success">✓</span>{x}</li>)}</ul></div><div className="rounded-3xl border border-base-300 bg-base-100 p-6"><h2 className="text-lg font-black">برنامه سفر</h2><ol className="mt-4 space-y-3">{tour.itinerary?.map((x,i)=><li key={x} className="flex gap-3"><span className="badge badge-primary badge-outline">{i+1}</span><span>{x}</span></li>)}</ol></div></div>}
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <form id="booking" onSubmit={submit} className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xl shadow-primary/5 sm:p-6"><span className="text-sm text-base-content/60">قیمت هر نفر از</span><div className="mt-1 text-2xl font-black text-primary">{money(unitPrice)}</div><div className="divider my-4" />
          <label className="flex flex-col"><span className="mb-2 text-sm font-medium">نوع اتاق</span><div className="join w-full"><button type="button" onClick={()=>setRoomType("double")} className={`btn join-item flex-1 ${roomType==="double"?"btn-primary":""}`}>دو تخته</button><button type="button" onClick={()=>setRoomType("single")} className={`btn join-item flex-1 ${roomType==="single"?"btn-primary":""}`}>یک تخته</button></div></label>
          <label className="mt-4 flex flex-col"><span className="mb-2 text-sm font-medium">تعداد مسافر</span><input className="input w-full max-w-none" type="number" min={1} max={12} value={passengers} onChange={e=>setPassengers(Number(e.target.value)||1)} /></label>
          <label className="mt-4 flex flex-col"><span className="mb-2 text-sm font-medium">نام و نام خانوادگی</span><input name="name" required className="input w-full max-w-none" placeholder="مثلاً علی رضایی" /></label>
          <label className="mt-4 flex flex-col"><span className="mb-2 text-sm font-medium">شماره تماس</span><input name="phone" required className="input w-full max-w-none" inputMode="tel" placeholder="09xxxxxxxxx" /></label>
          <div className="my-5 rounded-2xl bg-base-200 p-4"><div className="flex justify-between text-sm"><span>جمع تقریبی</span><b>{money(unitPrice * passengers)}</b></div><small className="mt-2 block text-base-content/60">قیمت نهایی پس از بررسی ظرفیت تأیید می‌شود.</small></div>
          <button className="btn btn-primary w-full">ثبت درخواست رزرو</button>{message && <div className="mt-4 text-sm leading-6 text-primary">{message}</div>}
        </form>
      </aside>
    </section>
    <a href="#booking" className="fixed bottom-[76px] left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-primary-content shadow-2xl lg:hidden"><span><small className="block opacity-80">رزرو این تور</small><b>{money(unitPrice)} / نفر</b></span><span className="btn btn-sm border-0 bg-primary-content text-primary">انتخاب و رزرو</span></a>
  </main>;
}
