# DeskBooking

## Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Verwendete Technologien](#verwendete-technologien)
3. [Projektumfang](#projektumfang)
4. [API Dokumentation](#api-dokumentation)
5. [Features](#features)
   - [Login / Registrierung](#login--registrierung)
   - [Homescreen](#homescreen)
   - [Buchungsplan](#buchungsplan)
   - [Reservierungen](#reservierungen)
   - [Favoriten](#favoriten)
   - [Profil](#profil)
   - [Administration](#administration-nur-für-user-mit-adminrechten-zugänglich)
6. [Installation und Setup](#installation-und-setup)
   - [Voraussetzungen](#voraussetzungen)
   - [Schritte zur Installation](#schritte-zur-installation)
   - [Anwendung starten](#anwendung-starten)
7. [Projektstruktur](#projektstruktur)

## Projektübersicht

Das DeskBooking System ist eine WebApp, die es Mitarbeitern einer Firma ermöglichen soll, Arbeitsplätze in verschiedenen Räumen anzuzeigen und zu buchen. Die App bietet Funktionen für das Buchen von FlexDesk- und das Anfragen von FixDesk-Arbeitsplätzen, die Verwaltung von Buchungen und die Administration von Räumen und Arbeitsplätzen.

## Verwendete Technologien

- **React**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **React Query**
- **React Hook Form**
- **Yup**
- **Classnames**
- **React Datepicker**

## Projektumfang

Das Projekt wurde im Zeitraum vom 22.07. bis 09.08.2024 als Gruppenprojekt in 2er Teams als Abschlussprojekt des Zertifikatlehrganges "Web Development" an der Coding School & Academy Wörthersee umgesetzt.

## API Dokumentation

Die WebApp ist an folgende API angebunden:

- **Swagger Dokumentation**: [API Docs](https://deskbooking.dev.webundsoehne.com/api/docs)
- **Postman Import**: [API Docs JSON](https://deskbooking.dev.webundsoehne.com/api/docs-json)

## Features

### Login / Registrierung

- Benutzer können sich registrieren und einloggen.
- Nach erfolgreichem Login wird der Anmeldetoken lokal gespeichert, um den Benutzer eingeloggt zu halten.

### Homescreen

- Homescreen von dem aus alle Bereiche der WebApp annavigiert werden können.

### Buchungsplan

- Anzeige aller verfügbaren Offices.
- Bei Klick auf ein Office erhält man eine Übersicht aller Tische mit Kennzeichnung für gebuchte FlexDesks und FixDesks.
- Tische können in der Übersichtsansicht als Favoriten markiert und wieder entfernt werden.
- Bei noch nicht gebuchten Tischen besteht die Möglichkeit, eine Detailseite aufzurufen, von der aus der gewählte Tisch gebucht werden kann.
  - Eine Buchung von FlexDesks ist direkt durch den Benutzer möglich.
  - Buchungen von FixDesks müssen durch einen Admin bestätigt werden.

### Reservierungen

- Auflistung aller aktuellen und vergangenen Reservierungen.
- Feedbackfunktion für abgelaufene Reservierungen, um Mängel zu melden.

### Favoriten

- Anzeige aller favorisierten Tische des angemeldeten Benutzers.
- Verfügbare Arbeitsplätze können direkt aus den Favoriten gebucht werden.

### Profil

- Möglichkeit zum Bearbeiten der Profildaten.
- Benutzer können sich ausloggen.

### Administration (nur für User mit Adminrechten zugänglich)

- Anzeige von Benutzerkommentaren.
  - Möglichkeit gelesene Kommentare zu löschen
- FixDesk-Buchungen können bestätigt oder abgelehnt werden.
- Neue Büroräume können hinzugefügt werden.
- Neue Tische können hinzugefügt werden.

## Installation und Setup

### Voraussetzungen

- Node.js
- npm

### Schritte zur Installation

1. Repository klonen:

   HTTPS:

   ```bash
   https://github.com/christina-sfmn/Deskbooking.git
   ```

2. Verzeichnis wechseln:
   ```bash
   cd Deskbooking
   ```
3. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

### Anwendung starten

1. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```
2. Die Anwendung ist nun unter `http://localhost:5500` verfügbar.

## Projektstruktur

- `public/` - Statische Dateien, die direkt vom Server bedient werden
- `screendesign/` - Screendesign
- `src/`
  - `assets/` - Bilder und Icons
  - `components/` - Seitenkomponenten
  - `hooks/` - Custom Hooks
  - `App.tsx` - Hauptkomponente der Anwendung
  - `index.css` - Globale CSS-Datei
  - `main.tsx` - Einstiegspunkt der Anwendung, Setup für React Router & React Query
  - `routes.tsx` - Definition der Anwendungsrouten
  - `types.ts` - Typendefinitionen für TypeScript
  - `utils.ts` - Funktionen zur Formatierung des Datums ins ISO & EU-Format
  - `vite-env.d.ts` - TypeScript Deklarationen für Vite
- `.eslintrc.cjs` - Konfigurationsdatei für ESLint
- `.gitignore` - Dateien und Verzeichnisse, die von Git ignoriert werden sollen
- `index.html` - Haupt-HTML-Datei der Anwendung
- `package-lock.json` - Abhängigkeitsbaum, der von npm generiert wird
- `package.json` - Projektkonfigurationsdatei, listet Abhängigkeiten und Skripte auf
- `postcss.config.js` - Konfigurationsdatei für PostCSS
- `README.md` - Projektbeschreibung und -dokumentation
- `tailwind.config.js` - Konfigurationsdatei für Tailwind CSS
- `tsconfig.json` - Konfigurationsdatei für TypeScript
- `tsconfig.node.json` - Zusätzliche TypeScript-Konfiguration für Node.js-spezifische Einstellungen
- `vite.config.ts` - Konfigurationsdatei für Vite
