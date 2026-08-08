import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { AppNav } from "@/components/layout/AppNav";
import { InventoryGate } from "@/components/layout/InventoryGate";
import { InventoryProvider } from "@/lib/data/InventoryProvider";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "myown – Persönliches Inventar",
  description:
    "Physische Besitztümer zentral erfassen, finden und verwalten: Standort, Kaufpreis, Zustand, Status und Packlisten.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface">
        <InventoryProvider>
          <AppNav />
          <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 sm:pt-8 md:pb-16">
            <InventoryGate>{children}</InventoryGate>
          </main>
        </InventoryProvider>
      </body>
    </html>
  );
}
