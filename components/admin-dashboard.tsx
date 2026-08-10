"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { DashboardSummary, Order } from "@/lib/types";

const money=(n:number)=>`${new Intl.NumberFormat("fa-IR").format(n||0)} تومان`;
export function AdminDashboard(){
 const [summary,setSummary]=useState<DashboardSummary|null>(null); const [orders,setOrders]=useState<Order[]>([]);
 const load=()=>Promise.all([api.dashboard().then(setSummary),api.orders.list().then(setOrders)]);
 useEffect(()=>{load().catch(()=>{});},[]);
 async function status(id:number,value:Order["status"]){await api.orders.updateStatus(id,value);await load();}
 const cards=[['کل تورها',summary?.tours??0],['تور فعال',summary?.activeTours??0],['درخواست رزرو',summary?.orders??0],['درخواست جدید',summary?.newOrders??0]];
 return <main className="mx-auto max-w-7xl px-4 py-8 pb-28 lg:px-6 lg:py-12"><div className="mb-8"><span className="text-sm font-semibold text-primary">پنل مدیریت</span><h1 className="mt-2 text-3xl font-black">داشبورد سفرو</h1><p className="mt-2 text-base-content/60">نمای کلی فروش و درخواست‌های ثبت‌شده از نسخه جدید.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label,value])=><div key={label} className="stat rounded-3xl border border-base-300 bg-base-100 shadow-sm"><div className="stat-title">{label}</div><div className="stat-value text-primary">{new Intl.NumberFormat('fa-IR').format(Number(value))}</div></div>)}</div><div className="mt-5 rounded-3xl bg-primary p-6 text-primary-content"><span className="text-sm opacity-80">ارزش تقریبی درخواست‌ها</span><div className="mt-2 text-3xl font-black">{money(summary?.revenue??0)}</div></div><section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-black">آخرین درخواست‌ها</h2><p className="text-sm text-base-content/60">وضعیت هر رزرو را از همین جدول تغییر بده.</p></div></div><div className="overflow-x-auto rounded-3xl border border-base-300 bg-base-100"><table className="table"><thead><tr><th>مسافر</th><th>تور</th><th>تعداد</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody>{orders.length===0?<tr><td colSpan={5} className="py-12 text-center text-base-content/50">هنوز درخواستی ثبت نشده است.</td></tr>:orders.map(o=><tr key={o.id}><td><b>{o.fullName}</b><div className="text-xs text-base-content/50" dir="ltr">{o.phone}</div></td><td>{o.tourTitle}<div className="text-xs text-base-content/50">{o.date||'—'} · {o.hotel||'هتل انتخاب نشده'}</div></td><td>{o.passengers}</td><td>{money(o.totalPrice)}</td><td><select className="select select-sm w-full max-w-none" value={o.status} onChange={e=>status(o.id,e.target.value as Order['status'])}><option value="new">جدید</option><option value="contacted">تماس گرفته شد</option><option value="confirmed">تأیید</option><option value="cancelled">لغو</option></select></td></tr>)}</tbody></table></div></section></main>
}
