import type {
  CategoryId,
  ConditionId,
  FieldDef,
  StatusId,
} from "@/lib/types";

/** Die 6 Kategorien sind bewusst fix und nicht erweiterbar (PRD 4.2). */
export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "electronics", label: "Elektronik & Technik" },
  { id: "clothing", label: "Kleidung & Accessoires" },
  { id: "sports", label: "Sport & Freizeit" },
  { id: "household", label: "Haushalt & Küche" },
  { id: "furniture", label: "Möbel & Einrichtung" },
  { id: "other", label: "Sonstiges" },
];

export const CONDITIONS: { id: ConditionId; label: string }[] = [
  { id: "new", label: "Neu" },
  { id: "very_good", label: "Sehr gut" },
  { id: "good", label: "Gut" },
  { id: "heavily_used", label: "Stark gebraucht" },
  { id: "defective", label: "Defekt" },
];

export const STATUSES: { id: StatusId; label: string }[] = [
  { id: "ready", label: "Einsatzbereit" },
  { id: "maintenance_needed", label: "Wartung notwendig" },
  { id: "in_repair", label: "In Reparatur" },
  { id: "lent_out", label: "Ausgeliehen" },
  { id: "unavailable", label: "Nicht verfügbar" },
  { id: "retired", label: "Aussortiert" },
];

/** Status, die den Dashboard-Bereich «Aufmerksamkeit erforderlich» auslösen (PRD 3.1). */
export const ATTENTION_STATUSES: StatusId[] = [
  "maintenance_needed",
  "in_repair",
  "lent_out",
  "unavailable",
];

export const RETIRED_REASONS = [
  "Verkauft",
  "Verschenkt",
  "Verloren",
  "Gestohlen",
  "Zerstört",
  "Entsorgt",
] as const;

export const CLOTHING_USAGES = [
  "Basic",
  "Freizeit",
  "Sport",
  "Arbeit",
  "Formal",
  "Sonstiges",
] as const;

/** Optionale kategoriespezifische Zusatzfelder (PRD 4.2). */
export const CATEGORY_FIELDS: Record<CategoryId, FieldDef[]> = {
  electronics: [
    { key: "model", label: "Modell", type: "text" },
    { key: "serialNumber", label: "Seriennummer", type: "text" },
    { key: "warrantyUntil", label: "Garantie bis", type: "date" },
  ],
  clothing: [
    { key: "size", label: "Grösse", type: "text" },
    { key: "color", label: "Farbe", type: "text" },
    { key: "season", label: "Saison", type: "text" },
    {
      key: "usage",
      label: "Einsatzzweck",
      type: "select",
      options: CLOTHING_USAGES,
    },
  ],
  sports: [
    { key: "model", label: "Modell", type: "text" },
    { key: "lastMaintenance", label: "Letzte Wartung", type: "date" },
    { key: "nextMaintenance", label: "Nächste Wartung", type: "date" },
  ],
  household: [
    { key: "model", label: "Modell", type: "text" },
    { key: "material", label: "Material", type: "text" },
    { key: "warrantyUntil", label: "Garantie bis", type: "date" },
  ],
  furniture: [
    { key: "material", label: "Material", type: "text" },
    { key: "color", label: "Farbe", type: "text" },
    { key: "dimensions", label: "Masse", type: "text" },
  ],
  other: [],
};

/** Optionale statusabhängige Felder (PRD 4.4). */
export const STATUS_FIELDS: Record<StatusId, FieldDef[]> = {
  ready: [],
  maintenance_needed: [
    { key: "description", label: "Beschreibung", type: "text" },
    { key: "dueDate", label: "Fällig am", type: "date" },
  ],
  in_repair: [
    { key: "description", label: "Beschreibung", type: "text" },
    { key: "since", label: "Seit", type: "date" },
    { key: "workshop", label: "Werkstatt / Ort", type: "text" },
  ],
  lent_out: [
    { key: "lentTo", label: "Ausgeliehen an", type: "text" },
    { key: "since", label: "Seit", type: "date" },
    { key: "returnPlanned", label: "Rückgabe geplant am", type: "date" },
  ],
  unavailable: [],
  retired: [
    {
      key: "reason",
      label: "Grund",
      type: "select",
      options: RETIRED_REASONS,
    },
  ],
};

/** Felder, die als «Garantie vorhanden» gelten (Inventar-Filter). */
export const WARRANTY_FIELD_KEY = "warrantyUntil";

export function categoryLabel(id?: CategoryId): string | undefined {
  return CATEGORIES.find((c) => c.id === id)?.label;
}

export function conditionLabel(id?: ConditionId): string | undefined {
  return CONDITIONS.find((c) => c.id === id)?.label;
}

export function statusLabel(id?: StatusId): string | undefined {
  return STATUSES.find((s) => s.id === id)?.label;
}
