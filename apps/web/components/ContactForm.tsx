"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { sendContact } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading");
    setMessage("");

    try {
      await sendContact({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        message: String(form.get("message") || ""),
      });
      setStatus("done");
      setMessage("Request received. Our concierge will follow up shortly.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-[2rem] p-5 sm:p-8" aria-busy={status === "loading"}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-amber-200/80">A few details are enough</p>
        <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">Tell us your dates, group size and what a great trip feels like. You do not need a finished itinerary.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-control">
          <span className="label-text mb-2 text-sm font-medium text-white/80">Your name</span>
          <input name="name" autoComplete="name" required minLength={2} className="input min-h-12 w-full rounded-xl border-white/15 bg-white/7 text-white placeholder:text-white/35 focus:outline-2 focus:outline-amber-200" placeholder="Alex Morgan" />
        </label>
        <label className="form-control">
          <span className="label-text mb-2 text-sm font-medium text-white/80">Email</span>
          <input name="email" type="email" autoComplete="email" required className="input min-h-12 w-full rounded-xl border-white/15 bg-white/7 text-white placeholder:text-white/35 focus:outline-2 focus:outline-amber-200" placeholder="alex@email.com" />
        </label>
      </div>
      <label className="form-control mt-4">
        <span className="label-text mb-2 text-sm font-medium text-white/80">What should we know about the trip?</span>
        <textarea name="message" required minLength={10} className="textarea min-h-40 w-full rounded-xl border-white/15 bg-white/7 text-white placeholder:text-white/35 focus:outline-2 focus:outline-amber-200" placeholder="May 12–16, two travelers. We love architecture, small restaurants and unhurried mornings..." />
      </label>
      <button disabled={status === "loading"} className="btn mt-5 min-h-12 rounded-full border-0 bg-amber-200 px-6 text-slate-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60">
        {status === "loading" ? <span className="loading loading-spinner loading-xs" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
        {status === "loading" ? "Sending…" : "Send trip brief"}
      </button>
      <div className="min-h-7" aria-live="polite" aria-atomic="true">
        {message && <p role={status === "error" ? "alert" : "status"} className={`mt-4 text-sm ${status === "error" ? "text-red-200" : "text-emerald-200"}`}>{message}</p>}
      </div>
    </form>
  );
}
