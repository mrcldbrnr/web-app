import type { InventoryData } from "@/lib/types";

/**
 * Persistenz-Port der Anwendung.
 *
 * Die UI kennt ausschliesslich dieses Interface. Für den Prototyp wird es vom
 * `localStorageStore` erfüllt; eine spätere Supabase-/PostgreSQL-Anbindung
 * implementiert dasselbe Interface (siehe `supabase/schema.sql`), ohne dass
 * Komponenten oder Businesslogik angepasst werden müssen.
 */
export interface InventoryStore {
  /** Liefert den gespeicherten Datenbestand oder null, wenn noch keiner existiert. */
  load(): Promise<InventoryData | null>;
  save(data: InventoryData): Promise<void>;
  clear(): Promise<void>;
}
