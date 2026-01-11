# Projektdokumentation – SailSpots

## Inhaltsverzeichnis

1. [Einordnung & Zielsetzung](#1-einordnung--zielsetzung)
2. [Zielgruppe & Stakeholder](#2-zielgruppe--stakeholder)
3. [Anforderungen & Umfang](#3-anforderungen--umfang)
4. [Vorgehen & Artefakte](#4-vorgehen--artefakte)
    - [Understand & Define](#41-understand--define)
    - [Sketch](#42-sketch)
    - [Decide](#43-decide)
    - [Prototype](#44-prototype)
    - [Validate](#45-validate)
5. [Erweiterungen [Optional]](#5-erweiterungen-optional)
6. [Projektorganisation [Optional]](#6-projektorganisation-optional)
7. [KI‑Deklaration](#7-ki‑deklaration)
8. [Anhang [Optional]](#8-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

## 1. Einordnung & Zielsetzung

### Kontext & Problem
Segler:innen, die gerne auf  Meere und Seen unterwegs sind, sammeln ihre Lieblings-Ankerplätze, Buchten und Marinas häufig unorganisiert. Der Austausch über entdeckte Spots, persönliche Erfahrungen, Bilder und Eindrücke ist nicht zentral organisiert und verteilt sich über verschiedene Plattformen oder bleibt ganz aus. Die Planung von Segeltörns über mehrere Spots hinweg erfordert manuelle Arbeit mit verschiedenen Tools.

### Ziele
Eine zentrale Web-Applikation schaffen, in der Segler:innen ihre Spots erfassen, auf der Karte visualisieren und mit anderen teilen können. Die Plattform soll Inspiration bieten, den Austausch fördern und Segeltörns über mehrere Ankerplätze hinweg planbar machen – mit Routenberechnung und Distanzen. Alles übersichtlich und mit geringem Aufwand.

### Abgrenzung
Die Applikation bietet keine Echtzeit-Navigation, kein Wetter-Tracking.

## 2. Zielgruppe & Stakeholder

### Primäre Zielgruppe
Freizeit-Segler:innen auf Schweizer Seen und weltweit, die ihre entdeckten Ankerplätze organisieren und mit der Community teilen wollen. Sie planen Segeltörns über mehrere Spots, suchen nach Inspiration für neue Ziele und möchten ihre Erfahrungen festhalten.

### Weitere Stakeholder
Segler-Freunde (Vater) als Early Adopters für Usability-Tests.

### Annahmen
Segler:innen sind bereit, ihre Lieblingsspots zu teilen, wenn die Plattform einfach zu bedienen ist, visuell ansprechend darstellt und ihnen gleichzeitig selbst Inspiration für neue Ankerplätze bietet.

## 3. Anforderungen & Umfang

### Kernfunktionalität (Mindestumfang)

**Spot anlegen:** Segler:innen können neue Ankerplätze mit Koordinaten, Name, Typ (Bucht, Marina, Ankerplatz), Beschreibung und Bildern erfassen.

**Spot ansehen:** Alle gespeicherten Spots werden in einer übersichtlichen Liste dargestellt. Jeder Spot kann in einer Detailansicht geöffnet werden mit allen Informationen und Bildern.

**Spot löschen:** Nur eigene Spots können gelöscht werden – öffentliche Spots anderer Nutzer:innen bleiben geschützt.

**Karte nutzen:** Alle Spots werden als Marker auf einer interaktiven Karte angezeigt. Neue Spots können durch Klicken auf die Karte erstellt werden.

**Tour planen:** Favorisierte Spots können ausgewählt und in eine gewünschte Reihenfolge gebracht werden, um eine Segeltour zu planen.

**Route berechnen:** Die App berechnet automatisch die Route zwischen den ausgewählten Spots mit Distanz.

**Route visualisieren:** Die berechnete Route wird als Linie auf der Karte dargestellt mit allen Zwischenpunkten, Gesamtdistanz und Zeitangabe.

### Workflows

Spot erstellen → auf Karte anzeigen → als Favorit markieren → in Tour-Planung hinzufügen → Route berechnen → Route auf Karte ansehen → Tour speichern oder bearbeiten

### Akzeptanzkriterien

- Ein neuer Spot kann vollständig erfasst werden und erscheint sofort in der Liste und auf der Karte
- Die Karte zeigt alle Spots korrekt als Marker an
- Eine Tour kann aus mindestens 2 Spots erstellt werden
- Die Route wird korrekt berechnet und visuell dargestellt
- Öffentliche und private Spots sind klar unterscheidbar
- Nur eigene Spots können bearbeitet oder gelöscht werden
- Alle Kern-Workflows funktionieren ohne zusätzliche Erklärungen

### Erweiterungen [Optional]

**Bilder per Drag & Drop:** Bilder können komfortabel per Drag & Drop hochgeladen werden, anstatt über einen File-Picker.

**Öffentlich/Privat:** Spots können als öffentlich oder privat markiert werden – private Spots sind nur für den Ersteller sichtbar.

**Favoriten-System:** Öffentliche Spots anderer Nutzer:innen können als Favoriten gespeichert werden.

**Benutzerverwaltung:** Registrierung, Login und persönliches Profil.

**Feed & Community:** Übersicht über eigene und öffentliche Aktivitäten anderer Nutzer:innen in einem Feed.

**Statistiken:** Persönliche Übersicht über eigene Spots, geplante Touren und zurückgelegte Distanzen.

Akzeptanzkriterien (Erweiterungen):
- Öffentliche Spots sind für andere sichtbar, private nicht
- Bilder lassen sich hochladen und werden in Spots korrekt angezeigt
- Favoriten bleiben für den Account gespeichert
- Nutzer:innen sehen ausschließlich ihre eigenen privaten Inhalte

🖼️ Screenshot einfügen: docs/screenshots/01-workflows.png (Übersicht der Kern-Workflows als einfache Grafik)
![Workflows](docs/screenshots/01-workflows.png)

## 4. Vorgehen & Artefakte
Die Durchführung erfolgt phasenbasiert; dokumentieren Sie die wichtigsten Ergebnisse je Phase.

### 4.1 Understand & Define
- **Ausgangslage & Ziele:**
  - Spots sind oft verstreut (Notizen, Apps, Karten)
  - Ziel ist eine zentrale, ruhige Übersicht für Spots und Touren
- **Zielgruppenverständnis:**
  - [TODO: Welche Recherche/Inputs wurden gemacht?]
- **Wesentliche Erkenntnisse:**
  - [TODO: 3–5 kurze Erkenntnisse aus der Analyse]

### 4.2 Sketch
- **Variantenüberblick:**
  - [TODO: Welche Varianten wurden skizziert?]
- **Skizzen:**
  - [TODO: Unterschiede kurz dokumentieren]

🖼️ Screenshot einfügen: docs/screenshots/02-sketches.png (Skizzen der Varianten, gut lesbar)
![Sketches](docs/screenshots/02-sketches.png)

### 4.3 Decide
- **Gewählte Variante & Begründung:**
  - [TODO: Auswahlkriterien nennen, z. B. Klarheit, Ruhe, Fokus auf Karte]
- **End‑to‑End‑Ablauf:**
  - Start → Spots ansehen → Favorit → Tour bauen → Route berechnen → Route ansehen
- **Referenz‑Mockup:**
  - URL: [TODO: Mockup‑Link einfügen]

🖼️ Screenshot einfügen: docs/screenshots/03-mockup.png (Referenz‑Mockup, z. B. Startseite)
![Mockup](docs/screenshots/03-mockup.png)

### 4.4 Prototype
- **Kernfunktionalität:**
  - Spots erstellen, anzeigen, löschen
  - Favoriten markieren
  - Karte mit Marker‑Layer
  - Tour‑Builder mit Reihenfolge
  - Route mit Zwischenpunkten und Distanz/Zeit
- **Deployment:** [TODO: URL zum Deployment einfügen]

#### 4.4.1. Entwurf (Design)
Beschreibt die Gestaltung und Interaktion.
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.
- **Informationsarchitektur:**
  - Seiten: Home, Spots, Map, Tour Planning, Route, Login/Register, Spot‑Detail
  - Wiederverwendete Komponenten: Header, Footer, Hero
- **Oberflächenentwürfe:**
  - Startseite mit großem Hero
  - Spots‑Liste über Hintergrundbild
  - Karten‑Seite mit Marker‑Layer
  - Tour‑Planung mit Route‑Builder und Map
  - Route‑Seite mit Karten‑Übersicht
- **Designentscheidungen:**
  - Editorial Look mit großem Hintergrundbild
  - Ruhige Farben, klare Typo
  - Fokus auf wenige Kern‑Aktionen

🖼️ Screenshot einfügen: docs/screenshots/04-home.png (Startseite mit Hero und Links)
![Home](docs/screenshots/04-home.png)

🖼️ Screenshot einfügen: docs/screenshots/05-spots.png (Spots‑Liste mit Favoriten‑Stern)
![Spots](docs/screenshots/05-spots.png)

🖼️ Screenshot einfügen: docs/screenshots/06-map.png (Karte mit Markern und Layern)
![Map](docs/screenshots/06-map.png)

🖼️ Screenshot einfügen: docs/screenshots/07-tour-planning.png (Tour‑Planung mit Tour‑Builder und Karte)
![Tour Planning](docs/screenshots/07-tour-planning.png)

🖼️ Screenshot einfügen: docs/screenshots/08-route.png (Route‑Seite mit Polylinie und Marker)
![Route](docs/screenshots/08-route.png)

#### 4.4.2. Umsetzung (Technik)
Fasst die technische Realisierung zusammen.
- **Technologie‑Stack:** SvelteKit (JavaScript), Leaflet, MongoDB
- **Tooling:** VS Code, Node.js + npm, Vite, Git/GitHub, Netlify Adapter
- **Struktur & Komponenten:**
  - **Routen:** /, /spots, /spots/new, /spots/[id], /map, /tour-planning, /routen, /login, /register
  - **Komponenten:** Header, Footer, Hero, SpotList, SpotCard, RouteBuilder
  - **State/Stores:** tourPlan Store (localStorage)
- **Daten & Schnittstellen [Optional]:**
  - **MongoDB Spot‑Dokument:** name, region, spotType, lat, lng, description, images, visibility, favorites
  - **API:** /api/route/osrm (Route), /api/route/optimize (Reihenfolge/AI)
- **Besondere Entscheidungen:**
  - Nur eine Tour gleichzeitig (einfacher Workflow)
  - Route über direkte See‑Linie (Haversine) statt Straßen‑Routing
  - Favoriten‑Toggle ohne Page‑Reload (enhance)

### 4.5 Validate
- **URL der getesteten Version**: [TODO: Test‑URL]
- **Ziele der Prüfung:**
  - [TODO: 2–4 kurze Ziele]
- **Vorgehen:**
  - [TODO: z. B. moderiert, remote]
- **Stichprobe:**
  - [TODO: Anzahl und Profil]
- **Aufgaben/Szenarien:**
  - [TODO: 3–5 Aufgaben]
- **Kennzahlen & Beobachtungen:**
  - [TODO: Erfolgsquote, Zeitbedarf, wichtige Findings]
- **Zusammenfassung der Resultate:**
  - [TODO: 2–4 kurze Sätze]
- **Abgeleitete Verbesserungen:**
  - [TODO: 3–5 Verbesserungen, priorisiert]
- **Umgesetzte Anpassungen [Optional]:**
  - [TODO: Was wurde nach dem Test umgesetzt?]

🖼️ Screenshot einfügen: docs/screenshots/09-validate-findings.png (Validate‑Ergebnisse, ggf. anonymisiert)
![Validate Findings](docs/screenshots/09-validate-findings.png)

## 5. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.
- **Beschreibung & Nutzen:**
  - [TODO: z. B. Favoriten, Zwischenpunkte, AI‑Optimierung, Public/Private]
- **Umsetzung in Kürze:**
  - [TODO: kurz beschreiben]
- **Abgrenzung zum Mindestumfang:**
  - [TODO: klar markieren]

## 6. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:**
  - Link: [TODO: Repo‑URL]
  - Struktur: /src/routes, /src/lib/components, /src/lib/stores
- **Issue‑Management:**
  - [TODO: falls genutzt]
- **Commit‑Praxis:**
  - [TODO: z. B. sprechende Commits]

## 7. KI‑Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### Eingesetzte KI‑Werkzeuge
- Codex (OpenAI) in VS Code / Codex CLI
- [TODO: weitere Tools?]

### Zweck & Umfang
- Hilfe bei UI‑Texten, Komponenten‑Struktur und Fehlerbehebung
- Hilfe bei Route‑Builder, Karten‑Logik und Übersetzungen
- [TODO: genauer Umfang bestätigen]

### Art der Beiträge
- Teilweise Code‑Vorschläge und Anpassungen
- Teilweise Texte für UI und README

### Eigene Leistung (Abgrenzung)
- Auswahl der Anforderungen
- Design‑Entscheide und finale Implementierung
- Test und inhaltliche Korrekturen

### Reflexion
- KI spart Zeit bei Standard‑Tasks
- KI braucht klare Vorgaben und Nachkontrolle
- Qualitätssicherung bleibt Verantwortung der Studierenden

### Prompt‑Vorgehen [Optional]
- [TODO: wichtige Prompt‑Muster kurz nennen]

### Quellen & Rechte [Optional]
- [TODO: Quellen für Bilder/Assets/Lizenzen]

## 8. Anhang [Optional]
Beispiele:
- **Testskript & Materialien:** [TODO: Datei/Link]
- **Rohdaten/Auswertung:** [TODO: Datei/Link]

---

FRAGEN (bitte beantworten, damit ich [TODO]s schließen kann)
1. Wie lautet der genaue Projekttitel für die README‑Überschrift?
2. Was ist die finale Deployment‑URL?
3. Gibt es eine Video‑URL? (Max. 10 Minuten, zeigt alle Workflows)
4. Gibt es ein Figma‑Mockup? Bitte Link senden.
5. Welche Sketch‑Artefakte wurden erstellt? (Datei/Foto)
6. Wurde die Validate‑Phase durchgeführt? Wenn ja: Anzahl, Profil, Setting.
7. Welche konkreten Test‑Aufgaben wurden verwendet?
8. Was waren die wichtigsten Findings + Verbesserungen?
9. Welche Erweiterungen gelten offiziell als „über Mindestumfang“?
10. Welche Bildquellen/Lizenzen sollen im KI‑Teil genannt werden?

SCREENSHOT‑LISTE (Checkliste)
- [ ] 01-workflows.png — Abschnitt 3 Anforderungen & Umfang — Workflow‑Übersicht der Kernabläufe
- [ ] 02-sketches.png — Abschnitt 4.2 Sketch — Skizzen der Varianten (gut lesbar)
- [ ] 03-mockup.png — Abschnitt 4.3 Decide — Referenz‑Mockup der gewählten Variante
- [ ] 04-home.png — Abschnitt 4.4.1 Entwurf — Startseite mit Hero und Links
- [ ] 05-spots.png — Abschnitt 4.4.1 Entwurf — Spots‑Liste mit Favoriten‑Stern
- [ ] 06-map.png — Abschnitt 4.4.1 Entwurf — Karte mit Marker‑Layer
- [ ] 07-tour-planning.png — Abschnitt 4.4.1 Entwurf — Tour‑Planung mit Builder und Karte
- [ ] 08-route.png — Abschnitt 4.4.1 Entwurf — Route‑Seite mit Polylinie und Marker
- [ ] 09-validate-findings.png — Abschnitt 4.5 Validate — Ergebnisse/Findings (ggf. anonymisiert)
