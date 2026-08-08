import { ATTENTION_STATUSES } from "@/lib/constants";
import type { InventoryStore } from "@/lib/data/store";
import type { InventoryData, Item } from "@/lib/types";

const STORAGE_KEY = "inventar.v1";

/** Stellt sicher, dass geladene Daten dem aktuellen Datenmodell entsprechen. */
function normalize(raw: unknown): InventoryData | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<InventoryData>;
  if (!Array.isArray(data.items)) return null;

  return {
    items: data.items.map(
      (item): Item => ({
        ...item,
        categoryData: item.categoryData ?? {},
        statusData: item.statusData ?? {},
        documents: item.documents ?? [],
        linkedItemIds: item.linkedItemIds ?? [],
      }),
    ),
    primaryLocations: data.primaryLocations ?? [],
    secondaryLocations: data.secondaryLocations ?? [],
    packingLists: data.packingLists ?? [],
    packingEntries: data.packingEntries ?? [],
    settings: {
      currencyLabel: data.settings?.currencyLabel ?? "CHF",
      dashboardAttentionStatusFilter:
        data.settings?.dashboardAttentionStatusFilter ?? [
          ...ATTENTION_STATUSES,
        ],
    },
  };
}

/**
 * Persistenz im Browser. Für den Single-User-Prototyp genügt das: die Daten
 * bleiben ohne Datenbankkonfiguration über Sitzungen hinweg erhalten.
 */
export const localStorageStore: InventoryStore = {
  async load() {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? normalize(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },

  async save(data) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // Bei vollem Speicher bleibt die Sitzung nutzbar, nur ohne Persistenz.
      console.warn("Inventar konnte nicht gespeichert werden.", error);
    }
  },

  async clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};
