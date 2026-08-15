# myown – Persönliches Inventar

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

## Security-Check

Letzte Prüfung: 2026-08-15, anhand der Checkliste „Security-Checkliste für
Vibe-coded Apps" (Stack: Claude Code, GitHub, Vercel). Legende: ✅ erfüllt ·
⚠️ Lücke, Handlung nötig · ➖ nicht anwendbar (Begründung) · 🔍 nur manuell im
Dashboard prüfbar, hier nicht verifiziert.

**Ausgangslage:** Diese App hat aktuell keinen eigenen Server – keine
API-Routen, keine Server Actions, keine Middleware, keine Datenbank, keine
Umgebungsvariablen, kein Login. Alle Daten liegen ausschliesslich im
`localStorage` des Browsers. Das entschärft einen grossen Teil der
Checkliste (Abschnitte 3–5), macht Abschnitt 6 (Deployment-Schutz) aber umso
wichtiger, weil sonst der volle Quellcode und alle Demo-/Testdaten öffentlich
liegen.

### Kritische Punkte

1. **Keine Secrets im Code/Repo** – ✅ Repo nach `key`/`secret`/`token`/
   `password`/`api` durchsucht (Code, Config, Git-Historie, Commit-Diffs):
   keine echten Schlüssel gefunden. ✅ Keine `.env`-Datei vorhanden oder je
   committed. ✅ `.env*` steht in `.gitignore`. ➖ Vercel Environment
   Variables: entfällt, die App nutzt aktuell keine.
2. **Keine Secrets im Client-Bundle** – ✅ `npm run build` + Grep über
   `.next/static/` nach `sk-`/`service_role`/`secret`/`api_key`: keine
   echten Treffer (ein Fund war ein False Positive, `mask-type` aus Reacts
   SVG-Attribut-Tabelle enthält zufällig die Zeichenfolge `sk-`). ➖ Keine
   `NEXT_PUBLIC_`/`VITE_`/`REACT_APP_`-Variablen im Projekt vorhanden.
3. **Login/Accounts** – ➖ Nicht anwendbar, die App hat keinen Login (PRD:
   Single-User-Prototyp ohne Benutzerkonten).
4. **Datenbank-Zugriffsregeln (RLS)** – ➖ Nicht anwendbar, es gibt keine
   Datenbank. `store.ts` verweist auf eine mögliche künftige
   Supabase-Anbindung, die ist aber nicht implementiert.
5. **API-Routen prüfen sich selbst** – ➖ Nicht anwendbar, es existieren
   keine Dateien unter `/api` und keine Server Actions (`grep` nach
   `"use server"` und `route.ts`: keine Treffer).
6. **Deployment-Schutz auf Vercel** – ✅ **Konfiguriert (2026-08-15).**
   Vercel Authentication ist aktiviert (Project Settings → Deployment
   Protection → „Require Log In" mit „Standard Protection"): Preview-
   Deployments und generierte `*.vercel.app`-URLs verlangen jetzt einen
   eingeloggten Vercel-Team-Account. Password Protection ist auf dem
   Hobby-Plan nicht verfügbar (nur mit Pro + Advanced-Deployment-Protection-
   Add-on für $150/Monat). ⚠️ **Bewusste Einschränkung, kein Fehler:**
   „Standard Protection" schützt die Produktions-Domain nicht – ein
   `curl` gegen `web-app-zeta-ruddy-63.vercel.app` liefert weiterhin
   `HTTP 200` ohne Auth-Abfrage. Das ist bei diesem Hobby-Plan-Setup so
   gewollt (die App soll ja öffentlich nutzbar sein); wer die
   Produktions-Domain ebenfalls sperren möchte, braucht „All Deployments"
   auf einem Pro-/Enterprise-Plan. ➖ Environment-Variablen pro Umgebung
   getrennt: entfällt aktuell (keine Variablen vorhanden), bei künftiger
   Backend-Anbindung unbedingt prüfen.

### Empfohlene Punkte

7. **Claude Code absichern** – ✅ `.claude/settings.json` und `.mcp.json`
   existieren nicht im Repo, keine Hooks konfiguriert. Es gibt nur
   `.claude/launch.json` (Dev-Server-Start für die Vorschau, unkritisch).
8. **Abhängigkeiten** – ✅ Alle 9 Pakete in `package.json` sind real und
   plausibel (Next.js, React, Tailwind, ESLint, TypeScript – keine
   Halluzinationen). ✅ `package-lock.json` ist committed. ✅
   `npm audit`: 0 Vulnerabilities. 🔍 Dependabot Alerts/Security Updates im
   GitHub-Repo aktiviert: nicht einsehbar ohne Repo-Admin-Zugriff, bitte in
   den [Repo-Einstellungen](https://github.com/mrcldbrnr/web-app/settings/security_analysis)
   prüfen.
9. **GitHub/Repo-Hygiene** – ⚠️ **Hinweis:** Das Repository ist öffentlich
   (`visibility: public`) – kein Fehler an sich (siehe Punkt 1, keine
   Secrets gefunden), aber der komplette Quellcode ist für alle einsehbar.
   ➖ Keine GitHub-Actions-Workflows vorhanden (`.github/` existiert nicht),
   die entsprechenden Prüfpunkte entfallen. 🔍 Force-Push-Schutz auf `main`:
   ohne Admin-Token nicht abfragbar, bitte in den
   [Branch-Protection-Einstellungen](https://github.com/mrcldbrnr/web-app/settings/branches)
   prüfen und aktivieren.
10. **Umgang mit fremden Eingaben** – ✅ Kein `dangerouslySetInnerHTML`, kein
    `eval`/`new Function` im Code. ✅ Datei-Uploads (Foto/Dokumente) sind auf
    Bildtypen limitiert bzw. werden client-seitig verkleinert, bevor sie als
    Data-URL im `localStorage` landen; Dokumente werden nur als Metadaten
    (Name/Typ/Grösse) gespeichert, nie als Dateiinhalt. ➖ Keine SQL-Zugriffe
    vorhanden (keine Datenbank).
11. **Kosten-/Missbrauchsschutz** – ➖ Kein Rate-Limiting nötig, es gibt
    keine schreibenden/mailenden/LLM-Endpunkte. 🔍 Vercel Spend Management &
    Usage Alerts: nur im Vercel-Dashboard einsehbar, bitte manuell
    aktivieren (Team-Settings → Billing).
12. **Security-Headers** – ✅ **Behoben (2026-08-15).** In `next.config.ts`
    per `headers()` gesetzt: `Content-Security-Policy` (`default-src 'self'`,
    `img-src` erlaubt `data:`/`blob:` für Fotos und Demo-Icons,
    `frame-ancestors 'none'`), `X-Frame-Options: DENY`,
    `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
    (Kamera/Mikrofon/Standort aus) und `Strict-Transport-Security`. Lokal per
    `curl -I` und im Browser verifiziert (Fortschrittsbalken mit Inline-Style
    und Data-URL-Bilder funktionieren weiterhin, keine CSP-Verletzungen in
    der Konsole). Bewusst ohne Proxy/Middleware und ohne Nonce umgesetzt
    (`'unsafe-inline'` für Script/Style), um keine zusätzliche
    Middleware-Angriffsfläche zu schaffen (vgl. Punkt 3, CVE-2025-29927) –
    ausreichend, weil die App weder `dangerouslySetInnerHTML` noch
    Drittanbieter-Skripte nutzt.
13. **Betrieb** – ➖ Keine Logs mit sensiblen Daten (kein Server). ⚠️
    **Hinweis:** Da alle Daten nur im `localStorage` liegen, existiert kein
    Backup – Browserdaten löschen/Gerätewechsel bedeutet Datenverlust ohne
    Wiederherstellungsmöglichkeit. Das ist für einen Prototyp bewusst so
    (siehe Reset-Funktion in den Einstellungen), sollte vor produktivem
    Einsatz aber gelöst werden.

### Wenn die Zeit knapp ist – Status der 3 wichtigsten Punkte

1. ✅ Deployment Protection auf Vercel aktivieren – erfüllt (Vercel
   Authentication / Standard Protection; Produktions-Domain bleibt bewusst
   öffentlich)
2. ✅ Kein Secret hinter einem `NEXT_PUBLIC_`-Prefix – erfüllt (keine
   Env-Variablen vorhanden)
3. ➖ Autorisierung je API-Route – entfällt, keine API-Routen vorhanden

## Bewusst nicht umgesetzt

KI-Bilderkennung, Barcode-/QR-Erfassung, natürlichsprachige Suche,
Zeitwertberechnung, Versicherungsanbindung, automatische Packvorschläge,
Verkaufsplattformen, Multi-User-Funktionen und Benutzeraccounts (siehe PRD,
Kapitel 8 „Out of Scope“).
