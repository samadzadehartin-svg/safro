"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Tour } from "@/lib/types";

const emptyTour: Partial<Tour> = { title: "", dest: "", duration: "۴ شب و ۵ روز", airline: "", price: 0, type: "international", status: "active", rating: 4.5, dates: [], hotels: [] };
const money = (n: number) => new Intl.NumberFormat("fa-IR").format(n || 0);

export function StaffDashboard() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [editing, setEditing] = useState<Partial<Tour> | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const load = () => api.tours.list().then(setTours);
  useEffect(() => { load().catch(()=>{}); }, []);
  const filtered = useMemo(()=>tours.filter(t=>`${t.title} ${t.dest}`.includes(query)),[query,tours]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!editing) return; setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload: Partial<Tour> = { ...editing, title:String(form.get("title")), dest:String(form.get("dest")), duration:String(form.get("duration")), airline:String(form.get("airline")), price:Number(form.get("price")), type:String(form.get("type")), status:String(form.get("status")), desc:String(form.get("desc")), dates:String(form.get("dates")||"").split(/[,\n]/).map(x=>x.trim()).filter(Boolean) };
    try { if (editing.id) await api.tours.update(editing.id, payload); else await api.tours.create(payload); await load(); setEditing(null); } finally { setBusy(false); }
  }
  async function toggle(tour: Tour) { await api.tours.update(tour.id, {status: tour.status === "active" ? "inactive" : "active"}); await load(); }

  return <main className="mx-auto max-w-7xl px-4 py-8 pb-28 lg:px-6 lg:py-12">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><span className="text-sm font-semibold text-primary">پنل فروش</span><h1 className="mt-2 text-3xl font-black">مدیریت تورها</h1><p className="mt-2 text-base-content/60">افزودن، ویرایش، قیمت‌گذاری و فعال/غیرفعال کردن تورها از API.</p></div><button className="btn btn-primary" onClick={()=>setEditing({...emptyTour})}>+ افزودن تور</button></div>
    <div className="mb-5 rounded-2xl border border-base-300 bg-base-100 p-3"><input value={query} onChange={e=>setQuery(e.target.value)} className="input w-full max-w-none" placeholder="جستجو در عنوان یا مقصد..." /></div>
    <div className="overflow-x-auto rounded-3xl border border-base-300 bg-base-100"><table className="table"><thead><tr><th>تور</th><th>مقصد</th><th>قیمت</th><th>وضعیت</th><th></th></tr></thead><tbody>{filtered.map(t=><tr key={t.id}><td><div className="font-bold">{t.title}</div><div className="text-xs text-base-content/50">{t.airline} · {t.duration}</div></td><td>{t.dest}</td><td>{money(t.price)} تومان</td><td><button onClick={()=>toggle(t)} className={`badge ${t.status==="active"?"badge-success text-white":"badge-ghost"}`}>{t.status==="active"?"فعال":"غیرفعال"}</button></td><td><button className="btn btn-ghost btn-sm" onClick={()=>setEditing(t)}>ویرایش</button></td></tr>)}</tbody></table></div>
    {editing && <div className="modal modal-open"><div className="modal-box max-w-3xl"><div className="flex items-start justify-between"><div><h2 className="text-xl font-black">{editing.id ? "ویرایش تور" : "تور جدید"}</h2><p className="mt-1 text-sm text-base-content/60">اطلاعات اصلی نسخه جدید Next/Nest</p></div><button onClick={()=>setEditing(null)} className="btn btn-circle btn-ghost">✕</button></div><form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="flex flex-col"><span className="mb-2 text-sm font-medium">عنوان تور</span><input name="title" required defaultValue={editing.title} className="input w-full max-w-none" /></label><label className="flex flex-col"><span className="mb-2 text-sm font-medium">مقصد</span><input name="dest" required defaultValue={editing.dest} className="input w-full max-w-none" /></label><label className="flex flex-col"><span className="mb-2 text-sm font-medium">مدت سفر</span><input name="duration" required defaultValue={editing.duration} className="input w-full max-w-none" /></label><label className="flex flex-col"><span className="mb-2 text-sm font-medium">ایرلاین</span><input name="airline" required defaultValue={editing.airline} className="input w-full max-w-none" /></label><label className="flex flex-col"><span className="mb-2 text-sm font-medium">قیمت پایه (تومان)</span><input name="price" type="number" required defaultValue={editing.price} className="input w-full max-w-none" /></label><label className="flex flex-col"><span className="mb-2 text-sm font-medium">نوع تور</span><select name="type" defaultValue={editing.type} className="select w-full max-w-none"><option value="international">خارجی</option><option value="domestic">داخلی</option></select></label><label className="flex flex-col"><span className="mb-2 text-sm font-medium">وضعیت</span><select name="status" defaultValue={editing.status} className="select w-full max-w-none"><option value="active">فعال</option><option value="inactive">غیرفعال</option></select></label><label className="flex flex-col"><span className="mb-2 text-sm font-medium">تاریخ‌ها (با ویرگول)</span><input name="dates" defaultValue={editing.dates?.join(", ")} className="input w-full max-w-none" /></label><label className="flex flex-col sm:col-span-2"><span className="mb-2 text-sm font-medium">توضیحات</span><textarea name="desc" defaultValue={editing.desc} className="textarea min-h-28 w-full max-w-none" /></label><div className="modal-action sm:col-span-2"><button type="button" className="btn" onClick={()=>setEditing(null)}>انصراف</button><button disabled={busy} className="btn btn-primary">{busy?<span className="loading loading-spinner loading-sm"/>:"ذخیره تغییرات"}</button></div></form></div><div className="modal-backdrop" onClick={()=>setEditing(null)} /></div>}
  </main>;
}
