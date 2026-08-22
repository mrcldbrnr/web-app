# Security-Checkliste für Vibe-coded Apps

Stack: Claude Code, GitHub, Vercel (plus Supabase o.ä. als Datenbank)

Diese Checkliste geht davon aus, dass dir keine Plattform Auth, Zugriffsregeln oder Deployment-Schutz abnimmt. Alles, was hier nicht abgehakt ist, macht niemand für dich.

> **Ergebnis-Legende (Projekt „myown"):** ✅ geprüft und bestanden · ➖ n/a (Risiko besteht in dieser App architektonisch nicht) · 🔍 nicht geprüft, noch offen. Details siehe `README.md` → Abschnitt „Security-Check" im Projekt-Repo. Stand: 2026-08-20. Ausgangslage: reine Client-App ohne eigenen Server – kein Backend, keine API-Routen, keine Middleware, keine Datenbank, kein Login; alle Daten liegen nur im `localStorage` des Browsers, aktuell ausschliesslich Demo-Daten ohne realen Personenbezug.

---

## Kritische Punkte (müssen erfüllt sein)

### 1. Keine Secrets im Code oder Repo

- [x] Repo-Suche nach `key`, `secret`, `token`, `password`, `api` durchgeführt, keine echten Schlüssel gefunden — ✅ Code, Config und komplette Git-Historie durchsucht
- [x] Keine `.env`-Datei im Repo, auch nicht in der Commit-History (einmal gepusht = kompromittiert, Schlüssel rotieren) — ✅ verifiziert
- [x] `.env`, `.env.local` und `.env*.local` stehen in `.gitignore` — ✅ (`.env*`)
- [ ] API-Keys liegen in den Vercel Environment Variables, nicht im Code — ➖ n/a, die App nutzt aktuell keine API-Keys/Umgebungsvariablen
- [ ] GitHub: Secret Scanning und Push Protection sind aktiviert (verhindert das Problem, statt es hinterher zu finden) — 🔍 nicht geprüft, bitte in den Repo-Einstellungen unter „Code security" nachholen

**Wichtig:** Ein privates Repo ist kein Schutz. Datei löschen reicht nicht, die History muss bereinigt werden (`git filter-repo`) und der Schlüssel muss trotzdem rotiert werden.

### 2. Keine Secrets im Client-Bundle

Der häufigste Fehler bei diesem Stack: Der Key liegt korrekt in Vercel, hat aber ein Prefix, das ihn in den Browser kompiliert.

- [x] Keine Environment-Variable mit `NEXT_PUBLIC_`, `VITE_` oder `REACT_APP_` enthält ein echtes Geheimnis — ➖ n/a, es existieren keine solchen Variablen im Projekt
- [ ] Supabase: Im Client steckt nur der `anon key`. Der `service_role key` gehört ausschliesslich auf den Server, er hängt die Zugriffsregeln komplett aus. — ➖ n/a, kein Supabase/keine Datenbank im Einsatz
- [x] Test nach dem Build:
  ```bash
  npm run build
  grep -ri "sk-\|service_role\|secret" .next/static/ dist/ 2>/dev/null
  ```
  ✅ durchgeführt, keine echten Treffer (ein Fund war ein False Positive: `mask-type` aus Reacts SVG-Attribut-Tabelle enthält zufällig die Zeichenfolge `sk-`)
- [ ] Zusatzprüfung im Browser: publizierte Seite öffnen, Rechtsklick, «Seitenquelltext anzeigen», nach `key` suchen — 🔍 nicht separat als manueller Browser-Check durchgeführt (durch den Bundle-Grep aber inhaltlich abgedeckt)

### 3. Login und Accounts nur über etablierte Mechanismen

- [ ] Falls die App Logins hat: Sie nutzt eine fertige Auth-Lösung (Supabase Auth, Auth.js, Clerk), nie ein selbst zusammengepromptetes Login-System — ➖ n/a, die App hat aktuell keinerlei Login (bewusster Single-User-Prototyp)
- [ ] Passwörter werden nirgends im Klartext gespeichert oder geloggt — ➖ n/a, keine Passwörter vorhanden
- [ ] Session-Cookies sind `httpOnly`, `secure` und `sameSite` — ➖ n/a, keine Sessions/Cookies vorhanden
- [x] Kein Auth-Check ausschliesslich in der Middleware. Die Next.js-Lücke CVE-2025-29927 war genau der Fall: Login funktioniert, trotzdem ist alles offen. Framework auf aktueller Patch-Version halten. — ➖ n/a, es existiert keine Middleware und kein Auth-Check; zusätzlich ✅ Next.js 16.3.0 (weit über den betroffenen Patch-Ständen)

### 4. Datenbank-Zugriffsregeln aktiv

- [ ] Row Level Security ist auf jeder Tabelle aktiviert, die Nutzerdaten enthält — ➖ n/a, keine Datenbank vorhanden
- [ ] RLS ist nicht nur aktiviert, sondern hat auch Policies. Aktiviert ohne Policy heisst: niemand kommt rein, und der Fix per Service-Key ist genau der falsche Reflex. — ➖ n/a
- [ ] **Der Test:** Zwei Test-Accounts anlegen, mit Account B versuchen, an die Daten von Account A zu kommen (URLs und IDs durchprobieren) — ➖ n/a, keine Accounts/Datenbank vorhanden

### 5. Jede API-Route prüft selbst

Jede Datei in `/api` und jede Server Action ist ein öffentlicher Endpunkt. Dass das UI den Button ausblendet, schützt gar nichts.

- [ ] Jede Route prüft die Session serverseitig — ➖ n/a, keine API-Routen/Server Actions vorhanden (`grep` nach `"use server"` und `route.ts`: keine Treffer)
- [ ] Autorisierung, nicht nur Authentifizierung: Darf *dieser* User *diese* Ressource sehen? (Klassiker: `/api/orders/[id]` liefert jede beliebige ID aus) — ➖ n/a
- [ ] Eingaben werden serverseitig validiert (z.B. mit Zod), nicht nur im Formular — ➖ n/a, kein Server
- [ ] CORS steht nicht auf `*` — ➖ n/a, keine eigenen Endpunkte
- [x] File-Uploads: Typ- und Grössenlimit, Dateien landen nicht ausführbar im Public-Ordner — ✅ Foto-Uploads client-seitig auf Bildtypen limitiert und verkleinert, landen nur als Data-URL im `localStorage`; Dokumente nur als Metadaten (Name/Typ/Grösse), nie als Dateiinhalt

### 6. Deployment-Schutz auf Vercel

- [x] **Deployment Protection aktiviert.** Sonst ist jeder Preview-Branch öffentlich erreichbar und indexierbar, inklusive halbfertigem Admin-Bereich und Testdaten. — ✅ Vercel Authentication / Standard Protection aktiv (Preview-Deployments und generierte `*.vercel.app`-URLs verlangen Login)
- [ ] Environment-Variablen sind pro Umgebung getrennt (Production, Preview, Development). Preview zeigt nicht auf die Produktionsdatenbank. — ➖ n/a, aktuell keine Umgebungsvariablen vorhanden
- [x] Publizierte URL im Inkognito-Fenster geöffnet: Es ist nur sichtbar, was öffentlich sein soll — ✅ geprüft; Produktions-Domain bleibt bewusst öffentlich erreichbar (Standard Protection deckt nur Previews ab), bewusst akzeptiert, da reine Demo ohne echte Personendaten
- [ ] Admin-Bereiche und Testseiten sind nicht ohne Login erreichbar — ➖ n/a, es gibt keinen Admin-Bereich, die App hat nur einen einzigen (öffentlichen) Zugriffslevel

---

## Empfohlene Punkte

### 7. Claude Code selbst absichern

- [x] `.claude/settings.json`, `.mcp.json` und Hooks vor dem Commit lesen. Hooks führen Shell-Befehle aus und laufen auch bei allen anderen, die das Repo klonen. — ✅ geprüft: `.claude/settings.json` und `.mcp.json` existieren nicht im Repo, keine Hooks konfiguriert (nur unkritisches `.claude/launch.json` für den Dev-Server)
- [ ] `--dangerously-skip-permissions` nicht in einem Repo mit Produktions-Credentials verwenden — 🔍 betrifft die Arbeitsweise, nicht den Repo-Zustand; nicht formal geprüft
- [ ] Wenn Claude Code Webinhalte, Issues oder Logs liest, können darin Anweisungen versteckt sein. Diffs vor dem Merge anschauen, besonders bei Änderungen an Auth-, Env- und Config-Dateien. — 🔍 nicht formal geprüft
- [ ] MCP-Server durchgehen: Welche sind verbunden, mit welchen Rechten? Ein Server mit Schreibrechten auf der DB hängt an derselben Session wie die Webrecherche. — 🔍 nicht geprüft

### 8. Abhängigkeiten

- [x] **Jedes Paket im `package.json` existiert wirklich und ist das gemeinte.** Sprachmodelle erfinden Paketnamen, und diese Namen werden von Angreifern gezielt registriert (Slopsquatting). Bei unbekannten Namen: npm-Seite prüfen, sind Downloadzahlen und Repo-Link plausibel? — ✅ alle 9 Pakete real und plausibel (Next.js, React, Tailwind, ESLint, TypeScript – keine Halluzinationen)
- [x] Lockfile ist committed — ✅ `package-lock.json` committed
- [x] `npm audit` läuft ohne High oder Critical — ✅ 0 Vulnerabilities
- [x] Dependabot Alerts und Security Updates im Repo aktiviert — ✅ aktiviert am 2026-08-20

### 9. GitHub und Repo-Hygiene

- [x] Force-Push auf `main` blockiert (auch im Soloprojekt, das schützt vor dem Agenten) — ✅ aktiviert am 2026-08-20 via Ruleset (Branch targeting: Include default branch; Block force pushes, Restrict deletions)
- [ ] Falls GitHub Actions genutzt werden: Third-Party-Actions auf Commit-SHA gepinnt, `GITHUB_TOKEN` standardmässig read-only, kein `pull_request_target` mit Checkout von Fork-Code — ➖ n/a, keine GitHub-Actions-Workflows vorhanden (`.github/` existiert nicht)
- [ ] Vercel-Integration geprüft: Auf welche Repos hat sie Zugriff? — 🔍 nicht geprüft

### 10. Umgang mit fremden Eingaben

- [ ] Formulare und Eingabefelder getestet: Was passiert bei leerer, sehr langer oder HTML-haltiger Eingabe? Die App stürzt nicht ab und zeigt eine saubere Fehlermeldung. — 🔍 nicht systematisch mit Edge-Case-Eingaben getestet
- [x] Kein `dangerouslySetInnerHTML` mit ungefilterten Nutzerdaten — ✅ verifiziert, kein `dangerouslySetInnerHTML`/`eval`/`new Function` im Code
- [ ] Datenbankzugriffe laufen über Query Builder oder Prepared Statements, nicht über zusammengebaute SQL-Strings — ➖ n/a, keine Datenbank vorhanden

### 11. Kosten- und Missbrauchsschutz

- [ ] Rate Limiting auf allem, was schreibt, Mails verschickt oder ein LLM aufruft — ➖ n/a, keine schreibenden/mailenden/LLM-Endpunkte vorhanden
- [ ] **Vercel Spend Management und Usage Alerts konfiguriert.** Nicht nur die API-Rechnung, auch Vercel selbst kann bei einem Traffic-Spike schnell vierstellig werden. — 🔍 nicht geprüft, bitte im Vercel-Dashboard unter Team-Settings → Billing nachholen
- [ ] Bei den externen API-Anbietern ein hartes Ausgabenlimit gesetzt — ➖ n/a, keine externen API-Anbieter im Einsatz
- [ ] Optional bei erhöhtem Risiko: Vercel Firewall bzw. Attack Challenge Mode — 🔍 nicht konfiguriert (optional, geringes Risiko bei diesem Projekt)

### 12. Security Headers

- [x] In `next.config.js` oder `vercel.json` gesetzt: Content-Security-Policy, `X-Frame-Options` bzw. `frame-ancestors`, `X-Content-Type-Options`, HSTS, `Referrer-Policy` — ✅ alle in `next.config.ts` gesetzt und per `curl -I` verifiziert
- [ ] Gegengeprüft auf securityheaders.com — 🔍 nicht über das externe Tool gegengeprüft, nur manuell per `curl`

### 13. Betrieb

- [ ] Logs enthalten keine Tokens, Passwörter oder Personendaten (die Vercel-Logs sieht das ganze Team) — ➖ n/a, kein eigener Server, keine serverseitigen Logs mit Nutzerdaten
- [ ] Datenbank-Backup existiert und wurde einmal testweise zurückgespielt — 🔍 offen: keine Datenbank, Daten liegen nur im `localStorage` ohne Backup/Export; für diese Projektversion bewusst als nicht nötig eingestuft
- [ ] Notfallablauf steht fest: Key rotieren, Deployment zurückrollen, betroffene Daten identifizieren — 🔍 nicht formal dokumentiert
- [ ] Falls Personendaten verarbeitet werden: Serverstandort und Auftragsverarbeitung sind geklärt — ➖ n/a, aktuell ausschliesslich Demo-Daten ohne realen Personenbezug

---

## Wenn die Zeit knapp ist

Diese drei gehen bei diesem Stack am häufigsten schief und führen am direktesten zu einem echten Leak:

1. Deployment Protection auf Vercel aktivieren — ✅ erledigt
2. Prüfen, dass kein Secret hinter einem `NEXT_PUBLIC_`-Prefix steckt — ✅ erledigt (keine solchen Variablen vorhanden)
3. Autorisierung in jeder einzelnen API-Route, nicht nur im UI — ➖ n/a, keine API-Routen vorhanden
