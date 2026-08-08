import {
  categoryLabel,
  conditionLabel,
  statusLabel,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { categoryFields, statusFields } from "@/lib/logic/itemFields";
import type {
  Item,
  PrimaryLocation,
  SecondaryLocation,
} from "@/lib/types";

export interface SearchContext {
  primaryLocations: PrimaryLocation[];
  secondaryLocations: SecondaryLocation[];
}

/** Kleinschreibung inkl. Auflösung von Umlauten, damit «Grosse» und «Grösse» treffen. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Durchsuchbare Felder eines Gegenstands, gruppiert nach Relevanz:
 * Name → Marke → Modell → Kategorie → weitere Felder (PRD 3.1).
 * Inhalte von Bildern oder Dokumentdateien werden nicht durchsucht,
 * lediglich die Dateinamen.
 */
export function searchableFields(item: Item, ctx: SearchContext): string[][] {
  const primary = ctx.primaryLocations.find(
    (location) => location.id === item.locationPrimaryId,
  );
  const secondary = ctx.secondaryLocations.find(
    (location) => location.id === item.locationSecondaryId,
  );

  const remainingCategoryValues = categoryFields(item.category)
    .filter((field) => field.key !== "model")
    .map((field) => item.categoryData[field.key]);
  const statusValues = statusFields(item.status).map(
    (field) => item.statusData[field.key],
  );
  const dateValues = [item.purchaseDate, formatDate(item.purchaseDate)];

  const rest = [
    ...remainingCategoryValues,
    ...statusValues,
    ...dateValues,
    item.purchasePrice !== undefined ? String(item.purchasePrice) : undefined,
    conditionLabel(item.condition),
    statusLabel(item.status),
    primary?.name,
    secondary?.name,
    item.notes,
    ...item.documents.map((document) => document.name),
  ];

  return [
    [item.name],
    [item.brand],
    [item.categoryData.model],
    [categoryLabel(item.category)],
    rest,
  ].map((group) =>
    group.filter((value): value is string => Boolean(value)).map(normalize),
  );
}

export interface SearchHit {
  item: Item;
  /** 0 = Treffer im Namen, 4 = Treffer in einem weiteren Feld. */
  rank: number;
}

/**
 * Volltextsuche über alle durchsuchbaren Felder, sortiert nach Relevanz.
 * Aussortierte Gegenstände müssen ggf. vorher herausgefiltert werden.
 */
export function searchItems(
  items: Item[],
  query: string,
  ctx: SearchContext,
): SearchHit[] {
  const needle = normalize(query.trim());
  if (!needle) return [];

  const hits: (SearchHit & { startsWith: boolean })[] = [];

  for (const item of items) {
    const groups = searchableFields(item, ctx);
    let rank = -1;
    let startsWith = false;

    for (let index = 0; index < groups.length; index += 1) {
      const match = groups[index].find((value) => value.includes(needle));
      if (match) {
        rank = index;
        startsWith = match.startsWith(needle);
        break;
      }
    }

    if (rank >= 0) hits.push({ item, rank, startsWith });
  }

  hits.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.startsWith !== b.startsWith) return a.startsWith ? -1 : 1;
    return a.item.name.localeCompare(b.item.name, "de-CH");
  });

  return hits.map(({ item, rank }) => ({ item, rank }));
}
