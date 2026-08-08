"use client";

import { useMemo, useState } from "react";
import { ItemImage } from "@/components/items/ItemImage";
import { Button } from "@/components/ui/Button";
import { SelectInput } from "@/components/ui/Field";
import { CheckIcon, SearchIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { CATEGORIES, categoryLabel } from "@/lib/constants";
import { useInventory } from "@/lib/data/InventoryProvider";
import { itemPrimaryLocation } from "@/lib/logic/locations";
import { searchItems } from "@/lib/logic/search";
import type { CategoryId, Item } from "@/lib/types";

/**
 * Auswahl von Gegenständen aus dem bestehenden Inventar – mit Suche,
 * Kategorie- und Standortfilter sowie Mehrfachauswahl (PRD 3.5).
 */
export function ItemPickerModal({
  open,
  title,
  description,
  candidates,
  initialSelection = [],
  confirmLabel = "Übernehmen",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  candidates: Item[];
  initialSelection?: string[];
  confirmLabel?: string;
  onConfirm: (ids: string[]) => void;
  onClose: () => void;
}) {
  const { data } = useInventory();
  const [selected, setSelected] = useState<string[]>(initialSelection);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "">("");
  const [primaryId, setPrimaryId] = useState("");

  const visible = useMemo(() => {
    let result = candidates;
    if (category) result = result.filter((item) => item.category === category);
    if (primaryId) {
      result = result.filter((item) => item.locationPrimaryId === primaryId);
    }
    if (query.trim()) {
      return searchItems(result, query, data).map((hit) => hit.item);
    }
    return [...result].sort((a, b) => a.name.localeCompare(b.name, "de-CH"));
  }, [candidates, category, primaryId, query, data]);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={() => onConfirm(selected)}>
            {confirmLabel}
            {selected.length > 0 && ` (${selected.length})`}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Gegenstand suchen …"
            aria-label="Gegenstand suchen"
            className="h-12 w-full rounded-full border border-line bg-white pr-4 pl-12 text-[15px] focus:border-ink focus:outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SelectInput
            aria-label="Kategorie"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as CategoryId | "")
            }
          >
            <option value="">Alle Kategorien</option>
            {CATEGORIES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </SelectInput>

          <SelectInput
            aria-label="Standort"
            value={primaryId}
            onChange={(event) => setPrimaryId(event.target.value)}
          >
            <option value="">Alle Standorte</option>
            {data.primaryLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </SelectInput>
        </div>

        {visible.length === 0 ? (
          <p className="py-8 text-center text-[15px] text-muted">
            Keine passenden Gegenstände gefunden.
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-2xl border border-line">
            {visible.map((item) => {
              const isSelected = selected.includes(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-pressed={isSelected}
                    className="row-link flex items-center gap-3 px-4 py-3"
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                        isSelected
                          ? "border-ink bg-ink text-white"
                          : "border-line-strong",
                      )}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </span>
                    <ItemImage
                      item={item}
                      className="h-11 w-11 shrink-0"
                      textClassName="text-sm"
                    />
                    <span className="min-w-0 flex-1">
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
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
