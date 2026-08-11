"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Compass, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="hero-shell flex min-h-screen items-center justify-center px-4 pb-24 pt-32">
      <div className="stars" />
      <div className="paris-silhouette" />
      <div className="eiffel" />
      <div className="dome" />
      <div className="cloud-bank" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl place-items-center">
        <motion.div
          initial={{ opacity: 0, scale: .92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: .85, ease: [0.2, 0.8, 0.2, 1] }}
          className="window-wrap"
        >
          <div className="window-sky flex items-center justify-center px-8 text-center">
            <div className="relative z-10 -translate-y-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.36em] text-blue-100/65">Private Paris journeys</p>
              <h1 className="text-balance text-4xl font-semibold leading-[.96] tracking-[-.055em] sm:text-5xl">
                Experience Paris Like Never Before
              </h1>
              <p className="mx-auto mt-5 max-w-xs text-xs leading-5 text-blue-50/70">
                From iconic landmarks to hidden cafés and unforgettable nights, we create journeys that feel effortless and personal.
              </p>
              <a href="#experiences" className="btn btn-sm mt-6 rounded-full border-0 bg-white px-5 text-slate-950 hover:bg-blue-100">
                Explore tours <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .7, delay: .5 }}
          className="glass absolute bottom-2 left-0 hidden w-64 rounded-2xl p-5 lg:block"
        >
          <div className="mb-8 grid size-8 place-items-center rounded-lg bg-white text-slate-950"><Compass className="size-4" /></div>
          <h3 className="text-sm font-semibold">Authentic Paris Experiences</h3>
          <p className="mt-2 text-xs leading-5 text-white/50">Local neighborhoods, charming streets and cultural moments selected around you.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .7, delay: .6 }}
          className="glass absolute bottom-2 right-0 hidden w-64 rounded-2xl p-5 lg:block"
        >
          <div className="mb-8 grid size-8 place-items-center rounded-lg bg-white text-slate-950"><ShieldCheck className="size-4" /></div>
          <h3 className="text-sm font-semibold">Stress-Free Every Step</h3>
          <p className="mt-2 text-xs leading-5 text-white/50">From airport transfer to dinner reservations, every detail can be handled for you.</p>
        </motion.div>
      </div>
    </section>
  );
}
