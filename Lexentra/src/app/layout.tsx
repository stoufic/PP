import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexentra",
  description: "AI infrastructure for high-stakes agreements."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="border-t border-white/70 bg-[#f4f2ed] px-4 py-6">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>Lexentra. AI infrastructure for high-stakes agreements.</p>
            <div className="flex gap-5">
              <Link href="/">Home</Link>
              <Link href="/login">Login</Link>
              <Link href="/signup">Create workspace</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
