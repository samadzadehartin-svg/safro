import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA Paris — Premium Travel",
  description: "A luxury Paris travel landing page built with Next.js, Tailwind CSS and DaisyUI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="night">
      <body>{children}</body>
    </html>
  );
}
