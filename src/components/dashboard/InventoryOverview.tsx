"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { useInventory } from "@/lib/data/InventoryProvider";
import { formatNumber, formatPrice } from "@/lib/format";
import { getInventoryStats } from "@/lib/logic/stats";

/**
 * Inventarstatistik nach Kategorien. Aussortierte Gegenstände fliessen weder
 * in Anzahl noch in die Kaufpreissumme ein (PRD 3.1).
 */
export function InventoryOverview() {
  const { data } = useInventory();
  const stats = useMemo(() => getInventoryStats(data.items), [data.items]);
  const currency = data.settings.currencyLabel;

  return (
    <section aria-labelledby="overview-heading" className="space-y-4">
      <h2 id="overview-heading" className="section-title">
        Inventarübersicht
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="card px-5 py-4">
          <p className="muted-label">Gegenstände</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {formatNumber(stats.itemCount)}
          </p>
        </div>
        <div className="card px-5 py-4">
          <p className="muted-label">Kaufpreise</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {formatPrice(stats.totalPrice, currency)}
          </p>
        </div>
      </div>

      {stats.categories.length > 0 && (
        <ul className="card divide-y divide-line overflow-hidden">
          {stats.categories.map((category) => {
            const href =
              category.id === "uncategorized"
                ? "/inventory"
                : `/inventory?category=${category.id}`;
            return (
              <li key={category.id}>
                <Link
                  href={href}
                  className="row-link flex items-center gap-4 px-5 py-3.5"
                >
                  <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
                    {category.label}
                  </span>
                  <span className="w-12 shrink-0 text-right text-[14px] text-muted tabular-nums">
                    {formatNumber(category.count)}
                  </span>
                  <span className="w-28 shrink-0 text-right text-[14px] text-ink tabular-nums sm:w-36">
                    {formatPrice(category.totalPrice, currency)}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-line-strong" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
