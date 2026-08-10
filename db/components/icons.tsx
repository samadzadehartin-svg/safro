import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const SearchIcon = (p: Props) => <svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>;
export const PlaneIcon = (p: Props) => <svg {...base} {...p}><path d="M22 2 9.6 14.4"/><path d="m15 3 7-1-1 7"/><path d="M13 6 5 4 3 6l6 4"/><path d="m14 15 4 6 2-2-2-8"/><path d="m9.6 14.4-4.8 4.8"/></svg>;
export const CalendarIcon = (p: Props) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>;
export const UsersIcon = (p: Props) => <svg {...base} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>;
export const HomeIcon = (p: Props) => <svg {...base} {...p}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>;
export const DashboardIcon = (p: Props) => <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
export const PhoneIcon = (p: Props) => <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z"/></svg>;
export const MenuIcon = (p: Props) => <svg {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
export const ArrowLeftIcon = (p: Props) => <svg {...base} {...p}><path d="m15 18-6-6 6-6"/></svg>;
export const StarIcon = (p: Props) => <svg {...base} {...p}><path d="m12 2 3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.2-6 3.2 1.2-6.7-4.9-4.7 6.7-1L12 2Z"/></svg>;
export const MoonIcon = (p: Props) => <svg {...base} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>;
export const SunIcon = (p: Props) => <svg {...base} {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
