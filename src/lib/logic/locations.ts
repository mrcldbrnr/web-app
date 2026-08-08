import type {
  Item,
  PrimaryLocation,
  SecondaryLocation,
} from "@/lib/types";

export interface LocationSource {
  primaryLocations: PrimaryLocation[];
  secondaryLocations: SecondaryLocation[];
}

export function primaryName(
  source: LocationSource,
  id?: string,
): string | undefined {
  if (!id) return undefined;
  return source.primaryLocations.find((location) => location.id === id)?.name;
}

export function secondaryName(
  source: LocationSource,
  id?: string,
): string | undefined {
  if (!id) return undefined;
  return source.secondaryLocations.find((location) => location.id === id)?.name;
}

/** Unterstandorte eines Hauptstandorts, alphabetisch. */
export function secondariesOf(
  source: LocationSource,
  primaryId?: string,
): SecondaryLocation[] {
  if (!primaryId) return [];
  return source.secondaryLocations
    .filter((location) => location.primaryId === primaryId)
    .sort((a, b) => a.name.localeCompare(b.name, "de-CH"));
}

/** In Listen wird nur die oberste Ebene angezeigt (PRD 3.2). */
export function itemPrimaryLocation(
  source: LocationSource,
  item: Item,
): string | undefined {
  return primaryName(source, item.locationPrimaryId);
}

/** Vollständiger Standort, z. B. «Küche › Vorratsschrank». */
export function itemFullLocation(
  source: LocationSource,
  item: Item,
): string | undefined {
  const primary = primaryName(source, item.locationPrimaryId);
  if (!primary) return undefined;
  const secondary = secondaryName(source, item.locationSecondaryId);
  return secondary ? `${primary} › ${secondary}` : primary;
}

export function countItemsInPrimary(items: Item[], primaryId: string): number {
  return items.filter((item) => item.locationPrimaryId === primaryId).length;
}

export function countItemsInSecondary(
  items: Item[],
  secondaryId: string,
): number {
  return items.filter((item) => item.locationSecondaryId === secondaryId).length;
}
