/** Kleiner Helfer zum Zusammensetzen von Klassennamen. */
export function cn(
  ...values: (string | false | null | undefined)[]
): string {
  return values.filter(Boolean).join(" ");
}
