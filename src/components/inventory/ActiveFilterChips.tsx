"use client";

import { CloseIcon } from "@/components/ui/Icons";
import {
  categoryLabel,
  conditionLabel,
  statusLabel,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { InventoryFilters } from "@/lib/logic/filter";
import { primaryName, secondaryName } from "@/lib/logic/locations";
import type { InventoryData } from "@/lib/types";

interface ActiveFilter {
  key: string;
  label: string;
  next: InventoryFilters;
}

/** Aktive Filter sichtbar machen und einzeln entfernbar halten (PRD 3.2). */
function collect(
  data: InventoryData,
  filters: InventoryFilters,
  currencyLabel: string,
): ActiveFilter[] {
  const chips: ActiveFilter[] = [];

  for (const category of filters.categories) {
    chips.push({
      key: `category-${category}`,
      label: categoryLabel(category) ?? category,
      next: {
        ...filters,
        categories: filters.categories.filter((id) => id !== category),
      },
    });
  }

  for (const id of filters.primaryLocationIds) {
    const remaining = filters.primaryLocationIds.filter(
      (current) => current !== id,
    );
    const allowed = new Set(
      data.secondaryLocations
        .filter((location) => remaining.includes(location.primaryId))
        .map((location) => location.id),
    );
    chips.push({
      key: `primary-${id}`,
      label: primaryName(data, id) ?? "Standort",
      next: {
        ...filters,
        primaryLocationIds: remaining,
        secondaryLocationIds: filters.secondaryLocationIds.filter((current) =>
          allowed.has(current),
        ),
      },
    });
  }

  for (const id of filters.secondaryLocationIds) {
    chips.push({
      key: `secondary-${id}`,
      label: secondaryName(data, id) ?? "Unterstandort",
      next: {
        ...filters,
        secondaryLocationIds: filters.secondaryLocationIds.filter(
          (current) => current !== id,
        ),
      },
    });
  }

  for (const condition of filters.conditions) {
    chips.push({
      key: `condition-${condition}`,
      label: conditionLabel(condition) ?? condition,
      next: {
        ...filters,
        conditions: filters.conditions.filter((id) => id !== condition),
      },
    });
  }

  for (const status of filters.statuses) {
    chips.push({
      key: `status-${status}`,
      label: statusLabel(status) ?? status,
      next: {
        ...filters,
        statuses: filters.statuses.filter((id) => id !== status),
      },
    });
  }

  for (const brand of filters.brands) {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      next: {
        ...filters,
        brands: filters.brands.filter((current) => current !== brand),
      },
    });
  }

  if (filters.priceFrom !== undefined) {
    chips.push({
      key: "price-from",
      label: `ab ${currencyLabel} ${filters.priceFrom}`,
      next: { ...filters, priceFrom: undefined },
    });
  }
  if (filters.priceTo !== undefined) {
    chips.push({
      key: "price-to",
      label: `bis ${currencyLabel} ${filters.priceTo}`,
      next: { ...filters, priceTo: undefined },
    });
  }
  if (filters.purchaseDateFrom) {
    chips.push({
      key: "date-from",
      label: `Kauf ab ${formatDate(filters.purchaseDateFrom)}`,
      next: { ...filters, purchaseDateFrom: undefined },
    });
  }
  if (filters.purchaseDateTo) {
    chips.push({
      key: "date-to",
      label: `Kauf bis ${formatDate(filters.purchaseDateTo)}`,
      next: { ...filters, purchaseDateTo: undefined },
    });
  }
  if (filters.hasWarranty) {
    chips.push({
      key: "warranty",
      label: "Garantie vorhanden",
      next: { ...filters, hasWarranty: false },
    });
  }
  if (filters.hasDocument) {
    chips.push({
      key: "document",
      label: "Dokument vorhanden",
      next: { ...filters, hasDocument: false },
    });
  }

  return chips;
}

export function ActiveFilterChips({
  data,
  filters,
  currencyLabel,
  onChange,
  onReset,
}: {
  data: InventoryData;
  filters: InventoryFilters;
  currencyLabel: string;
  onChange: (filters: InventoryFilters) => void;
  onReset: () => void;
}) {
  const chips = collect(data, filters, currencyLabel);
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(chip.next)}
          className="chip min-h-9 hover:border-ink"
        >
          {chip.label}
          <CloseIcon className="h-3.5 w-3.5" />
          <span className="sr-only">Filter entfernen</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="min-h-9 px-2 text-[13px] font-semibold text-ink underline underline-offset-4"
      >
        Alle entfernen
      </button>
    </div>
  );
}
