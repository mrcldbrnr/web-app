import { ATTENTION_STATUSES, statusLabel } from "@/lib/constants";
import { formatDate, isInPast } from "@/lib/format";
import type { Item, StatusId } from "@/lib/types";

/** Akzentfarbe der Kachel, passend zum hervorgehobenen Zustand/Status. */
export type AttentionTone = "info" | "notice" | "alert" | "neutral";

export interface AttentionEntry {
  item: Item;
  /** Der hervorgehobene Zustand oder Status. */
  label: string;
  /** Optionale kurze Zusatzinformation. */
  note?: string;
  /** Farbton der Kachel, abgeleitet aus dem hervorgehobenen Zustand/Status. */
  tone: AttentionTone;
}

/** Spiegelt die Akzentfarben der Status-Badges (siehe Badge.tsx). */
function statusTone(status: StatusId): AttentionTone {
  switch (status) {
    case "maintenance_needed":
    case "in_repair":
      return "notice";
    case "lent_out":
      return "info";
    default:
      return "neutral";
  }
}

/** Gegenstände mit Status «Aussortiert» lösen nie Aufmerksamkeit aus. */
export function isRetired(item: Item): boolean {
  return item.status === "retired";
}

/** Kategorie «Sport & Freizeit» mit überschrittenem Wartungsdatum. */
export function hasOverdueMaintenance(item: Item): boolean {
  return (
    item.category === "sports" && isInPast(item.categoryData.nextMaintenance)
  );
}

function statusNote(item: Item): string | undefined {
  const data = item.statusData;
  switch (item.status) {
    case "maintenance_needed":
      return data.dueDate
        ? `Fällig am ${formatDate(data.dueDate)}`
        : data.description;
    case "in_repair":
      return data.workshop ?? data.description;
    case "lent_out":
      return data.lentTo ? `An ${data.lentTo}` : undefined;
    default:
      return undefined;
  }
}

/**
 * Ermittelt die Gegenstände für den Dashboard-Bereich «Aufmerksamkeit
 * erforderlich» (PRD 3.1). Der Statusfilter deaktiviert nur den jeweiligen
 * Status als Auslöser – andere Auslöser bleiben wirksam.
 */
export function getAttentionEntries(
  items: Item[],
  activeStatusFilter: StatusId[],
): AttentionEntry[] {
  const entries: AttentionEntry[] = [];

  for (const item of items) {
    if (isRetired(item)) continue;

    const statusTriggers =
      item.status !== undefined &&
      ATTENTION_STATUSES.includes(item.status) &&
      activeStatusFilter.includes(item.status);
    const defective = item.condition === "defective";
    const overdue = hasOverdueMaintenance(item);

    if (!statusTriggers && !defective && !overdue) continue;

    let label: string;
    let note: string | undefined;
    let tone: AttentionTone;

    if (statusTriggers) {
      label = statusLabel(item.status) ?? "";
      note = statusNote(item);
      if (!note && defective) note = "Zustand: Defekt";
      if (!note && overdue) {
        note = `Wartung fällig seit ${formatDate(item.categoryData.nextMaintenance)}`;
      }
      tone = statusTone(item.status as StatusId);
    } else if (defective) {
      label = "Defekt";
      note = overdue
        ? `Wartung fällig seit ${formatDate(item.categoryData.nextMaintenance)}`
        : undefined;
      tone = "alert";
    } else {
      label = "Wartung überfällig";
      note = `Fällig war ${formatDate(item.categoryData.nextMaintenance)}`;
      tone = "alert";
    }

    entries.push({ item, label, note, tone });
  }

  return entries;
}
