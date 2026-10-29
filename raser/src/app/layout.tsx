import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "RASER – Rubric Designer" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <nav aria-label="Main"><Link className="brand" href="/">RASER</Link><span className="muted">Rubric designer</span></nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
