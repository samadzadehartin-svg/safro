"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardIcon, HomeIcon, MenuIcon, MoonIcon, PhoneIcon, SunIcon } from "./icons";

export function SiteHeader({ active = "home" }: { active?: "home" | "staff" | "admin" }) {
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

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/90 backdrop-blur-xl">
        <div className="navbar mx-auto max-w-7xl px-4 lg:px-6">
          <div className="navbar-start gap-2">
            <div className="dropdown lg:hidden">
              <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="منو"><MenuIcon /></button>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
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
            <ul className="menu menu-horizontal gap-1 px-1 font-medium">
              <li><Link className={active === "home" ? "menu-active" : ""} href="/">تورهای سفر</Link></li>
              <li><Link className={active === "staff" ? "menu-active" : ""} href="/staff">پنل فروش</Link></li>
              <li><Link className={active === "admin" ? "menu-active" : ""} href="/admin">مدیریت</Link></li>
            </ul>
          </nav>
          <div className="navbar-end gap-1">
            <button className="btn btn-ghost btn-circle" onClick={toggleTheme} aria-label="تغییر تم">
              {theme === "safro-dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="tel:+982191004000" className="btn btn-primary hidden sm:inline-flex"><PhoneIcon className="size-4" /> مشاوره سفر</a>
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
