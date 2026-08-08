"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ActiveFilterChips } from "@/components/inventory/ActiveFilterChips";
import { FilterPanel } from "@/components/inventory/FilterPanel";
import { ItemListRow } from "@/components/items/ItemListRow";
import { Button } from "@/components/ui/Button";
import { SelectInput } from "@/components/ui/Field";
import { FilterIcon, SearchIcon } from "@/components/ui/Icons";
import { CATEGORIES } from "@/lib/constants";
import { useInventory } from "@/lib/data/InventoryProvider";
import {
  applyFilters,
  countActiveFilters,
  EMPTY_FILTERS,
  type InventoryFilters,
} from "@/lib/logic/filter";
import { searchItems } from "@/lib/logic/search";
import { SORT_OPTIONS, sortItems, type SortId } from "@/lib/logic/sort";
import { activeItems, retiredItems } from "@/lib/logic/stats";
import type { CategoryId, Item } from "@/lib/types";

export default function InventoryPage() {
  return (
    <Suspense fallback={<p className="py-10 text-muted">Inventar wird geladen …</p>}>
      <InventoryView />
    </Suspense>
  );
}

/** Inventar mit Sofortsuche, kombinierbaren Filtern und Sortierung (PRD 3.2). */
function InventoryView() {
  const { data } = useInventory();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") as CategoryId | null;
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<InventoryFilters>(() => ({
    ...EMPTY_FILTERS,
    categories:
      initialCategory && CATEGORIES.some((c) => c.id === initialCategory)
        ? [initialCategory]
        : [],
  }));
  const [sort, setSort] = useState<SortId>("name_asc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showRetired, setShowRetired] = useState(false);

  const activeFilterCount = countActiveFilters(filters);

  const process = useCallback(
    (items: Item[]) => {
      const filtered = applyFilters(items, filters);
      if (!query.trim()) return sortItems(filtered, sort);
      // Bei aktiver Suche bestimmt die Relevanz die Reihenfolge.
      return searchItems(filtered, query, data).map((hit) => hit.item);
    },
    [data, filters, query, sort],
  );

  const visibleItems = useMemo(
    () => process(activeItems(data.items)),
    [process, data.items],
  );

  const visibleRetired = useMemo(
    () => (showRetired ? process(retiredItems(data.items)) : []),
    [process, data.items, showRetired],
  );

  const retiredCount = useMemo(
    () => retiredItems(data.items).length,
    [data.items],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Inventar</h1>
        <p className="muted-label">
          {visibleItems.length}{" "}
          {visibleItems.length === 1 ? "Gegenstand" : "Gegenstände"}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Inventar durchsuchen …"
            aria-label="Inventar durchsuchen"
            className="h-12 w-full rounded-full border border-line bg-white pr-4 pl-12 text-[15px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filtersOpen || activeFilterCount ? "primary" : "secondary"}
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
          >
            <FilterIcon className="h-5 w-5" />
            Filter
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </Button>

          <SelectInput
            aria-label="Sortierung"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortId)}
            className="h-12 w-auto min-w-44 rounded-full py-0"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </div>
      </div>

      {filtersOpen && (
        <FilterPanel
          data={data}
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(EMPTY_FILTERS)}
        />
      )}

      <ActiveFilterChips
        data={data}
        filters={filters}
        currencyLabel={data.settings.currencyLabel}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {visibleItems.length === 0 ? (
        <p className="card px-5 py-10 text-center text-[15px] text-muted">
          Keine Gegenstände gefunden.
        </p>
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <ItemListRow
                item={item}
                locations={data}
                currencyLabel={data.settings.currencyLabel}
              />
            </li>
          ))}
        </ul>
      )}

      {retiredCount > 0 && (
        <section className="space-y-4 pt-2">
          <Button
            variant="secondary"
            onClick={() => setShowRetired((open) => !open)}
            aria-expanded={showRetired}
          >
            {showRetired
              ? "Aussortierte Objekte ausblenden"
              : `Aussortierte Objekte anzeigen (${retiredCount})`}
          </Button>

          {showRetired && (
            <div className="space-y-3">
              <h2 className="section-title">Aussortiert</h2>
              {visibleRetired.length === 0 ? (
                <p className="card px-5 py-8 text-center text-[15px] text-muted">
                  Keine aussortierten Gegenstände gefunden.
                </p>
              ) : (
                <ul className="card divide-y divide-line overflow-hidden bg-surface-soft">
                  {visibleRetired.map((item) => (
                    <li key={item.id}>
                      <ItemListRow
                        item={item}
                        locations={data}
                        currencyLabel={data.settings.currencyLabel}
                        retired
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
