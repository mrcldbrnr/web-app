import { WARRANTY_FIELD_KEY } from "@/lib/constants";
import { parseIsoDate } from "@/lib/format";
import type { CategoryId, ConditionId, Item, StatusId } from "@/lib/types";

/** Alle Filter sind optional und beliebig kombinierbar (PRD 3.2). */
export interface InventoryFilters {
  categories: CategoryId[];
  primaryLocationIds: string[];
  secondaryLocationIds: string[];
  conditions: ConditionId[];
  statuses: StatusId[];
  priceFrom?: number;
  priceTo?: number;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
  brands: string[];
  hasWarranty: boolean;
  hasDocument: boolean;
}

export const EMPTY_FILTERS: InventoryFilters = {
  categories: [],
  primaryLocationIds: [],
  secondaryLocationIds: [],
  conditions: [],
  statuses: [],
  priceFrom: undefined,
  priceTo: undefined,
  purchaseDateFrom: undefined,
  purchaseDateTo: undefined,
  brands: [],
  hasWarranty: false,
  hasDocument: false,
};

export function countActiveFilters(filters: InventoryFilters): number {
  let count = 0;
  count += filters.categories.length;
  count += filters.primaryLocationIds.length;
  count += filters.secondaryLocationIds.length;
  count += filters.conditions.length;
  count += filters.statuses.length;
  if (filters.priceFrom !== undefined) count += 1;
  if (filters.priceTo !== undefined) count += 1;
  if (filters.purchaseDateFrom) count += 1;
  if (filters.purchaseDateTo) count += 1;
  count += filters.brands.length;
  if (filters.hasWarranty) count += 1;
  if (filters.hasDocument) count += 1;
  return count;
}

function matchesDateRange(item: Item, filters: InventoryFilters): boolean {
  if (!filters.purchaseDateFrom && !filters.purchaseDateTo) return true;
  if (!item.purchaseDate) return false;
  const date = parseIsoDate(item.purchaseDate);
  if (!date) return false;
  if (filters.purchaseDateFrom) {
    const from = parseIsoDate(filters.purchaseDateFrom);
    if (from && date.getTime() < from.getTime()) return false;
  }
  if (filters.purchaseDateTo) {
    const to = parseIsoDate(filters.purchaseDateTo);
    if (to && date.getTime() > to.getTime()) return false;
  }
  return true;
}

export function matchesFilters(item: Item, filters: InventoryFilters): boolean {
  if (
    filters.categories.length &&
    (!item.category || !filters.categories.includes(item.category))
  ) {
    return false;
  }
  if (
    filters.primaryLocationIds.length &&
    (!item.locationPrimaryId ||
      !filters.primaryLocationIds.includes(item.locationPrimaryId))
  ) {
    return false;
  }
  if (
    filters.secondaryLocationIds.length &&
    (!item.locationSecondaryId ||
      !filters.secondaryLocationIds.includes(item.locationSecondaryId))
  ) {
    return false;
  }
  if (
    filters.conditions.length &&
    (!item.condition || !filters.conditions.includes(item.condition))
  ) {
    return false;
  }
  if (
    filters.statuses.length &&
    (!item.status || !filters.statuses.includes(item.status))
  ) {
    return false;
  }
  if (filters.priceFrom !== undefined) {
    if (item.purchasePrice === undefined) return false;
    if (item.purchasePrice < filters.priceFrom) return false;
  }
  if (filters.priceTo !== undefined) {
    if (item.purchasePrice === undefined) return false;
    if (item.purchasePrice > filters.priceTo) return false;
  }
  if (!matchesDateRange(item, filters)) return false;
  if (filters.brands.length && (!item.brand || !filters.brands.includes(item.brand))) {
    return false;
  }
  if (filters.hasWarranty && !item.categoryData[WARRANTY_FIELD_KEY]) return false;
  if (filters.hasDocument && item.documents.length === 0) return false;
  return true;
}

export function applyFilters(
  items: Item[],
  filters: InventoryFilters,
): Item[] {
  return items.filter((item) => matchesFilters(item, filters));
}
