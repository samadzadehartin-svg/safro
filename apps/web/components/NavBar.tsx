"use client";

import { Menu, Sparkles } from "lucide-react";

const links = [
  ["Home", "#home"],
  ["Experiences", "#experiences"],
  ["Strategy", "#strategy"],
  ["Stories", "#stories"],
  ["Contact", "#contact"],
];

export function NavBar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5">
        <a href="#home" className="flex items-center gap-2 text-sm font-black tracking-[0.22em]">
          <Sparkles className="size-4 text-blue-300" /> AURA
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, href], index) => (
            <a
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 text-xs transition ${index === 0 ? "bg-white text-slate-950" : "text-white/65 hover:bg-white/8 hover:text-white"}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="dropdown dropdown-end md:hidden">
          <button tabIndex={0} className="btn btn-circle btn-ghost btn-sm" aria-label="Open menu">
            <Menu className="size-4" />
          </button>
          <ul tabIndex={0} className="menu dropdown-content glass z-[1] mt-3 w-52 rounded-2xl p-2 shadow">
            {links.map(([label, href]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        <a href="#contact" className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/75 hover:bg-white/10 md:block">
          Open concierge
        </a>
      </div>
    </header>
  );
}
