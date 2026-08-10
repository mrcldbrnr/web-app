"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ItemImage } from "@/components/items/ItemImage";
import { SearchIcon } from "@/components/ui/Icons";
import { categoryLabel } from "@/lib/constants";
import { useInventory } from "@/lib/data/InventoryProvider";
import { itemPrimaryLocation } from "@/lib/logic/locations";
import { searchItems } from "@/lib/logic/search";
import { activeItems } from "@/lib/logic/stats";

const MAX_RESULTS = 10;

/**
 * Live-Suche des Dashboards: Treffer erscheinen bereits während der Eingabe,
 * aussortierte Gegenstände werden nicht durchsucht (PRD 3.1).
 */
export function DashboardSearch() {
  const { data } = useInventory();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(
    () => searchItems(activeItems(data.items), query, data),
    [data, query],
  );

  const visible = hits.slice(0, MAX_RESULTS);
  const showPanel = open && query.trim().length > 0;

  const goToInventory = () => {
    router.push(`/inventory?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  // Schliesst das Panel bei Klick ausserhalb. Ein onBlur-Handler würde das
  // Panel schon vor dem Klick auf einen Treffer schliessen und dessen
  // Navigation verhindern.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && query.trim()) goToInventory();
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Inventar durchsuchen …"
          aria-label="Inventar durchsuchen"
          className="h-14 w-full rounded-full border border-line bg-white pr-5 pl-13 text-[16px] text-ink placeholder:text-muted focus:border-ink focus:outline-none sm:h-16 sm:text-[17px]"
        />
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-3xl border border-line bg-white shadow-lg">
          {visible.length === 0 ? (
            <p className="px-5 py-6 text-[15px] text-muted">
              Keine Treffer für «{query.trim()}».
            </p>
          ) : (
            <>
              <ul>
                {visible.map(({ item }) => (
                  <li key={item.id} className="border-b border-line last:border-0">
                    <Link
                      href={`/items/${item.id}`}
                      className="row-link flex items-center gap-4 px-4 py-3"
                      onClick={() => setOpen(false)}
                    >
                      <ItemImage
                        item={item}
                        className="h-12 w-12 shrink-0"
                        textClassName="text-sm"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-semibold text-ink">
                          {item.name}
                        </span>
                        <span className="block truncate text-[13px] text-muted">
                          {[
                            categoryLabel(item.category),
                            itemPrimaryLocation(data, item),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {hits.length > visible.length && (
                <button
                  type="button"
                  onClick={goToInventory}
                  className="w-full border-t border-line px-5 py-3.5 text-left text-[14px] font-semibold text-ink hover:bg-surface-soft"
                >
                  Alle anzeigen ({hits.length})
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
