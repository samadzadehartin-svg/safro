import type { Metadata } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: { default: "سفرو | تور و سفر", template: "%s | سفرو" },
  description: "رزرو و مدیریت تورهای سفرو",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl" data-theme="safro"><body>{children}<PwaRegister /></body></html>;
}
