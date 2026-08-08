"use client";

import { AttentionSection } from "@/components/dashboard/AttentionSection";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { InventoryOverview } from "@/components/dashboard/InventoryOverview";

/** Dashboard – Startseite und Kommandozentrale (PRD 3.1). */
export default function DashboardPage() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="space-y-5">
        <h1 className="page-title">Übersicht</h1>
        <DashboardSearch />
      </div>

      <AttentionSection />
      <InventoryOverview />
    </div>
  );
}
