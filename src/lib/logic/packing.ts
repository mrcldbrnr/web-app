import { CATEGORIES } from "@/lib/constants";
import { parseIsoDate, today } from "@/lib/format";
import type {
  Item,
  PackingList,
  PackingListEntry,
} from "@/lib/types";

export type PackingListGroup = "upcoming" | "undated" | "past";

export const PACKING_GROUP_LABELS: Record<PackingListGroup, string> = {
  upcoming: "Bevorstehend",
  undated: "Ohne Datum",
  past: "Vergangen",
};

/**
 * Einordnung einer Packliste (PRD 3.5). Eine laufende Reise gilt als
 * «Bevorstehend».
 */
export function classifyPackingList(list: PackingList): PackingListGroup {
  if (!list.startDate) return "undated";
  const now = today().getTime();
  const start = parseIsoDate(list.startDate)?.getTime();
  if (start === undefined) return "undated";

  const end = list.endDate ? parseIsoDate(list.endDate)?.getTime() : undefined;

  if (end !== undefined) {
    return end >= now ? "upcoming" : "past";
  }
  return start >= now ? "upcoming" : "past";
}

export interface PackingProgress {
  packed: number;
  total: number;
}

export function getProgress(entries: PackingListEntry[]): PackingProgress {
  return {
    packed: entries.filter((entry) => entry.packed).length,
    total: entries.length,
  };
}

export interface PackingGroup {
  label: string;
  entries: { entry: PackingListEntry; item: Item }[];
}

/** Packlisteneinträge nach Inventarkategorie gruppieren. */
export function groupEntriesByCategory(
  entries: PackingListEntry[],
  items: Item[],
): PackingGroup[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const resolved = entries
    .map((entry) => ({ entry, item: byId.get(entry.itemId) }))
    .filter(
      (row): row is { entry: PackingListEntry; item: Item } =>
        row.item !== undefined,
    );

  const groups: PackingGroup[] = [];

  for (const category of CATEGORIES) {
    const rows = resolved.filter((row) => row.item.category === category.id);
    if (rows.length) {
      groups.push({
        label: category.label,
        entries: sortByName(rows),
      });
    }
  }

  const withoutCategory = resolved.filter((row) => !row.item.category);
  if (withoutCategory.length) {
    groups.push({
      label: "Ohne Kategorie",
      entries: sortByName(withoutCategory),
    });
  }

  return groups;
}

function sortByName(rows: { entry: PackingListEntry; item: Item }[]) {
  return [...rows].sort((a, b) =>
    a.item.name.localeCompare(b.item.name, "de-CH"),
  );
}

/** Sortierung der Packlisten innerhalb einer Gruppe. */
export function sortPackingLists(
  lists: PackingList[],
  group: PackingListGroup,
): PackingList[] {
  const sorted = [...lists];
  sorted.sort((a, b) => {
    if (group === "undated") {
      return b.createdAt.localeCompare(a.createdAt);
    }
    const aDate = a.startDate ?? "";
    const bDate = b.startDate ?? "";
    return group === "upcoming"
      ? aDate.localeCompare(bDate)
      : bDate.localeCompare(aDate);
  });
  return sorted;
}
