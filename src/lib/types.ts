/**
 * Zentrale Typdefinitionen des Datenmodells (siehe PRD Kapitel 4).
 */

export type CategoryId =
  | "electronics"
  | "clothing"
  | "sports"
  | "household"
  | "furniture"
  | "other";

export type ConditionId =
  | "new"
  | "very_good"
  | "good"
  | "heavily_used"
  | "defective";

export type StatusId =
  | "ready"
  | "maintenance_needed"
  | "in_repair"
  | "lent_out"
  | "unavailable"
  | "retired";

/** Metadaten eines hinterlegten Dokuments (der Dateiinhalt wird nicht gespeichert). */
export interface DocumentMeta {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  addedAt: string;
}

export interface Item {
  id: string;
  name: string;
  brand?: string;
  /** Bild als Data-URL (im Prototyp lokal gespeichert). */
  image?: string;
  category?: CategoryId;
  locationPrimaryId?: string;
  locationSecondaryId?: string;
  /** ISO-Datum (YYYY-MM-DD) */
  purchaseDate?: string;
  purchasePrice?: number;
  condition?: ConditionId;
  status?: StatusId;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /** Kategoriespezifische Felder, Schlüssel siehe CATEGORY_FIELDS. */
  categoryData: Record<string, string>;
  /** Statusabhängige Felder, Schlüssel siehe STATUS_FIELDS. */
  statusData: Record<string, string>;
  documents: DocumentMeta[];
  /** Beidseitige Verknüpfungen: der Partner führt diese Item-Id ebenfalls. */
  linkedItemIds: string[];
}

export interface PrimaryLocation {
  id: string;
  name: string;
}

export interface SecondaryLocation {
  id: string;
  name: string;
  primaryId: string;
}

export interface PackingList {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackingListEntry {
  packingListId: string;
  itemId: string;
  packed: boolean;
}

export interface AppSettings {
  /** Reines Anzeige-Label, keine Umrechnungslogik. */
  currencyLabel: string;
  /** Status, die im Dashboard-Bereich «Aufmerksamkeit erforderlich» als Auslöser gelten. */
  dashboardAttentionStatusFilter: StatusId[];
}

/** Vollständiger Datenbestand der Anwendung. */
export interface InventoryData {
  items: Item[];
  primaryLocations: PrimaryLocation[];
  secondaryLocations: SecondaryLocation[];
  packingLists: PackingList[];
  packingEntries: PackingListEntry[];
  settings: AppSettings;
}

export type FieldType = "text" | "textarea" | "date" | "select";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
}
