# Inventar – Persönliches Inventar

Eine responsive Web-App, mit der Privatpersonen ihre physischen Besitztümer
zentral erfassen, finden und verwalten können: Gegenstände mit Standort,
Kaufpreis, Zustand, Status, Dokumenten und Verknüpfungen, dazu Packlisten für
Reisen. Siehe die vollständige Anforderung im PRD (im Chatverlauf dieses
Projekts).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + React 19
- Tailwind CSS 4 für das Schwarz-Weiss-Designsystem (siehe `src/app/globals.css`)
- Schriftart **Figtree** (Google Fonts)
- Persistenz im Prototyp: `localStorage` im Browser (Single-User, kein Login)

## Architektur

```
src/
  app/                  Next.js-Routen (App Router)
  components/
    ui/                 Wiederverwendbare Primitive (Button, Modal, Field, Badge, …)
    items/               Gegenstands-bezogene Komponenten (Formular, Detail, Bild, …)
    inventory/           Filter- und Chip-Komponenten der Inventarliste
    dashboard/            Live-Suche, Aufmerksamkeit-Bereich, Kategorieübersicht
    packing/              Packlisten-Komponenten
    settings/             Standortverwaltung
    layout/               Navigation, Daten-Gate
  lib/
    types.ts              Zentrales Datenmodell
    constants.ts           Kategorien, Zustände, Status, Feldkataloge
    data/
      store.ts             Persistenz-Port (Interface)
      localStorageStore.ts  Implementierung für den Prototyp
      InventoryProvider.tsx React-Context, der die App mit Daten versorgt
      seed.ts               Realistische Demo-Daten
    logic/                 Reine Businesslogik (Suche, Filter, Sortierung,
                            Aufmerksamkeit-Regeln, Statistiken, Mutations, Packlisten)
```

Die Businesslogik (`src/lib/logic/*`) ist bewusst von der UI getrennt und
unabhängig testbar. Die Persistenz ist hinter dem `InventoryStore`-Interface
(`src/lib/data/store.ts`) gekapselt – für eine produktive Version genügt eine
neue Implementierung dieses Interfaces (z. B. gegen Supabase/PostgreSQL),
ohne dass UI-Komponenten angepasst werden müssen.

## Entwicklung

```bash
npm install
npm run dev
```

Die App läuft unter `http://localhost:3000` und startet automatisch mit
realistischen Demo-Daten (u. a. mehrere Standorte, verknüpfte Gegenstände,
aussortierte Gegenstände, ein überschrittenes Wartungsdatum und zwei
Packlisten). Die Demo-Daten lassen sich unter **Einstellungen** jederzeit
zurücksetzen.

```bash
npm run build   # Produktions-Build
npm run lint    # ESLint
```

## Deployment

Die App ist für [Vercel](https://vercel.com) vorbereitet (`next build`
ohne Zusatzkonfiguration). Für eine produktive, mehrgeräte-fähige Nutzung
sollte `localStorageStore` durch eine Supabase/PostgreSQL-Anbindung ersetzt
werden (Interface: `InventoryStore`).

## Bewusst nicht umgesetzt

KI-Bilderkennung, Barcode-/QR-Erfassung, natürlichsprachige Suche,
Zeitwertberechnung, Versicherungsanbindung, automatische Packvorschläge,
Verkaufsplattformen, Multi-User-Funktionen und Benutzeraccounts (siehe PRD,
Kapitel 8 „Out of Scope“).
