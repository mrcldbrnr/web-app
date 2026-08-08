"use client";

import { useMemo } from "react";
import { CheckboxRow, Field, TextInput, ToggleChip } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, CONDITIONS, STATUSES } from "@/lib/constants";
import type { InventoryFilters } from "@/lib/logic/filter";
import { secondariesOf } from "@/lib/logic/locations";
import type {
  CategoryId,
  ConditionId,
  InventoryData,
  StatusId,
} from "@/lib/types";

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

function parsePrice(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Alle Filter sind frei kombinierbar (PRD 3.2). */
export function FilterPanel({
  data,
  filters,
  onChange,
  onReset,
}: {
  data: InventoryData;
  filters: InventoryFilters;
  onChange: (filters: InventoryFilters) => void;
  onReset: () => void;
}) {
  const brands = useMemo(() => {
    const unique = new Set(
      data.items
        .map((item) => item.brand)
        .filter((brand): brand is string => Boolean(brand)),
    );
    return [...unique].sort((a, b) => a.localeCompare(b, "de-CH"));
  }, [data.items]);

  const availableSecondaries = useMemo(() => {
    if (!filters.primaryLocationIds.length) return [];
    return filters.primaryLocationIds.flatMap((primaryId) =>
      secondariesOf(data, primaryId),
    );
  }, [data, filters.primaryLocationIds]);

  const patch = (values: Partial<InventoryFilters>) =>
    onChange({ ...filters, ...values });

  return (
    <div className="card space-y-6 p-5 sm:p-6">
      <FilterGroup label="Kategorie">
        {CATEGORIES.map((category) => (
          <ToggleChip
            key={category.id}
            active={filters.categories.includes(category.id)}
            onClick={() =>
              patch({
                categories: toggle<CategoryId>(filters.categories, category.id),
              })
            }
          >
            {category.label}
          </ToggleChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Hauptstandort">
        {data.primaryLocations.map((location) => (
          <ToggleChip
            key={location.id}
            active={filters.primaryLocationIds.includes(location.id)}
            onClick={() => {
              const primaryLocationIds = toggle(
                filters.primaryLocationIds,
                location.id,
              );
              // Unterstandorte ohne zugehörigen Hauptstandort werden entfernt.
              const allowed = new Set(
                primaryLocationIds.flatMap((id) =>
                  secondariesOf(data, id).map((sub) => sub.id),
                ),
              );
              patch({
                primaryLocationIds,
                secondaryLocationIds: filters.secondaryLocationIds.filter((id) =>
                  allowed.has(id),
                ),
              });
            }}
          >
            {location.name}
          </ToggleChip>
        ))}
      </FilterGroup>

      {availableSecondaries.length > 0 && (
        <FilterGroup label="Unterstandort">
          {availableSecondaries.map((location) => (
            <ToggleChip
              key={location.id}
              active={filters.secondaryLocationIds.includes(location.id)}
              onClick={() =>
                patch({
                  secondaryLocationIds: toggle(
                    filters.secondaryLocationIds,
                    location.id,
                  ),
                })
              }
            >
              {location.name}
            </ToggleChip>
          ))}
        </FilterGroup>
      )}

      <FilterGroup label="Zustand">
        {CONDITIONS.map((condition) => (
          <ToggleChip
            key={condition.id}
            active={filters.conditions.includes(condition.id)}
            onClick={() =>
              patch({
                conditions: toggle<ConditionId>(filters.conditions, condition.id),
              })
            }
          >
            {condition.label}
          </ToggleChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Status">
        {STATUSES.filter((status) => status.id !== "retired").map((status) => (
          <ToggleChip
            key={status.id}
            active={filters.statuses.includes(status.id)}
            onClick={() =>
              patch({ statuses: toggle<StatusId>(filters.statuses, status.id) })
            }
          >
            {status.label}
          </ToggleChip>
        ))}
      </FilterGroup>

      {brands.length > 0 && (
        <FilterGroup label="Marke / Hersteller">
          {brands.map((brand) => (
            <ToggleChip
              key={brand}
              active={filters.brands.includes(brand)}
              onClick={() => patch({ brands: toggle(filters.brands, brand) })}
            >
              {brand}
            </ToggleChip>
          ))}
        </FilterGroup>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kaufpreis von">
          {(id) => (
            <TextInput
              id={id}
              type="number"
              inputMode="decimal"
              min={0}
              value={filters.priceFrom ?? ""}
              onChange={(event) =>
                patch({ priceFrom: parsePrice(event.target.value) })
              }
            />
          )}
        </Field>
        <Field label="Kaufpreis bis">
          {(id) => (
            <TextInput
              id={id}
              type="number"
              inputMode="decimal"
              min={0}
              value={filters.priceTo ?? ""}
              onChange={(event) =>
                patch({ priceTo: parsePrice(event.target.value) })
              }
            />
          )}
        </Field>
        <Field label="Kaufdatum von">
          {(id) => (
            <TextInput
              id={id}
              type="date"
              value={filters.purchaseDateFrom ?? ""}
              onChange={(event) =>
                patch({ purchaseDateFrom: event.target.value || undefined })
              }
            />
          )}
        </Field>
        <Field label="Kaufdatum bis">
          {(id) => (
            <TextInput
              id={id}
              type="date"
              value={filters.purchaseDateTo ?? ""}
              onChange={(event) =>
                patch({ purchaseDateTo: event.target.value || undefined })
              }
            />
          )}
        </Field>
      </div>

      <div className="space-y-1">
        <CheckboxRow
          checked={filters.hasWarranty}
          onChange={(checked) => patch({ hasWarranty: checked })}
          label="Garantie vorhanden"
        />
        <CheckboxRow
          checked={filters.hasDocument}
          onChange={(checked) => patch({ hasDocument: checked })}
          label="Dokument vorhanden"
        />
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <Button variant="secondary" size="sm" onClick={onReset}>
          Alle Filter entfernen
        </Button>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="field-label">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
