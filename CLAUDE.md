@AGENTS.md

# Projektkontext für Claude Code

## Design-System

- Farb-Tokens in `src/app/globals.css` (`@theme`): `--color-ink #0a0a0a`,
  `--color-line #cbcbcb`, `--color-surface #fafafa` (Seitenhintergrund,
  2% Schwarz), `--color-brand #0000ff` (aus dem Logo, `public/logo-myown.svg`).
- Inhaltselemente (Cards, Buttons, Suchfelder, Modals, Listen) sind
  explizit `bg-white`, nicht `bg-surface` – nur der Seitenhintergrund selbst
  ist grau.
- Hover-Muster für Zeilen/sekundäre Buttons: `hover:bg-brand/5`. Für
  dauerhafte (nicht nur Hover-) helle Flächen im selben Blauton den
  deckenden Hex-Wert verwenden: `bg-[#f2f2ff]` (= `brand/5` auf Weiss) –
  Transparenz führt bei Flächen, über die Inhalt scrollt (z. B. fixe
  Navigation), sonst zu sichtbarem Durchscheinen.
- `.card` = `rounded-3xl border border-line bg-white`. Primär-Button
  schwarz (`bg-ink`, Hover `bg-brand`), Sekundär-Button weiss mit Rand
  (Hover `bg-brand/5`), Danger-Button rot (`border-alert`, Hover
  `bg-alert-soft`) – nicht auf Blau umstellen, das ist bewusst rot belassen.

## Workflow

- Nach jeder Änderung: `npx eslint <geänderte Dateien>` → `npm run build`
  → im Browser-Preview visuell bzw. per DOM-Messung verifizieren, bevor
  eine Aufgabe als erledigt gilt.
- Der Nutzer committet und pusht selbst zwischen den Turns – nur
  committen, wenn explizit verlangt.
- Kein Backend: keine API-Routen, keine Server Actions, keine Middleware,
  kein Login, keine Datenbank. Persistenz ausschliesslich über
  `localStorage` (`InventoryStore`-Interface, siehe README → Architektur).
- Demo-Daten in `src/lib/data/seed.ts`. Reset über die Einstellungsseite
  oder `localStorage.removeItem('inventar.v1')` im Browser.

## Bekannte Stolpersteine

- `overflow-hidden`/`overflow-x-hidden` auf einem Vorfahren schneidet
  `position: absolute`-Nachkommen ab, `position: fixed` dagegen nicht.
  Bei Vollbreiten-Effekten (`w-screen`-Breakout, z. B. Dashboard-Verlauf
  in `src/app/page.tsx`) oder Dropdowns/Popovers in überlaufenden
  Containern (z. B. die abgerundete Inventarliste) entsprechend `fixed`
  statt `absolute` verwenden oder das `overflow-hidden` global auf `body`
  statt lokal setzen.
- `margin-top` auf einem ersten Kind kollabiert durch padding-/border-lose
  Elternelemente nach aussen und verschiebt so ungewollt deren gesamte
  Box. Für gezielte Innenabstände `padding-top` statt `margin-top`
  verwenden.
- `Popover` (`src/components/ui/Popover.tsx`) positioniert sich per Ref
  und `position: fixed` relativ zu seinem direkten Elternelement – dieses
  muss der unmittelbare `relative`-Wrapper um den Auslöser-Button sein.
