"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3, Compass, ShieldCheck, Star } from "lucide-react";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="hero-shell flex min-h-dvh items-center justify-center px-4 pb-24 pt-32">
      <div className="stars hero-fallback-three" />
      <div className="paris-silhouette" />
      <div className="eiffel hero-fallback-three" />
      <div className="dome" />
      <div className="cloud-bank hero-fallback-three" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl place-items-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: .96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: .65, ease: [0.2, 0.8, 0.2, 1] }}
          className="window-wrap"
        >
          <div className="window-sky flex items-center justify-center px-6 text-center sm:px-9">
            <div className="relative z-10 -translate-y-3">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-100/80">Private Paris journeys</p>
              <h1 className="font-display text-balance text-4xl font-medium leading-[.95] tracking-[-.045em] text-stone-50 sm:text-6xl">
                Paris, beautifully handled.
              </h1>
              <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-blue-50/80">
                A private concierge for travelers who want exceptional stays, tables, neighborhoods and timing — without spending the trip managing logistics.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#contact" className="btn min-h-11 rounded-full border-0 bg-amber-200 px-6 text-slate-950 hover:bg-amber-100">
                  Plan my Paris <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
                <a href="#experiences" className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium text-white/85 underline-offset-4 hover:text-white hover:underline">
                  See what we arrange
                </a>
              </div>
              <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-white/70" aria-label="Service highlights">
                <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5 text-amber-200" aria-hidden="true" /> First plan in 48h</span>
                <span className="inline-flex items-center gap-1.5"><Star className="size-3.5 fill-amber-200 text-amber-200" aria-hidden="true" /> 1:1 concierge</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-amber-200" aria-hidden="true" /> Support while you travel</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .55, delay: reduceMotion ? 0 : .35 }}
          className="glass absolute bottom-2 left-0 hidden w-64 rounded-2xl p-5 lg:block"
        >
          <div className="mb-8 grid size-10 place-items-center rounded-xl bg-amber-200 text-slate-950"><Compass className="size-4" aria-hidden="true" /></div>
          <h2 className="text-sm font-semibold">Authentic, not generic</h2>
          <p className="mt-2 text-xs leading-5 text-white/70">Local neighborhoods, distinctive rooms and cultural moments selected around your taste.</p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .55, delay: reduceMotion ? 0 : .42 }}
          className="glass absolute bottom-2 right-0 hidden w-64 rounded-2xl p-5 lg:block"
        >
          <div className="mb-8 grid size-10 place-items-center rounded-xl bg-amber-200 text-slate-950"><ShieldCheck className="size-4" aria-hidden="true" /></div>
          <h2 className="text-sm font-semibold">Calm from arrival to checkout</h2>
          <p className="mt-2 text-xs leading-5 text-white/70">Transfers, reservations and route timing are coordinated so the experience stays effortless.</p>
        </motion.div>
      </div>
    </section>
  );
}
