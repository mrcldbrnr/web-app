import { createId } from "@/lib/id";
import { pruneCategoryData, pruneStatusData } from "@/lib/logic/itemFields";
import type {
  AppSettings,
  InventoryData,
  Item,
  PackingList,
  PrimaryLocation,
  SecondaryLocation,
} from "@/lib/types";

/**
 * Reine Transformationen des Datenbestands. Sie enthalten die gesamte
 * Businesslogik für Schreibvorgänge und sind unabhängig von UI und
 * Persistenzschicht.
 */

const now = () => new Date().toISOString();

/** Eingabe aus dem Gegenstandsformular. */
export interface ItemInput
  extends Omit<Item, "id" | "createdAt" | "updatedAt"> {
  id?: string;
  /** Im Formular neu erfasste Standorte, die erst beim Speichern persistiert werden. */
  pendingPrimaryLocations?: PrimaryLocation[];
  pendingSecondaryLocations?: SecondaryLocation[];
}

/**
 * Spiegelt Verknüpfungen beidseitig: jede Verknüpfung ist auf beiden
 * Gegenständen sichtbar (PRD 4.5).
 */
function syncLinks(
  items: Item[],
  itemId: string,
  linkedItemIds: string[],
): Item[] {
  const timestamp = now();
  return items.map((item) => {
    if (item.id === itemId) return item;
    const shouldLink = linkedItemIds.includes(item.id);
    const isLinked = item.linkedItemIds.includes(itemId);
    if (shouldLink && !isLinked) {
      return {
        ...item,
        linkedItemIds: [...item.linkedItemIds, itemId],
        updatedAt: timestamp,
      };
    }
    if (!shouldLink && isLinked) {
      return {
        ...item,
        linkedItemIds: item.linkedItemIds.filter((id) => id !== itemId),
        updatedAt: timestamp,
      };
    }
    return item;
  });
}

/**
 * Übernimmt nur jene im Formular neu erfassten Standorte, die der gespeicherte
 * Gegenstand tatsächlich verwendet. Alles andere wird verworfen (PRD 3.3).
 */
function persistPendingLocations(
  data: InventoryData,
  input: ItemInput,
): InventoryData {
  const pendingPrimary = input.pendingPrimaryLocations ?? [];
  const pendingSecondary = input.pendingSecondaryLocations ?? [];
  if (!pendingPrimary.length && !pendingSecondary.length) return data;

  const usedSecondary = pendingSecondary.filter(
    (location) => location.id === input.locationSecondaryId,
  );
  const requiredPrimaryIds = new Set(
    [input.locationPrimaryId, ...usedSecondary.map((l) => l.primaryId)].filter(
      (id): id is string => Boolean(id),
    ),
  );
  const usedPrimary = pendingPrimary.filter((location) =>
    requiredPrimaryIds.has(location.id),
  );

  return {
    ...data,
    primaryLocations: [...data.primaryLocations, ...usedPrimary],
    secondaryLocations: [...data.secondaryLocations, ...usedSecondary],
  };
}

function normalizeItemInput(input: ItemInput): Omit<Item, "id" | "createdAt"> {
  return {
    name: input.name.trim(),
    brand: emptyToUndefined(input.brand),
    image: input.image,
    category: input.category,
    locationPrimaryId: input.locationPrimaryId,
    locationSecondaryId: input.locationPrimaryId
      ? input.locationSecondaryId
      : undefined,
    purchaseDate: emptyToUndefined(input.purchaseDate),
    purchasePrice: input.purchasePrice,
    condition: input.condition,
    status: input.status,
    notes: emptyToUndefined(input.notes),
    // Nicht mehr relevante Zusatzfelder werden konsequent verworfen (PRD 3.3).
    categoryData: pruneCategoryData(input.categoryData, input.category),
    statusData: pruneStatusData(input.statusData, input.status),
    documents: input.documents,
    linkedItemIds: input.linkedItemIds,
    updatedAt: now(),
  };
}

function emptyToUndefined(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function createItem(
  data: InventoryData,
  input: ItemInput,
): { data: InventoryData; item: Item } {
  const withLocations = persistPendingLocations(data, input);
  const timestamp = now();
  const item: Item = {
    ...normalizeItemInput(input),
    id: createId("item"),
    createdAt: timestamp,
  };

  const items = syncLinks(
    [...withLocations.items, item],
    item.id,
    item.linkedItemIds,
  );
  return { data: { ...withLocations, items }, item };
}

export function updateItem(
  data: InventoryData,
  id: string,
  input: ItemInput,
): { data: InventoryData; item: Item } {
  const withLocations = persistPendingLocations(data, input);
  const existing = withLocations.items.find((item) => item.id === id);
  if (!existing) throw new Error(`Gegenstand ${id} existiert nicht`);

  const item: Item = {
    ...existing,
    ...normalizeItemInput(input),
  };

  const items = syncLinks(
    withLocations.items.map((current) => (current.id === id ? item : current)),
    id,
    item.linkedItemIds,
  );
  return { data: { ...withLocations, items }, item };
}

/**
 * Löscht einen Gegenstand und bereinigt Packlisten-Einträge sowie
 * beidseitige Verknüpfungen (PRD 3.4).
 */
export function deleteItem(data: InventoryData, id: string): InventoryData {
  return {
    ...data,
    items: data.items
      .filter((item) => item.id !== id)
      .map((item) =>
        item.linkedItemIds.includes(id)
          ? {
              ...item,
              linkedItemIds: item.linkedItemIds.filter(
                (linkedId) => linkedId !== id,
              ),
              updatedAt: now(),
            }
          : item,
      ),
    packingEntries: data.packingEntries.filter((entry) => entry.itemId !== id),
  };
}

/** Setzt die Verknüpfungen eines Gegenstands (beidseitig gespiegelt). */
export function setItemLinks(
  data: InventoryData,
  id: string,
  linkedItemIds: string[],
): InventoryData {
  const items = syncLinks(
    data.items.map((item) =>
      item.id === id ? { ...item, linkedItemIds, updatedAt: now() } : item,
    ),
    id,
    linkedItemIds,
  );
  return { ...data, items };
}

/* --- Standorte ------------------------------------------------------------ */

export function renamePrimaryLocation(
  data: InventoryData,
  id: string,
  name: string,
): InventoryData {
  return {
    ...data,
    primaryLocations: data.primaryLocations.map((location) =>
      location.id === id ? { ...location, name: name.trim() } : location,
    ),
  };
}

export function renameSecondaryLocation(
  data: InventoryData,
  id: string,
  name: string,
): InventoryData {
  return {
    ...data,
    secondaryLocations: data.secondaryLocations.map((location) =>
      location.id === id ? { ...location, name: name.trim() } : location,
    ),
  };
}

/**
 * Löscht einen Hauptstandort samt Unterstandorten und entfernt beide
 * Standortebenen bei betroffenen Gegenständen (PRD 3.6).
 */
export function deletePrimaryLocation(
  data: InventoryData,
  id: string,
): InventoryData {
  const timestamp = now();
  return {
    ...data,
    primaryLocations: data.primaryLocations.filter(
      (location) => location.id !== id,
    ),
    secondaryLocations: data.secondaryLocations.filter(
      (location) => location.primaryId !== id,
    ),
    items: data.items.map((item) =>
      item.locationPrimaryId === id
        ? {
            ...item,
            locationPrimaryId: undefined,
            locationSecondaryId: undefined,
            updatedAt: timestamp,
          }
        : item,
    ),
  };
}

/** Löscht einen Unterstandort; der Hauptstandort bleibt am Gegenstand erhalten. */
export function deleteSecondaryLocation(
  data: InventoryData,
  id: string,
): InventoryData {
  const timestamp = now();
  return {
    ...data,
    secondaryLocations: data.secondaryLocations.filter(
      (location) => location.id !== id,
    ),
    items: data.items.map((item) =>
      item.locationSecondaryId === id
        ? { ...item, locationSecondaryId: undefined, updatedAt: timestamp }
        : item,
    ),
  };
}

export function addPrimaryLocation(
  data: InventoryData,
  name: string,
): { data: InventoryData; location: PrimaryLocation } {
  const location: PrimaryLocation = { id: createId("loc"), name: name.trim() };
  return {
    data: { ...data, primaryLocations: [...data.primaryLocations, location] },
    location,
  };
}

export function addSecondaryLocation(
  data: InventoryData,
  primaryId: string,
  name: string,
): { data: InventoryData; location: SecondaryLocation } {
  const location: SecondaryLocation = {
    id: createId("sub"),
    name: name.trim(),
    primaryId,
  };
  return {
    data: {
      ...data,
      secondaryLocations: [...data.secondaryLocations, location],
    },
    location,
  };
}

/* --- Packlisten ----------------------------------------------------------- */

export interface PackingListInput {
  name: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

function normalizePackingInput(input: PackingListInput) {
  const startDate = emptyToUndefined(input.startDate);
  return {
    name: input.name.trim(),
    startDate,
    // Ein Enddatum ist nur mit Startdatum zulässig (PRD 3.5).
    endDate: startDate ? emptyToUndefined(input.endDate) : undefined,
    notes: emptyToUndefined(input.notes),
  };
}

export function createPackingList(
  data: InventoryData,
  input: PackingListInput,
  itemIds: string[] = [],
): { data: InventoryData; list: PackingList } {
  const timestamp = now();
  const list: PackingList = {
    ...normalizePackingInput(input),
    id: createId("trip"),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const next = {
    ...data,
    packingLists: [...data.packingLists, list],
  };
  return { data: addItemsToPackingList(next, list.id, itemIds), list };
}

/**
 * Dupliziert eine Packliste als Vorlage: gleiche Angaben und Gegenstände,
 * aber neue Identität und zurückgesetzter Packfortschritt. Aussortierte
 * Gegenstände werden dabei nicht übernommen (PRD 3.5).
 */
export function duplicatePackingList(
  data: InventoryData,
  sourceId: string,
): { data: InventoryData; list: PackingList } {
  const source = data.packingLists.find((list) => list.id === sourceId);
  if (!source) throw new Error(`Packliste ${sourceId} existiert nicht`);

  const itemIds = data.packingEntries
    .filter((entry) => entry.packingListId === sourceId)
    .map((entry) => entry.itemId);

  return createPackingList(
    data,
    {
      name: `${source.name} (Kopie)`,
      startDate: source.startDate,
      endDate: source.endDate,
      notes: source.notes,
    },
    itemIds,
  );
}

export function updatePackingList(
  data: InventoryData,
  id: string,
  input: PackingListInput,
): InventoryData {
  return {
    ...data,
    packingLists: data.packingLists.map((list) =>
      list.id === id
        ? { ...list, ...normalizePackingInput(input), updatedAt: now() }
        : list,
    ),
  };
}

export function deletePackingList(
  data: InventoryData,
  id: string,
): InventoryData {
  return {
    ...data,
    packingLists: data.packingLists.filter((list) => list.id !== id),
    packingEntries: data.packingEntries.filter(
      (entry) => entry.packingListId !== id,
    ),
  };
}

/**
 * Fügt Gegenstände hinzu. Aussortierte Gegenstände können nicht neu
 * hinzugefügt werden (PRD 3.5).
 */
export function addItemsToPackingList(
  data: InventoryData,
  listId: string,
  itemIds: string[],
): InventoryData {
  const existing = new Set(
    data.packingEntries
      .filter((entry) => entry.packingListId === listId)
      .map((entry) => entry.itemId),
  );

  const additions = itemIds
    .filter((itemId) => !existing.has(itemId))
    .filter((itemId) => {
      const item = data.items.find((current) => current.id === itemId);
      return item !== undefined && item.status !== "retired";
    })
    .map((itemId) => ({ packingListId: listId, itemId, packed: false }));

  if (!additions.length) return data;
  return { ...data, packingEntries: [...data.packingEntries, ...additions] };
}

export function removeItemFromPackingList(
  data: InventoryData,
  listId: string,
  itemId: string,
): InventoryData {
  return {
    ...data,
    packingEntries: data.packingEntries.filter(
      (entry) => !(entry.packingListId === listId && entry.itemId === itemId),
    ),
  };
}

export function setEntryPacked(
  data: InventoryData,
  listId: string,
  itemId: string,
  packed: boolean,
): InventoryData {
  return {
    ...data,
    packingEntries: data.packingEntries.map((entry) =>
      entry.packingListId === listId && entry.itemId === itemId
        ? { ...entry, packed }
        : entry,
    ),
  };
}

/* --- Einstellungen -------------------------------------------------------- */

export function updateSettings(
  data: InventoryData,
  patch: Partial<AppSettings>,
): InventoryData {
  return { ...data, settings: { ...data.settings, ...patch } };
}
