"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardIcon, HomeIcon, MenuIcon, MoonIcon, PhoneIcon, SunIcon } from "./icons";

export function SiteHeader({ active = "home", cinematic = false }: { active?: "home" | "staff" | "admin"; cinematic?: boolean }) {
  const [theme, setTheme] = useState("safro");
  useEffect(() => {
    const saved = localStorage.getItem("safro-theme") || "safro";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);
  const toggleTheme = () => {
    const next = theme === "safro-dark" ? "safro" : "safro-dark";
    setTheme(next);
    localStorage.setItem("safro-theme", next);
    document.documentElement.dataset.theme = next;
  };

  const headerClass = cinematic
    ? "sticky top-0 z-50 border-b border-white/10 bg-[#04070d]/88 text-white backdrop-blur-2xl"
    : "sticky top-0 z-50 border-b border-base-300/70 bg-base-100/90 backdrop-blur-xl";

  return (
    <>
      <header className={headerClass}>
        <div className="navbar mx-auto max-w-7xl px-4 lg:px-6">
          <div className="navbar-start gap-2">
            <div className="dropdown lg:hidden">
              <button tabIndex={0} className={`btn btn-circle ${cinematic ? "border-white/10 bg-white/[.06] text-white hover:bg-white/10" : "btn-ghost"}`} aria-label="منو"><MenuIcon /></button>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 text-base-content shadow-xl">
                <li><Link href="/">تورهای سفر</Link></li>
                <li><Link href="/staff">پنل فروش</Link></li>
                <li><Link href="/admin">مدیریت</Link></li>
              </ul>
            </div>
            <Link href="/" className="flex items-center gap-2">
              <img src="/assets/images/logo-safaro.png" alt="سفرو" className="h-10 w-auto max-w-[120px] object-contain" />
            </Link>
          </div>
          <nav className="navbar-center hidden lg:flex">
            <ul className={`menu menu-horizontal gap-1 px-1 font-medium ${cinematic ? "text-white/65" : ""}`}>
              <li><Link className={cinematic ? (active === "home" ? "bg-white text-slate-950 hover:bg-white" : "hover:bg-white/10 hover:text-white") : (active === "home" ? "menu-active" : "")} href="/">تورهای سفر</Link></li>
              <li><Link className={cinematic ? (active === "staff" ? "bg-white text-slate-950 hover:bg-white" : "hover:bg-white/10 hover:text-white") : (active === "staff" ? "menu-active" : "")} href="/staff">پنل فروش</Link></li>
              <li><Link className={cinematic ? (active === "admin" ? "bg-white text-slate-950 hover:bg-white" : "hover:bg-white/10 hover:text-white") : (active === "admin" ? "menu-active" : "")} href="/admin">مدیریت</Link></li>
            </ul>
          </nav>
          <div className="navbar-end gap-1">
            <button className={`btn btn-circle ${cinematic ? "border-white/10 bg-white/[.06] text-white hover:bg-white/10" : "btn-ghost"}`} onClick={toggleTheme} aria-label="تغییر تم">
              {theme === "safro-dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="tel:+982191004000" className={cinematic ? "btn hidden border-white/15 bg-white/[.07] text-white hover:border-[#ffb629]/50 hover:bg-[#ffb629] hover:text-slate-950 sm:inline-flex" : "btn btn-primary hidden sm:inline-flex"}><PhoneIcon className="size-4" /> مشاوره سفر</a>
          </div>
        </div>
      </header>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-base-300 bg-base-100/95 px-3 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
          <Link href="/" className={`mobile-nav-item ${active === "home" ? "active" : ""}`}><HomeIcon /><span>خانه</span></Link>
          <Link href="/staff" className={`mobile-nav-item ${active === "staff" ? "active" : ""}`}><DashboardIcon /><span>فروش</span></Link>
          <Link href="/admin" className={`mobile-nav-item ${active === "admin" ? "active" : ""}`}><MenuIcon /><span>مدیریت</span></Link>
        </div>
      </nav>
    </>
  );
}
