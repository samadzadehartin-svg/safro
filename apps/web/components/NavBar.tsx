"use client";

import { Menu, Sparkles } from "lucide-react";

const links = [
  ["Experiences", "#experiences"],
  ["How it works", "#strategy"],
  ["Stories", "#stories"],
  ["Contact", "#contact"],
];

export function NavBar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2.5 sm:px-4">
        <a href="#home" className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-black tracking-[0.2em] text-white focus-visible:outline-none">
          <Sparkles className="size-4 text-amber-200" aria-hidden="true" /> AURA
          <span className="sr-only">Paris home</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center rounded-full px-4 text-xs text-white/75 transition duration-200 hover:bg-white/10 hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <div className="dropdown dropdown-end md:hidden">
          <button type="button" tabIndex={0} className="btn btn-circle btn-ghost min-h-11 min-w-11" aria-label="Open navigation menu">
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <ul tabIndex={0} className="menu dropdown-content glass z-[1] mt-3 w-56 rounded-2xl p-2 shadow" aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <li key={href}><a className="min-h-11" href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        <a href="#contact" className="hidden min-h-11 items-center rounded-full bg-amber-200 px-5 text-xs font-semibold text-slate-950 transition duration-200 hover:bg-amber-100 md:inline-flex">
          Plan my trip
        </a>
      </div>
    </header>
  );
}
