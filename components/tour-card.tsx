import Link from "next/link";
import type { Tour } from "@/lib/types";
import { ArrowLeftIcon, CalendarIcon, PlaneIcon, StarIcon } from "./icons";

const faMoney = (n: number) => `${new Intl.NumberFormat("fa-IR").format(n)} تومان`;
const imagePath = (src?: string) => src?.replace(/^\.\.\//, "/").replace(/^assets\//, "/assets/").replace(/\.svg$/, ".gif") || "/assets/images/default.gif";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="card group overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <figure className="relative h-52 overflow-hidden bg-base-200 sm:h-56">
        <img src={imagePath(tour.img)} alt={tour.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-2">
            {tour.label && <span className="badge badge-secondary border-0 shadow">{tour.label}</span>}
            {tour.lastMinute && <span className="badge badge-error text-white">لحظه آخری</span>}
          </div>
          <span className="badge border-0 bg-base-100/90 text-base-content backdrop-blur"><StarIcon className="size-3 fill-current text-warning" /> {tour.rating ?? 4.5}</span>
        </div>
      </figure>
      <div className="card-body gap-4 p-5">
        <div>
          <p className="mb-1 text-xs font-medium text-primary">{tour.type === "domestic" ? "تور داخلی" : "تور خارجی"}</p>
          <h2 className="card-title text-lg leading-7">{tour.title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-base-content/70">
          <div className="flex items-center gap-2"><PlaneIcon className="size-4 text-primary" /><span>{tour.airline}</span></div>
          <div className="flex items-center gap-2"><CalendarIcon className="size-4 text-primary" /><span>{tour.duration}</span></div>
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-base-300 pt-4">
          <div><span className="block text-xs text-base-content/60">شروع قیمت از</span><strong className="text-lg text-primary">{faMoney(tour.newPrice || tour.price)}</strong></div>
          <Link href={`/tours/${tour.id}`} className="btn btn-primary btn-sm">جزئیات <ArrowLeftIcon className="size-4" /></Link>
        </div>
      </div>
    </article>
  );
}
