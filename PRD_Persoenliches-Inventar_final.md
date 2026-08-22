# PRD – Persönliches Inventar

## 1. Produkt in einem Satz

Die App hilft Privatpersonen, ihre physischen Besitztümer zentral zu erfassen, zu finden und zu verwalten, indem Gegenstände mit Standort, Kaufpreis, Zustand, Status und weiteren Eigenschaften in einem persönlichen Inventar organisiert werden.

---

## 2. Zielgruppe & Nutzungskontext

Die App richtet sich an Privatpersonen, die einen strukturierten Überblick über ihre Besitztümer möchten.

Typische Anwendungsfälle:

- Gegenstände finden
- Überblick über den eigenen Besitz erhalten
- Kaufwerte nach Kategorien einsehen
- Gegenstände mit Wartungs-, Reparatur- oder anderem Handlungsbedarf erkennen
- Gegenstände für Reisen in Packlisten zusammenstellen
- zusammengehörende Gegenstände miteinander verknüpfen

Die App soll auf Desktop, Tablet und Smartphone gut funktionieren.

Es wird **kein Mobile-First-Ansatz** verfolgt. Die Benutzeroberfläche soll als responsive Web-App für unterschiedliche Bildschirmgrössen gestaltet werden.

---

## 3. Kernfeatures

### 3.1 Dashboard

Das Dashboard ist die Startseite und Kommandozentrale der App.

Es enthält:

- globale Navigation
- Live-Suche im Inventar
- Bereich «Aufmerksamkeit erforderlich»
- Inventarstatistik nach Kategorien
- Gesamtanzahl der Gegenstände
- Summe der erfassten Kaufpreise

#### Live-Suche

Prominentes Suchfeld mit Placeholder:

**«Inventar durchsuchen …»**

Die Suche berücksichtigt alle erfassten Text-, Zahlen-, Datums- und Auswahlfelder eines Gegenstands sowie die Dateinamen hinterlegter Dokumente. Inhalte von Bildern oder Dokumentdateien werden nicht durchsucht. Aussortierte Gegenstände (Status «Aussortiert») werden dabei **nicht** berücksichtigt.

Bereits während der Eingabe werden maximal 10 Treffer angezeigt. Die Sortierung erfolgt nach Relevanz in dieser Priorität: **Name → Marke / Hersteller → Modell → Kategorie → weitere durchsuchbare Felder**. Treffer in einem höher priorisierten Feld werden vor Treffern in tiefer priorisierten Feldern angezeigt.

Ein Treffer zeigt:

- Bild
- Name
- Kategorie
- Hauptstandort

Ein Klick öffnet die Detailseite.

Bei weiteren Treffern:

**«Alle anzeigen»**

Dies öffnet die Inventaransicht mit aktiver Suche.

#### Aufmerksamkeit erforderlich

Ein Gegenstand erscheint in diesem Bereich, wenn **mindestens eine** der folgenden Bedingungen zutrifft:

- Zustand ist **Defekt**
- Status ist **Wartung notwendig**, **In Reparatur**, **Ausgeliehen** oder **Nicht verfügbar**
- Kategorie ist **Sport & Freizeit** und das Datum «nächste Wartung» liegt in der Vergangenheit

Aussortierte Gegenstände lösen **nie** «Aufmerksamkeit erforderlich» aus.

Über ein Symbol mit drei vertikalen Punkten rechts neben dem Titel «Aufmerksamkeit erforderlich» kann ein Status-Filter geöffnet werden, mit dem festgelegt werden kann, welche statusbedingten Auslöser in diesem Bereich berücksichtigt werden (z. B. um Gegenstände mit Status «Ausgeliehen» bewusst auszublenden, wenn diese für den Nutzer keine akute Handlung erfordern). Standardmässig sind alle oben genannten auslösenden Status aktiv. Die getroffene Auswahl bleibt bestehen, bis sie vom Nutzer wieder geändert wird (persistent gespeichert, nicht nur pro Sitzung).

Der Status-Filter deaktiviert **nur den jeweiligen Status als Auslöser**. Trifft bei einem Gegenstand zusätzlich eine andere aktive Bedingung zu, z. B. Zustand «Defekt» oder ein überschrittenes Wartungsdatum, bleibt der Gegenstand im Bereich sichtbar.

Jede Kachel enthält:

- grosses Bild
- Name
- relevanten Zustand oder Status
- optional kurze Zusatzinformation

Beispiele:

- Velo – In Reparatur
- Inlineskates – Wartung notwendig
- Kopfhörer – Defekt

Die gesamte Kachel ist anklickbar und öffnet die Detailseite.

#### Inventarübersicht

Anzeige der Kategorien mit:

- Anzahl Gegenstände
- Summe der hinterlegten Kaufpreise

Beispiel:

| Kategorie | Anzahl | Kaufpreis |
|---|---:|---:|
| Elektronik & Technik | 18 | CHF 9'480 |
| Möbel & Einrichtung | 22 | CHF 8'250 |
| Sport & Freizeit | 31 | CHF 5'840 |

Jede Kategorie ist anklickbar und öffnet das Inventar mit entsprechend gesetztem Filter.

Aussortierte Gegenstände (Status «Aussortiert») fliessen **nicht** in Anzahl und Kaufpreis-Summe dieser Übersicht ein.

#### Akzeptanzkriterium

Als Nutzer:in sehe ich auf der Startseite relevante Gegenstände und Inventarwerte, kann mein Inventar durchsuchen und über Kategorien oder Gegenstände direkt zu den entsprechenden Inhalten navigieren.

---

### 3.2 Inventar

Das Inventar zeigt alle erfassten Gegenstände primär in einer kompakten Listenansicht.

Gegenstände mit Status **«Aussortiert»** werden standardmässig **nicht** in dieser Liste angezeigt. Über einen Button **«Aussortierte Objekte anzeigen»** kann eine separate, eingeblendete Liste dieser Gegenstände geöffnet werden. Diese Liste verwendet dieselbe Darstellung, Suche und Sortierung wie die reguläre Inventarliste, ist jedoch klar als «Aussortiert» gekennzeichnet.

Jeder Listeneintrag zeigt nur allgemeine Felder:

- Bild
- Name
- Kategorie
- Hauptstandort
- Zustand
- Status
- Kaufpreis

Bei Standort wird nur die oberste Ebene angezeigt, z. B. **Küche** oder **Keller**.

Nicht vorhandene Werte werden nicht dargestellt.

Die gesamte Listenzeile ist anklickbar.

#### Suche

Klassische Sofortsuche über alle Datenfelder.

#### Filter

Kombinierbare Filter:

- Kategorie
- Hauptstandort
- Unterstandort (abhängig vom gewählten Hauptstandort)
- Zustand
- Status
- Kaufpreis von/bis
- Kaufdatum
- Marke / Hersteller
- Garantie vorhanden
- Dokument vorhanden

Aktive Filter werden sichtbar dargestellt und können einzeln oder vollständig entfernt werden.

#### Sortierung

- Name A–Z / Z–A
- Kaufpreis auf-/absteigend
- Kaufdatum neueste/älteste
- zuletzt hinzugefügt

#### Akzeptanzkriterium

Als Nutzer:in kann ich alle Gegenstände durchsuchen, kombinierte Filter anwenden, sortieren und jeden Eintrag öffnen.

---

### 3.3 Gegenstand erfassen und bearbeiten

Über den global sichtbaren Button **«+ Hinzufügen»** wird eine eigene Erfassungsseite geöffnet.

Nur der **Name ist obligatorisch**.

Alle anderen Felder sind optional.

Ein Gegenstand darf gespeichert werden, sobald ein Name vorhanden ist.

#### Basisfelder

Reihenfolge:

1. Name*
2. Marke / Hersteller
3. Foto
4. Kategorie
5. Standort
6. Kaufdatum
7. Kaufpreis
8. Zustand
9. Status
10. verknüpfte Gegenstände
11. Dokumente
12. Notizen

#### Standort

Der Standort besteht aus zwei abhängigen Ebenen.

Beispiel:

**Küche**
- Vorratsschrank
- Schublade
- Kühlschrank

**Keller**
- Werkzeugregal
- Veloraum
- Boxenregal

Die zweite Ebene zeigt nur Unterstandorte des gewählten Hauptstandorts.

Neue Haupt- und Unterstandorte können jederzeit angelegt werden, auch direkt während der Erfassung eines Gegenstands über die Zusatzoption **«+ neuer Standort erfassen»** im jeweiligen Auswahlfeld.

Neu eingegebene Haupt- oder Unterstandorte werden während der Gegenstandserfassung zunächst **nur lokal im Formular gehalten** und erst zusammen mit dem Gegenstand dauerhaft gespeichert. Wird die Erfassung abgebrochen, werden diese neuen Standorte nicht gespeichert.

Das Bearbeiten und Löschen bestehender Standorte erfolgt nicht hier, sondern zentral auf der Einstellungsseite (siehe Abschnitt 3.6, «Einstellungen»).

#### Wechsel von Kategorie oder Status

Wird die **Kategorie** eines bestehenden Gegenstands geändert, werden kategoriespezifische Felder, die zur neuen Kategorie nicht mehr gehören, nach einer Bestätigung gelöscht. Dadurch bleiben keine unsichtbaren Altinformationen erhalten.

Wird der **Status** geändert, werden statusabhängige Felder des bisherigen Status ebenfalls gelöscht, sobald sie für den neuen Status nicht mehr relevant sind. Beispiel: Beim Wechsel von «In Reparatur» zu «Einsatzbereit» werden Reparaturbeschreibung, Datum und Werkstatt / Ort entfernt.

#### Kaufpreis

Es wird ausschliesslich der ursprüngliche Kaufpreis gespeichert, als reiner Zahlenwert ohne gegenstandsspezifische Währung.

Die Anzeige erfolgt einheitlich mit dem unter «Einstellungen» (3.6) festgelegten Label (z. B. CHF, EUR, USD).

Es gibt keine Berechnung oder Speicherung eines aktuellen Zeitwerts.

Alle Statistiken verwenden die Summe der hinterlegten Kaufpreise.

#### Speichern

Nach erfolgreichem Speichern öffnet sich die Detailseite des Gegenstands.

#### Akzeptanzkriterium

Als Nutzer:in kann ich einen Gegenstand nur mit Name oder mit beliebig vielen zusätzlichen Informationen erfassen, speichern und später bearbeiten.

---

### 3.4 Detailseite eines Gegenstands

Die Detailseite zeigt nur Felder, für die Daten vorhanden sind.

Sie enthält:

- Bild
- Name
- Kategorie
- Zustand
- Status
- Basisinformationen
- kategoriespezifische Informationen
- Statusinformationen
- verknüpfte Gegenstände
- Dokumente
- Notizen

Aktionen:

- Bearbeiten
- Löschen
- Gegenstand verknüpfen
- optional zu bestehender Packliste hinzufügen

Ein Klick auf einen verknüpften Gegenstand öffnet dessen Detailseite.

#### Löschen

Wird ein Gegenstand gelöscht:

- wird er automatisch aus **allen Packlisten** entfernt, in denen er enthalten war
- werden **alle Verknüpfungen** zu anderen Gegenständen beidseitig aufgehoben

Das Löschen benötigt weiterhin eine Bestätigung (siehe Abschnitt 9).

#### Akzeptanzkriterium

Als Nutzer:in sehe ich alle vorhandenen Informationen eines Gegenstands ohne leere Platzhalter und kann ihn bearbeiten, löschen oder verknüpfte Gegenstände öffnen. Beim Löschen werden Packlisten-Einträge und Verknüpfungen automatisch bereinigt.

---

### 3.5 «Ich verreise» / Packlisten

Der Bereich verwaltet Packlisten aus Gegenständen des bestehenden Inventars.

#### Packlistenübersicht

Packlisten werden unterteilt in:

- Bevorstehend
- Ohne Datum
- Vergangen

Pro Packliste werden angezeigt:

- Name
- optional Reisedatum
- Anzahl Gegenstände
- Packfortschritt

Über eine Schnellbearbeitung können direkt:

- Name geändert
- Reisedatum geändert oder entfernt
- Packliste gelöscht werden

Nur der Name ist obligatorisch.

#### Packliste erstellen

Felder:

- Name*
- Startdatum
- Enddatum
- Notizen

Datumsangaben sind optional. Das **Enddatum kann nur gesetzt werden, wenn ein Startdatum vorhanden ist**. Ist nur ein Startdatum erfasst, gilt dieses als einzelnes Reisedatum.

Für die Einordnung in der Übersicht gilt:

- **Bevorstehend:** Startdatum liegt heute oder in der Zukunft, oder die Reise läuft aktuell (Startdatum liegt in der Vergangenheit und Enddatum ist heute oder später)
- **Vergangen:** Enddatum liegt in der Vergangenheit; bei Packlisten ohne Enddatum liegt das Startdatum in der Vergangenheit
- **Ohne Datum:** kein Startdatum vorhanden

#### Gegenstände auswählen

Gegenstände werden aus dem bestehenden Inventar ausgewählt.

Verfügbar sind:

- Suche
- Kategorie-Filter
- Standort-Filter
- Mehrfachauswahl

Die Packliste darf nur Gegenstände enthalten, die im Inventar existieren. Gegenstände mit Status **«Aussortiert»** können **nicht neu** zu einer Packliste hinzugefügt werden.

#### Packliste

Gegenstände werden automatisch nach Inventarkategorie gruppiert.

Jeder Eintrag kann als:

- eingepackt
- noch einzupacken

markiert werden.

Ein Fortschrittswert zeigt z. B.:

**8 von 12 eingepackt**

Gegenstände mit problematischem Status zeigen einen Hinweis, z. B.:

**Velo – In Reparatur**

Der Gegenstand darf trotzdem zur Packliste hinzugefügt werden.

Wird ein Gegenstand **erst nachträglich aussortiert**, bleibt er in bereits bestehenden Packlisten enthalten und wird dort deutlich mit dem Hinweis **«Aussortiert»** gekennzeichnet. So bleiben auch vergangene Packlisten inhaltlich erhalten.

#### Verknüpfte Gegenstände

Wird ein Gegenstand hinzugefügt, können damit verknüpfte Gegenstände als optionale Ergänzungen angezeigt werden.

Beispiel:

**Ski hinzugefügt**

Passende Gegenstände:
- Skischuhe
- Skistöcke
- Skibrille

Diese werden niemals automatisch hinzugefügt.

#### Akzeptanzkriterium

Als Nutzer:in kann ich eine Packliste erstellen, Gegenstände aus meinem Inventar hinzufügen, den Packstatus verwalten sowie Packlisten direkt in der Übersicht umbenennen, datieren oder löschen.

---

### 3.6 Einstellungen

Eigene Seite unter `/settings`, erreichbar über ein Icon in der Kopfzeile (nicht Teil der 4 Hauptnavigationspunkte).

#### Standortverwaltung

- Übersicht aller Haupt- und Unterstandorte
- Umbenennen von Haupt- und Unterstandorten
- Löschen von Haupt- und Unterstandorten

Löschen ist möglich, da der Standort eines Gegenstands optional ist. Dabei gilt:

- Wird ein **Unterstandort** gelöscht, wird bei betroffenen Gegenständen nur der Unterstandort entfernt; der Hauptstandort bleibt bestehen.
- Wird ein **Hauptstandort** gelöscht, werden alle zugehörigen Unterstandorte ebenfalls gelöscht und bei den betroffenen Gegenständen sowohl Haupt- als auch Unterstandort entfernt.

Die Gegenstände selbst bleiben in jedem Fall bestehen.

Der Nutzer wird vor dem Löschen eines Standorts, der noch Gegenständen zugeordnet ist, über die Anzahl betroffener Gegenstände informiert und muss den Vorgang bestätigen.

#### Label für Währung

- Freie Auswahl bzw. Eingabe des Währungs-Labels, z. B. **CHF**, **EUR**, **USD**
- Das Label bestimmt ausschliesslich, welches Kürzel/Symbol neben den erfassten Zahlenwerten angezeigt wird
- Es findet **keinerlei Umrechnung** statt: alle bereits erfassten Kaufpreise (Zahlenwerte) bleiben unverändert, nur die Beschriftung ändert sich
- Beim Ändern des Labels wird der Nutzer darauf hingewiesen, dass bestehende Werte nicht umgerechnet werden

#### Akzeptanzkriterium

Als Nutzer:in kann ich Standorte umbenennen oder löschen sowie das Label für die Kaufpreis-Anzeige der App festlegen.

---

## 4. Datenmodell

### 4.1 Item / Gegenstand

Allgemeine Felder:

- id
- name*
- brand
- image
- category
- locationPrimary
- locationSecondary
- purchaseDate
- purchasePrice
- condition
- status
- notes
- createdAt
- updatedAt

Zusätzlich:

- categorySpecificData
- statusSpecificData
- documents
- linkedItems

Nur `name` ist obligatorisch.

---

### 4.2 Kategorien

Die folgenden 6 Kategorien sind **bewusst fix und im Prototyp nicht erweiterbar**, um die Komplexität (Formulare, Filter, Statistiken) niedrig zu halten. Das Anlegen neuer Kategorien ist kein Ziel dieses Prototyps.

#### Elektronik & Technik

Optionale Zusatzfelder:

- Modell
- Seriennummer
- Garantie bis

#### Kleidung & Accessoires

Optionale Zusatzfelder:

- Grösse
- Farbe
- Saison
- Einsatzzweck

Einsatzzweck:

- Basic
- Freizeit
- Sport
- Arbeit
- Formal
- Sonstiges

#### Sport & Freizeit

Optionale Zusatzfelder:

- Modell
- letzte Wartung
- nächste Wartung

Das Feld «nächste Wartung» ist ein zusätzlicher Auslöser für den Bereich «Aufmerksamkeit erforderlich» (siehe 3.1): Liegt dieses Datum in der Vergangenheit, wird der Gegenstand hervorgehoben. Der Status «Wartung notwendig» wirkt unabhängig davon als allgemeiner statusbedingter Auslöser.

#### Haushalt & Küche

Optionale Zusatzfelder:

- Modell
- Material
- Garantie bis

#### Möbel & Einrichtung

Optionale Zusatzfelder:

- Material
- Farbe
- Masse

#### Sonstiges

Keine zusätzlichen Felder.

---

### 4.3 Zustand

Mögliche Werte:

- Neu
- Sehr gut
- Gut
- Stark gebraucht
- Defekt

Der Zustand beschreibt den physischen Erhaltungszustand.

---

### 4.4 Status

Mögliche Werte:

- Einsatzbereit
- Wartung notwendig
- In Reparatur
- Ausgeliehen
- Nicht verfügbar
- Aussortiert

Der Status beschreibt die aktuelle Verfügbarkeit bzw. Situation eines Gegenstands.

#### Statusabhängige Felder

**Wartung notwendig**
- Beschreibung
- fällig am

**In Reparatur**
- Beschreibung
- seit
- Werkstatt / Ort

**Ausgeliehen**
- ausgeliehen an
- seit
- Rückgabe geplant am

**Aussortiert**
- Grund, mit folgenden möglichen Werten:
  - Verkauft
  - Verschenkt
  - Verloren
  - Gestohlen
  - Zerstört
  - Entsorgt

Ein aussortierter Gegenstand kann jederzeit reaktiviert werden, indem der Status über die reguläre Bearbeitung (z. B. auf «Einsatzbereit») geändert wird – etwa wenn ein als verloren markierter Gegenstand wiedergefunden wird. Der bisherige Grund wird dabei nicht weiter benötigt und wird beim Statuswechsel gelöscht; relevant ist nur der neue Status. Der Gegenstand erscheint danach wieder regulär im Inventar.

Generell werden beim Wechsel des Status alle statusabhängigen Felder des bisherigen Status gelöscht, sofern sie für den neuen Status nicht mehr relevant sind.

Alle Felder optional.

---

### 4.5 Verknüpfte Gegenstände

Jeder Gegenstand kann mit beliebig vielen anderen Gegenständen verknüpft werden.

Die Beziehung ist immer beidseitig.

Beispiel:

Fahrrad ↔ Fahrradhelm

Wird die Verbindung beim Fahrrad erstellt, muss sie automatisch auch beim Fahrradhelm sichtbar sein.

Es gibt keine unterschiedlichen Beziehungstypen.

---

### 4.6 Standorte

Standorte besitzen zwei Ebenen:

**Primary Location**
z. B. Küche

**Secondary Location**
z. B. Vorratsschrank

Jeder Secondary Location ist genau einem Primary Location zugeordnet.

---

### 4.7 Packliste

Felder:

- id
- name*
- startDate
- endDate
- notes
- createdAt
- updatedAt

Packlisten-Einträge:

- packingListId
- itemId
- packed: boolean

---

### 4.8 Einstellungen

Globale, einmalige Einstellungen (Single-User-Prototyp):

- currencyLabel: freier Text, z. B. `CHF` (Default: `CHF`) – reines Anzeige-Label, keine Umrechnungslogik
- dashboardAttentionStatusFilter: Liste der Status, die im Bereich «Aufmerksamkeit erforderlich» berücksichtigt werden (Default: alle auslösenden Status aktiv)

---

## 5. Navigation & Seitenstruktur

Globale Hauptnavigation:

1. Dashboard
2. Inventar
3. Ich verreise
4. + Hinzufügen

**«+ Hinzufügen»** wird visuell als auffälliger Button mit deutlich erkennbarem Plus-Symbol dargestellt.

Die Hauptnavigation soll auf allen zentralen Seiten erreichbar sein.

Benötigte Routen:

- `/` – Dashboard
- `/inventory` – Inventar
- `/items/new` – Gegenstand hinzufügen
- `/items/[id]` – Detailseite
- `/items/[id]/edit` – Gegenstand bearbeiten
- `/packing` – Packlistenübersicht
- `/packing/new` – Packliste erstellen
- `/packing/[id]` – einzelne Packliste
- `/settings` – Einstellungen (Standortverwaltung, Währung)

---

## 6. Design-Richtung

Die Anwendung soll funktional, reduziert und hochwertig wirken, ohne unnötige dekorative Elemente.

### Farbwelt

- Hauptfarben: **Schwarz und Weiss**
- Primäre Buttons: **schwarze Fläche mit weisser Schrift**
- Sekundäre Buttons: **weisse Fläche mit schwarzer Outline und schwarzer Schrift**
- Akzentfarben nur sehr sparsam einsetzen, z. B. für Status- oder Warnhinweise
- keine grossflächigen Farbverläufe oder dekorativen Farbflächen

### Buttons und Controls

- Buttons besitzen **vollständig abgerundete Ecken** im Pill-Stil
- Primär- und Sekundärbuttons sollen klar unterscheidbar sein
- Formularelemente und Filter sollen sich gestalterisch an der reduzierten Schwarz-Weiss-Sprache orientieren
- aktive Zustände müssen trotzdem eindeutig erkennbar sein
- Touch-Ziele auf Smartphones ausreichend gross gestalten

### Typografie

Als Schriftart wird **Figtree** von Google Fonts verwendet.

- Figtree für sämtliche Texte und UI-Elemente
- klare typografische Hierarchie
- kräftigere Schnitte für Titel und wichtige Kennzahlen
- reguläre Schnitte für Fliesstext, Labels und Listen
- gute Lesbarkeit auch bei kleineren Bildschirmgrössen

### Allgemeine Gestaltung

- grosszügige Flächen und Abstände
- klare visuelle Hierarchie
- hoher Weissraumanteil
- grosse Gegenstandsbilder dort, wo sie inhaltlich relevant sind
- klar erkennbare Status- und Zustandslabels
- gut lesbare Listen
- Karten und Inhaltscontainer dürfen leicht abgerundete Ecken besitzen
- konsistente Abstände und Raster
- möglichst wenig visuelles Rauschen
- keine überladene Dashboard-Optik

### Dashboard

- «Aufmerksamkeit erforderlich» wird visuell prominent dargestellt
- Gegenstände erscheinen dort als grosse, anklickbare Bildkacheln
- Status bzw. Zustand ist direkt auf oder unter der Kachel sichtbar
- Inventarstatistiken werden zurückhaltender dargestellt
- Kategorien sind klar als anklickbare Elemente erkennbar

### Navigation

Globale Navigation:

- Dashboard
- Inventar
- Ich verreise
- + Hinzufügen

**«+ Hinzufügen»** wird als auffälliger schwarzer Primärbutton mit deutlich erkennbarem Plus-Symbol gestaltet.

### Responsive Verhalten

Kein Mobile-First-Konzept.

Die Anwendung wird als responsive Web-App für Desktop, Tablet und Smartphone umgesetzt.

Desktop:
- horizontale Hauptnavigation
- mehrspaltige Dashboard-Bereiche möglich
- breite Inventarliste
- grosszügige Abstände

Smartphone:
- Navigation platzsparend anpassen
- Inhalte untereinander anordnen
- Kacheln und Listen auf verfügbare Breite skalieren
- Formulare einspaltig darstellen
- Touch-Ziele ausreichend gross gestalten
- keine Funktion darf gegenüber der Desktop-Version entfallen

---

## 7. Technische Vorgaben

### Hosting

Deployment auf **Vercel**.

### Empfohlener Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Supabase / PostgreSQL für persistente Daten und Datei-Metadaten

Die konkrete Technologie darf angepasst werden, sofern:

- sie problemlos auf Vercel deploybar ist
- eine relationale persistente Datenspeicherung möglich ist
- responsive Frontend-Komponenten unterstützt werden
- der Code wartbar und klar strukturiert bleibt

### Architektur

- komponentenbasierter Aufbau
- klare Trennung von UI, Datenzugriff und Businesslogik
- wiederverwendbare Komponenten für Items, Statuslabels, Filter und Formulare
- keine unnötig komplexe State-Management-Library verwenden
- möglichst wenige externe Abhängigkeiten

### Daten

Persistiert werden müssen:

- Gegenstände
- Kategorien
- Standorte
- Verknüpfungen
- Dokument-Metadaten
- Packlisten
- Packlisten-Einträge
- Einstellungen (Währungs-Label und Dashboard-Statusfilter)

### Bilder und Dokumente

Für den Prototyp genügt ein einfacher Upload.

Falls Supabase verwendet wird:
- Supabase Storage verwenden.

Unterstützt werden sollen mindestens:

- JPG
- PNG
- WebP
- PDF

### Login

Kein Login und keine Benutzeraccounts für diesen Prototyp.

Die Anwendung darf von einem einzigen beispielhaften Benutzer ausgehen.

### Beispieldaten

Die App soll mit realistischen Seed-/Demo-Daten ausgeliefert werden, damit Dashboard, Filter, Verknüpfungen und Packlisten sofort sichtbar getestet werden können.

Mindestens:

- 20 Gegenstände
- alle Kategorien vertreten
- mehrere Standorte
- mehrere unterschiedliche Zustände und Status
- mindestens 5 miteinander verknüpfte Gegenstände
- mindestens 2 Packlisten
- Gegenstände mit und ohne optionale Daten
- mindestens 2 aussortierte Gegenstände mit unterschiedlichem Grund (z. B. Verkauft, Entsorgt)
- mindestens 1 Gegenstand der Kategorie Sport & Freizeit mit überschrittenem Wartungsdatum

---

## 8. Out of Scope

Bewusst nicht umsetzen:

- KI-basierte Bilderkennung
- automatische Produkterkennung
- Barcode- oder QR-Code-Erfassung
- natürlichsprachige Inventarsuche
- automatische Wertschätzung
- Zeitwertberechnung
- Versicherungsanbindungen
- Wetterintegration
- automatische Packvorschläge anhand von Reisezielen
- Verkaufsplattformen
- automatische Verkaufsempfehlungen
- Ausleih-Erinnerungen
- Multi-User-Haushalte
- Benutzeraccounts
- automatische Rechnungserkennung
- externe Produktdatenbanken

Diese Funktionen können als mögliche Weiterentwicklung dokumentiert werden, gehören aber nicht zum Prototyp.

---

## 9. Qualitäts- und UX-Anforderungen

- Keine Pflichtfelder ausser dem Namen eines Gegenstands bzw. dem Namen einer Packliste.
- Leere optionale Felder werden in Detailansichten nicht angezeigt.
- Löschen benötigt eine Bestätigung.
- Änderungen müssen nach Speichern unmittelbar sichtbar sein.
- Verknüpfungen zwischen Gegenständen müssen beidseitig funktionieren.
- Filter müssen kombinierbar sein.
- Suchresultate müssen bereits während der Eingabe aktualisiert werden.
- Dashboard-Zahlen müssen aus den tatsächlich gespeicherten Daten berechnet werden.
- Kaufwerte berücksichtigen nur Gegenstände mit vorhandenem Kaufpreis und **schliessen aussortierte Gegenstände aus**.
- Gegenstände mit Status «Aussortiert» werden im regulären Inventar ausgeblendet und nur über «Aussortierte Objekte anzeigen» sichtbar.
- Aussortierte Gegenstände können nicht neu zu Packlisten hinzugefügt werden. Bereits bestehende Packlisten-Einträge bleiben erhalten und werden mit «Aussortiert» gekennzeichnet.
- Beim Wechsel von Kategorie oder Status werden nicht mehr relevante kategorie- bzw. statusabhängige Felder nach den definierten Regeln gelöscht.
- Wird ein Gegenstand gelöscht, werden zugehörige Packlisten-Einträge und Verknüpfungen automatisch entfernt.
- Alle anklickbaren Gegenstände führen konsistent zur gleichen Detailseite.
- Die Anwendung muss auf aktuellen Desktop- und Smartphone-Browsern sinnvoll bedienbar sein.

---

## 10. Erster Prompt für Claude Code

Entwickle anhand der folgenden PRD eine vollständige responsive Web-App für ein persönliches Inventar.

Verwende vorzugsweise Next.js, TypeScript und Tailwind CSS und strukturiere die Anwendung so, dass sie auf Vercel deployt werden kann. Verwende für persistente Daten vorzugsweise Supabase/PostgreSQL. Falls für den ersten Entwicklungsschritt noch keine Datenbankkonfiguration vorhanden ist, implementiere eine klar austauschbare Datenzugriffsschicht und verwende realistische Seed-/Mock-Daten.

Die App besitzt vier globale Navigationspunkte:

- Dashboard
- Inventar
- Ich verreise
- + Hinzufügen

«+ Hinzufügen» soll als auffälliger schwarzer Primärbutton mit grossem Plus-Symbol gestaltet sein.

Das Dashboard ist die Kommandozentrale. Es enthält:
- eine Live-Suche über alle durchsuchbaren Felder (max. 10 Treffer, Link «Alle anzeigen», aussortierte Gegenstände werden nicht durchsucht). Treffer werden nach Relevanz priorisiert: Name → Marke / Hersteller → Modell → Kategorie → weitere Felder
- einen Bereich «Aufmerksamkeit erforderlich» mit grossen anklickbaren Bildkacheln. Auslöser: Zustand «Defekt», Status «Wartung notwendig», «In Reparatur», «Ausgeliehen» oder «Nicht verfügbar» sowie bei Sport & Freizeit zusätzlich ein überschrittenes «nächste Wartung»-Datum. Über ein Drei-Punkte-Symbol rechts neben dem Titel lässt sich ein persistenter Status-Filter öffnen. Der Filter deaktiviert nur den jeweiligen Status als Auslöser; andere aktive Auslöser wie «Defekt» oder ein überschrittenes Wartungsdatum bleiben wirksam
- Anzahl und Kaufwert der Gegenstände (ohne aussortierte Gegenstände)
- eine anklickbare Übersicht nach Kategorien

Das Inventar verwendet primär eine Listenansicht. Es bietet Sofortsuche, kombinierbare Filter (inkl. Unterstandort) und Sortierung. Ein Klick auf einen Gegenstand öffnet dessen Detailseite. Aussortierte Gegenstände sind standardmässig ausgeblendet und über einen Button «Aussortierte Objekte anzeigen» separat einsehbar; eine Statusänderung reaktiviert einen aussortierten Gegenstand wieder.

Gegenstände besitzen nur ein Pflichtfeld: Name. Alle anderen Angaben sind optional. Unterstütze Basisfelder, kategoriespezifische Felder (die 6 Kategorien sind fix, nicht erweiterbar), Zustand, Status (inkl. fester Grund-Auswahl bei «Aussortiert»: Verkauft, Verschenkt, Verloren, Gestohlen, Zerstört, Entsorgt), zweistufig abhängige Standorte, Dokumente, Notizen und beidseitige Verknüpfungen zwischen Gegenständen. Neue Standorte können inline erfasst werden, werden während des Formulars aber nur lokal gehalten und erst beim Speichern des Gegenstands persistiert. Beim Wechsel von Kategorie oder Status werden nicht mehr relevante Zusatzfelder nach Bestätigung bzw. gemäss PRD gelöscht. Beim Löschen eines Gegenstands werden zugehörige Packlisten-Einträge und Verknüpfungen automatisch entfernt.

Eine separate Einstellungsseite (`/settings`) erlaubt das Bearbeiten und Löschen von Standorten. Beim Löschen eines Unterstandorts bleibt der Hauptstandort betroffener Gegenstände erhalten; beim Löschen eines Hauptstandorts werden dessen Unterstandorte ebenfalls gelöscht und beide Standortebenen bei betroffenen Gegenständen entfernt. Ausserdem kann ein freies Label für die Kaufpreis-Anzeige (z. B. CHF) gesetzt werden, ohne Umrechnungslogik.

Im Bereich «Ich verreise» können Packlisten aus bestehenden Inventargegenständen erstellt werden. Packlisten benötigen nur einen Namen; Datumsangaben sind optional. Ein Enddatum kann nur gesetzt werden, wenn ein Startdatum vorhanden ist; ohne Enddatum gilt das Startdatum als einzelnes Reisedatum. Laufende Reisen werden unter «Bevorstehend» geführt. Aussortierte Gegenstände können nicht neu zu Packlisten hinzugefügt werden, bleiben aber in bereits bestehenden Packlisten erhalten und werden dort mit «Aussortiert» gekennzeichnet. Gegenstände können als eingepackt markiert werden. Name, Datum und Löschen müssen über eine Schnellbearbeitung in der Packlistenübersicht erreichbar sein.

Setze die Anwendung responsiv um. Verfolge keinen Mobile-First-Ansatz, stelle aber sicher, dass sämtliche Funktionen auch auf Smartphones sinnvoll bedienbar sind.

Design:
- Hauptfarben Schwarz und Weiss
- Primärbuttons schwarz mit weisser Schrift
- Sekundärbuttons weiss mit schwarzer Outline und schwarzer Schrift
- Buttons vollständig abgerundet im Pill-Stil
- Schriftart Figtree von Google Fonts
- grosszügige Flächen und viel Weissraum
- klare typografische Hierarchie
- grosse Gegenstandsbilder an relevanten Stellen
- Status- und Zustandsinformationen klar hervorheben
- keine dekorativen Farbverläufe oder unnötigen visuellen Effekte

Erstelle realistische Seed-Daten, sodass alle wichtigen Zustände, Kategorien, Filter, Verknüpfungen, Dashboard-Elemente und Packlisten unmittelbar getestet werden können.

Halte den Code modular, nachvollziehbar und möglichst einfach. Vermeide unnötige Abhängigkeiten und Overengineering.

Baue ausdrücklich NICHT:
KI-Erkennung, natürlichsprachige Suche, Zeitwertberechnung, Versicherungsanbindungen, Wetterintegration, automatische Packvorschläge, Verkaufsplattformen, Multi-User-Funktionen oder Benutzeraccounts.

Arbeite die Anwendung anhand dieser PRD vollständig aus. Triff bei kleineren UI-Details selbst sinnvolle, konsistente Entscheidungen, ohne den beschriebenen Funktionsumfang zu erweitern.