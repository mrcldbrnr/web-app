import type { Item } from "@/lib/types";

export type SortId =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "purchase_new"
  | "purchase_old"
  | "created_desc";

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "name_asc", label: "Name A–Z" },
  { id: "name_desc", label: "Name Z–A" },
  { id: "price_asc", label: "Kaufpreis aufsteigend" },
  { id: "price_desc", label: "Kaufpreis absteigend" },
  { id: "purchase_new", label: "Kaufdatum neueste" },
  { id: "purchase_old", label: "Kaufdatum älteste" },
  { id: "created_desc", label: "Zuletzt hinzugefügt" },
];

/** Gegenstände ohne Wert werden bei Wert-Sortierungen ans Ende gestellt. */
function compareOptional<T>(
  a: T | undefined,
  b: T | undefined,
  compare: (x: T, y: T) => number,
): number | null {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  return compare(a, b);
}

export function sortItems(items: Item[], sort: SortId): Item[] {
  const byName = (a: Item, b: Item) => a.name.localeCompare(b.name, "de-CH");
  const sorted = [...items];

  sorted.sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return byName(a, b);
      case "name_desc":
        return byName(b, a);
      case "price_asc":
        return (
          compareOptional(a.purchasePrice, b.purchasePrice, (x, y) => x - y) ??
          byName(a, b)
        );
      case "price_desc":
        return (
          compareOptional(a.purchasePrice, b.purchasePrice, (x, y) => y - x) ??
          byName(a, b)
        );
      case "purchase_new":
        return (
          compareOptional(a.purchaseDate, b.purchaseDate, (x, y) =>
            y.localeCompare(x),
          ) ?? byName(a, b)
        );
      case "purchase_old":
        return (
          compareOptional(a.purchaseDate, b.purchaseDate, (x, y) =>
            x.localeCompare(y),
          ) ?? byName(a, b)
        );
      case "created_desc":
        return b.createdAt.localeCompare(a.createdAt) || byName(a, b);
      default:
        return byName(a, b);
    }
  });

  return sorted;
}
