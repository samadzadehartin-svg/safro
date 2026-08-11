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
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-[2rem] p-5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-control">
          <span className="label-text mb-2 text-xs text-white/50">Your name</span>
          <input name="name" required minLength={2} className="input w-full rounded-xl border-white/10 bg-white/5 focus:outline-blue-300" placeholder="Alex Morgan" />
        </label>
        <label className="form-control">
          <span className="label-text mb-2 text-xs text-white/50">Email</span>
          <input name="email" type="email" required className="input w-full rounded-xl border-white/10 bg-white/5 focus:outline-blue-300" placeholder="alex@email.com" />
        </label>
      </div>
      <label className="form-control mt-4">
        <span className="label-text mb-2 text-xs text-white/50">Tell us about your trip</span>
        <textarea name="message" required minLength={10} className="textarea min-h-36 w-full rounded-xl border-white/10 bg-white/5 focus:outline-blue-300" placeholder="Dates, people, style of travel, places you love..." />
      </label>
      <button disabled={status === "loading"} className="btn mt-5 rounded-full border-0 bg-white px-6 text-slate-950 hover:bg-blue-100">
        {status === "loading" ? <span className="loading loading-spinner loading-xs" /> : <Send className="size-4" />}
        Send request
      </button>
      {message && <p className={`mt-4 text-sm ${status === "error" ? "text-red-300" : "text-emerald-300"}`}>{message}</p>}
    </form>
  );
}
