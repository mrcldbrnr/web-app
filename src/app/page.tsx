"use client";

import { AttentionSection } from "@/components/dashboard/AttentionSection";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { InventoryOverview } from "@/components/dashboard/InventoryOverview";

/** Dashboard – Startseite und Kommandozentrale (PRD 3.1). */
export default function DashboardPage() {
  return (
    <div className="relative overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-1/2 -z-10 h-[32rem] w-screen -translate-x-1/2 bg-[radial-gradient(ellipse_farthest-side_at_top,#e0e0ff,transparent)] opacity-70 sm:-top-8"
      />

      <div className="space-y-10 sm:space-y-12">
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <h1 className="page-title">Was suchst du?</h1>
          <DashboardSearch />
        </div>

        <AttentionSection />
        <InventoryOverview />
      </div>
    </div>
  );
}
