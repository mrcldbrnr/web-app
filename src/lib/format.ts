/** Formatierungs- und Datumshilfen. */

const numberFormatter = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 2,
});

/** Kaufpreis mit dem in den Einstellungen gewählten Label (keine Umrechnung). */
export function formatPrice(
  value: number | undefined,
  currencyLabel: string,
): string | undefined {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined;
  }
  return `${currencyLabel} ${numberFormatter.format(value)}`.trim();
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** ISO-Datum (YYYY-MM-DD) als de-CH Datum darstellen. */
export function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return date.toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateRange(start?: string, end?: string): string | undefined {
  if (!start) return undefined;
  if (!end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** Parst ein YYYY-MM-DD Datum als lokales Datum (ohne Zeitzonenversatz). */
export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Heutiges Datum auf Mitternacht normalisiert. */
export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toIsoDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** True, wenn das Datum vor dem heutigen Tag liegt. */
export function isInPast(iso?: string): boolean {
  if (!iso) return false;
  const date = parseIsoDate(iso);
  if (!date) return false;
  return date.getTime() < today().getTime();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
