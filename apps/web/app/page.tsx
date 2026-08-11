import { ArrowUpRight, BadgeCheck, Gem, HeartHandshake, Hotel, Map, Plane, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

const experiences = [
  { icon: Hotel, title: "Stay beautifully", text: "Boutique hotels and exceptional suites selected around your style." },
  { icon: UtensilsCrossed, title: "Dine without guessing", text: "Tables worth crossing Paris for, from intimate bistros to Michelin rooms." },
  { icon: Map, title: "See the hidden city", text: "Private routes through architecture, art, markets and quiet local streets." },
  { icon: Plane, title: "Arrive effortlessly", text: "Airport pickup, transfers and timing coordinated into one calm itinerary." },
];

const principles = [
  ["01", "Bold itineraries that shape identity", "We mix essential Paris with unexpected details so the trip feels authored, not packaged."],
  ["02", "Meaningful growth through impact", "Every hour earns its place. We optimize routes, reservations and access around what matters to you."],
  ["03", "Creative process with rapid delivery", "A clear plan arrives fast, and the concierge layer remains flexible while you are in the city."],
  ["04", "A dedicated team behind success", "One point of contact coordinates the moving parts so you can stay present in the experience."],
];

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <Hero />

      <section id="experiences" className="section-grid relative overflow-hidden border-t border-white/5 bg-[#06080d] px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[.34em] text-blue-300/70">Curated around you</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Paris, with the noise removed.</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/50">A premium travel experience where planning, access and local taste come together in one calm flow.</p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {experiences.map((item, index) => (
              <Reveal key={item.title} delay={index * .08}>
                <article className="glass group min-h-72 rounded-[2rem] p-6 transition duration-300 hover:-translate-y-2 hover:border-blue-300/25">
                  <div className="grid size-11 place-items-center rounded-2xl bg-white text-slate-950"><item.icon className="size-5" /></div>
                  <div className="mt-20">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/45">{item.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-4 py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70vw] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[110px]" />
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-4xl italic leading-tight text-white/88 sm:text-6xl">Proudly trusted by travelers who value time, taste and detail.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-xs font-semibold tracking-[.2em] text-white/30">
              <span>ATELIER 21</span><span>MONOCLE</span><span>AVENUE</span><span>MAISON</span><span>NORTH STAR</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="strategy" className="section-grid bg-[#07090e] px-4 py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <div className="sticky top-28">
              <p className="text-xs uppercase tracking-[.32em] text-blue-300/70">How we work</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">A sharp plan. A soft landing.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/48">The experience is designed to feel spontaneous while the difficult parts are already handled behind the scenes.</p>
              <a href="#contact" className="btn btn-sm mt-7 rounded-full border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950">Build my trip <ArrowUpRight className="size-4" /></a>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(([no, title, text], index) => (
              <Reveal key={no} delay={index * .07}>
                <article className="glass min-h-72 rounded-[2rem] p-6">
                  <div className="flex items-center justify-between text-xs text-white/35"><span>{no}</span><Sparkles className="size-4" /></div>
                  <h3 className="mt-20 max-w-[13rem] text-xl font-medium leading-tight">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/42">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="relative overflow-hidden bg-[#071020] px-4 py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(56,105,255,.24),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(89,132,255,.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[.32em] text-blue-200/70">Traveler story</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Less logistics. More Paris.</h2>
            </div>
            <div className="flex gap-1">{[1,2,3,4,5].map(n => <Star key={n} className="size-4 fill-white text-white" />)}</div>
          </Reveal>

          <Reveal>
            <div className="glass grid overflow-hidden rounded-[2rem] lg:grid-cols-[.75fr_1.25fr]">
              <div className="relative min-h-80 overflow-hidden bg-gradient-to-br from-slate-100 to-blue-200">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-950/30 to-transparent" />
                <div className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-[18px] border-white/70 bg-gradient-to-b from-slate-700 to-slate-950 shadow-2xl" />
                <div className="absolute bottom-7 left-7 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-950">Sophie • London</div>
              </div>
              <div className="p-7 sm:p-10 lg:p-12">
                <BadgeCheck className="size-8 text-blue-200" />
                <blockquote className="mt-8 text-balance text-2xl font-medium leading-snug sm:text-3xl">“We stopped thinking about reservations, routes and timing. We just enjoyed the city — and every day somehow felt better than the last.”</blockquote>
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-7">
                  <div><div className="text-3xl font-semibold">4</div><div className="mt-1 text-xs text-white/40">Days in Paris</div></div>
                  <div><div className="text-3xl font-semibold">11</div><div className="mt-1 text-xs text-white/40">Reservations</div></div>
                  <div><div className="text-3xl font-semibold">0</div><div className="mt-1 text-xs text-white/40">Planning stress</div></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-black px-4 py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="grid gap-6 lg:grid-cols-3">
            <div className="glass rounded-[2rem] p-7"><Gem className="size-6 text-blue-200" /><div className="mt-16 text-4xl font-semibold">24/7</div><p className="mt-2 text-sm text-white/45">Concierge support during your trip.</p></div>
            <div className="glass rounded-[2rem] p-7"><HeartHandshake className="size-6 text-blue-200" /><div className="mt-16 text-4xl font-semibold">1:1</div><p className="mt-2 text-sm text-white/45">A personal plan, not a generic package.</p></div>
            <div className="glass rounded-[2rem] p-7"><Sparkles className="size-6 text-blue-200" /><div className="mt-16 text-4xl font-semibold">48h</div><p className="mt-2 text-sm text-white/45">Typical turnaround for a first itinerary.</p></div>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="section-grid bg-[#07090f] px-4 py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <Reveal>
            <p className="text-xs uppercase tracking-[.32em] text-blue-300/70">Start a conversation</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Tell us what your perfect Paris feels like.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/48">Share the basics. The NestJS API receives the form and is ready to be connected to a database, CRM or email workflow.</p>
          </Reveal>
          <Reveal delay={.1}><ContactForm /></Reveal>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 text-xs text-white/35 sm:flex-row">
          <div className="font-semibold tracking-[.22em] text-white/70">AURA PARIS</div>
          <div>Next.js • Tailwind CSS • DaisyUI • NestJS</div>
          <div>© 2026</div>
        </div>
      </footer>
    </main>
  );
}
