import { CATEGORY_FIELDS, STATUS_FIELDS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { CategoryId, FieldDef, Item, StatusId } from "@/lib/types";

/** Datumswerte für die Anzeige aufbereiten, alle übrigen unverändert lassen. */
function displayValue(field: FieldDef, value: string): string {
  return field.type === "date" ? (formatDate(value) ?? value) : value;
}

/** Feldsatz der Kategorie (leer, wenn keine Kategorie gewählt). */
export function categoryFields(category?: CategoryId): FieldDef[] {
  return category ? CATEGORY_FIELDS[category] : [];
}

/** Feldsatz des Status (leer, wenn kein Status gewählt). */
export function statusFields(status?: StatusId): FieldDef[] {
  return status ? STATUS_FIELDS[status] : [];
}

function keepOnlyKeys(
  data: Record<string, string>,
  keys: string[],
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const key of keys) {
    const value = data[key];
    if (value !== undefined && value !== "") next[key] = value;
  }
  return next;
}

/**
 * Entfernt kategoriespezifische Werte, die zur neuen Kategorie nicht mehr gehören.
 */
export function pruneCategoryData(
  data: Record<string, string>,
  category?: CategoryId,
): Record<string, string> {
  return keepOnlyKeys(
    data,
    categoryFields(category).map((f) => f.key),
  );
}

/**
 * Entfernt statusabhängige Werte, die für den neuen Status nicht mehr relevant sind.
 */
export function pruneStatusData(
  data: Record<string, string>,
  status?: StatusId,
): Record<string, string> {
  return keepOnlyKeys(
    data,
    statusFields(status).map((f) => f.key),
  );
}

/**
 * Werte, die beim Wechsel der Kategorie verloren gehen – Grundlage für die
 * Bestätigung im Formular (PRD 3.3).
 */
export function categoryDataLossPreview(
  data: Record<string, string>,
  from: CategoryId | undefined,
  to: CategoryId | undefined,
): { label: string; value: string }[] {
  const keptKeys = new Set(categoryFields(to).map((f) => f.key));
  return categoryFields(from)
    .filter((field) => !keptKeys.has(field.key))
    .filter((field) => Boolean(data[field.key]))
    .map((field) => ({
      label: field.label,
      value: displayValue(field, data[field.key]),
    }));
}

/** Analog zu categoryDataLossPreview, aber für statusabhängige Felder. */
export function statusDataLossPreview(
  data: Record<string, string>,
  from: StatusId | undefined,
  to: StatusId | undefined,
): { label: string; value: string }[] {
  const keptKeys = new Set(statusFields(to).map((f) => f.key));
  return statusFields(from)
    .filter((field) => !keptKeys.has(field.key))
    .filter((field) => Boolean(data[field.key]))
    .map((field) => ({
      label: field.label,
      value: displayValue(field, data[field.key]),
    }));
}

/** Gefüllte kategoriespezifische Felder eines Gegenstands (für Detailansicht). */
export function filledCategoryFields(item: Item) {
  return categoryFields(item.category)
    .filter((field) => Boolean(item.categoryData[field.key]))
    .map((field) => ({ field, value: item.categoryData[field.key] }));
}

/** Gefüllte statusabhängige Felder eines Gegenstands (für Detailansicht). */
export function filledStatusFields(item: Item) {
  return statusFields(item.status)
    .filter((field) => Boolean(item.statusData[field.key]))
    .map((field) => ({ field, value: item.statusData[field.key] }));
}

/**
 * Vorbelegung für ein Duplikat: übernimmt alle Werte des Originals als
 * Vorlage, ausser Identität, Dokumente, Verknüpfungen und Seriennummer –
 * diese sind an den physischen Gegenstand gebunden und nicht übertragbar.
 */
export function duplicateItemValues(
  item: Item,
): Omit<Item, "id" | "createdAt" | "updatedAt" | "documents" | "linkedItemIds"> {
  const categoryData = { ...item.categoryData };
  delete categoryData.serialNumber;

  return {
    name: item.name,
    brand: item.brand,
    image: item.image,
    category: item.category,
    locationPrimaryId: item.locationPrimaryId,
    locationSecondaryId: item.locationSecondaryId,
    purchaseDate: item.purchaseDate,
    purchasePrice: item.purchasePrice,
    condition: item.condition,
    status: item.status,
    notes: item.notes,
    categoryData,
    statusData: { ...item.statusData },
  };
}
