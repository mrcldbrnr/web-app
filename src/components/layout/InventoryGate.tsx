"use client";

import { useInventory } from "@/lib/data/InventoryProvider";

/** Zeigt Inhalte erst, wenn der gespeicherte Datenbestand geladen ist. */
export function InventoryGate({ children }: { children: React.ReactNode }) {
  const { ready } = useInventory();

  if (!ready) {
    return (
      <div className="py-24 text-center text-[15px] text-muted">
        Inventar wird geladen …
      </div>
    );
  }

  return <>{children}</>;
}
