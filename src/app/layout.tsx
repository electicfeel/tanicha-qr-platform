import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TANICHA QR Platform",
  description: "Dynamic QR Code Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-neutral-950 text-neutral-100 min-h-screen`}>
        <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-widest uppercase text-neutral-100">
            TANICHA <span className="text-neutral-400 font-light">QR</span>
          </Link>
          <Link
            href="/create"
            className="bg-neutral-100 text-neutral-950 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition-colors"
          >
            + สร้างลิงก์
          </Link>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
