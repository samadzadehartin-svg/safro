import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA Paris — Private Paris Concierge",
  description: "Private Paris journeys with hotels, dining, transfers and local experiences coordinated around your taste.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="night">
      <body>{children}</body>
    </html>
  );
}
