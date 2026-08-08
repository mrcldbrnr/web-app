import { CATEGORIES } from "@/lib/constants";
import { isRetired } from "@/lib/logic/attention";
import type { CategoryId, Item } from "@/lib/types";

export interface CategoryStat {
  id: CategoryId | "uncategorized";
  label: string;
  count: number;
  totalPrice: number;
}

export interface InventoryStats {
  itemCount: number;
  totalPrice: number;
  categories: CategoryStat[];
}

/** Aktives Inventar: alles ausser aussortierten Gegenständen. */
export function activeItems(items: Item[]): Item[] {
  return items.filter((item) => !isRetired(item));
}

export function retiredItems(items: Item[]): Item[] {
  return items.filter(isRetired);
}

/**
 * Kennzahlen für das Dashboard. Aussortierte Gegenstände fliessen weder in
 * Anzahl noch in die Kaufpreissumme ein (PRD 3.1 / 9).
 */
export function getInventoryStats(items: Item[]): InventoryStats {
  const active = activeItems(items);

  const categories: CategoryStat[] = CATEGORIES.map((category) => {
    const inCategory = active.filter((item) => item.category === category.id);
    return {
      id: category.id,
      label: category.label,
      count: inCategory.length,
      totalPrice: sumPrices(inCategory),
    };
  }).filter((stat) => stat.count > 0);

  const uncategorized = active.filter((item) => !item.category);
  if (uncategorized.length) {
    categories.push({
      id: "uncategorized",
      label: "Ohne Kategorie",
      count: uncategorized.length,
      totalPrice: sumPrices(uncategorized),
    });
  }

  return {
    itemCount: active.length,
    totalPrice: sumPrices(active),
    categories,
  };
}

/** Berücksichtigt nur Gegenstände mit hinterlegtem Kaufpreis. */
export function sumPrices(items: Item[]): number {
  return items.reduce((total, item) => total + (item.purchasePrice ?? 0), 0);
}
