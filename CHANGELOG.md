# Änderungen

## Version 1.32 – 25.11.2026
- Tesla-Standort alle 15 Sekunden neu geholt und sofort beim Zurückkehren in die App.

## Version 1.31 – 25.11.2026
- Logbuch in den Optionen (Fehler, Netz, Bedienung, mit Uhrzeit und Version), kopierbar.
- Schnellerer Start: der letzte Stand erscheint sofort, die Aktualisierung läuft danach.
- Bei Ladefehlern gibt es den Knopf „Erneut versuchen".

## Version 1.30 – 25.11.2026
- Strecke wird zwischengespeichert und bei Routing-Problemen erneut versucht. Die Karte hängt nicht mehr bei „Strecke wird geladen".

## Version 1.29 – 25.11.2026
- Warn-Schilder auf der Karte sitzen über der Straße und zeigen mit einem Strich auf die Stelle, die Straße bleibt sichtbar.
- Keine gestrichelte Luftlinie mehr hinter dem Tesla.

## Version 1.28 – 25.11.2026
- Neues Feld „Tesla live" in den Optionen: Tesla-Link oder Schlüssel einfügen. Nötig, weil die Home-Bildschirm-App den Link aus Safari nicht übernimmt.

## Version 1.27 – 25.11.2026
- Kein simuliertes Auto mehr, das hin und her fährt. Mit Tesla-Link zeigt die Karte nur den echten Tesla (fährt: "jetzt", sonst: "geparkt" mit Uhrzeit).

## Version 1.26 – 25.11.2026
- Neue Ansicht für große Bildschirme (z. B. Tesla-Display): größere Schrift und Kacheln links, Strecke rechts daneben, größere Karten-Knöpfe. Handy unverändert.

## Version 1.25 – 25.11.2026
- Glätte-Status als große Kachel unten auf der Karte, daneben Kachel „Optionen“.
- Unteres Fenster ist beim Öffnen ganz weg und kommt nur über die Kacheln (✕ schließt).
- Wetter-Kacheln größer mit Symbolen: Temperatur Start → Ziel, Regen/Schnee, Frost.
- Kopfleiste etwas tiefer, Titel besser lesbar.
- Strecke beim Öffnen größer und mittig zwischen Kopfleiste und Statuskachel.
- Echter Tesla auf der Karte (live beim Fahren, sonst letzter Standort) mit Außentemperatur.
- Meldeserver ist voreingestellt.

## Version 1.24 – 25.11.2026
- Vier Fahrt-Kacheln oben sichtbar, ohne Wischen.
- Neue Kachelzeile auf der Karte: Glätte, Temperatur Start/Ziel, Niederschlag, Frost (nächste 6 Std.).
- Unteres Fenster zeigt Optionen erst in der großen Stufe.

## Version 1.23 – 25.11.2026
- Titel und Fahrten-Chips in einer Kopfleiste auf der Karte, die nicht mehr abgeschnitten wird.
- Unteres Fenster zeigt im kleinen Zustand nur Ampel und Abfahrt. Frost-Warnung, Wetter, Strecken und Optionen erscheinen erst beim Hochziehen.
- Meldeknopf „Glätte melden“ (glatt oder gestreut) mit Standort. Meldungen der letzten 24 Std. auf der Karte. Adresse des Meldeservers unter Optionen.

## Version 1.22 – 25.11.2026
- Meine Fahrten (48 Std.) als Chips oben auf der Karte, Tippen wählt die Fahrt.
- Gefährliche Abschnitte werden direkt auf der Karte beschriftet (Vorsicht/Gefahr mit Grund).
- Kleine Sheet-Stufe zeigt ohne Begrüßung gleich die Ampel.

## Version 1.21 – 25.11.2026
- Karte im Mittelpunkt: Vollbild-Karte (verschiebbar, zoombar), Infos in einem Bottom-Sheet mit drei Stufen (klein, mittel, groß). Knöpfe für Richtung, Luftbild und Strecke zentrieren schweben über dem Sheet.

## Version 1.20 – 25.11.2026
- Das Tesla fährt die Strecke auf der Mini-Karte ab (Schleife, in Fahrtrichtung). Bei „Bewegung reduzieren“ steht es still.

## Version 1.19 – 25.11.2026
- Kartenstil: Esri World Street Map statt CARTO (CARTO verlangt inzwischen einen API-Schlüssel).

## Version 1.18 – 25.11.2026
- Mini-Karte im Stil von Google Maps (CARTO Voyager), Umschalter auf Luftbild (Esri).
- Neues, detailliertes weißes Tesla Model 3 (Glasdach, Lichter, Räder, Schatten) in Fahrtrichtung.
- Zielpin auf der Karte.

## Version 1.17 – 25.11.2026
- Mini-Karte überarbeitet: sauberer Streckenstrich mit Schatten, größeres Auto, das in Fahrtrichtung zeigt, kräftigere Kartenfarben.

## Version 1.16 – 25.11.2026
- Auto auf der Mini-Karte ist ein weißes Tesla Model 3 (Draufsicht).

## Version 1.15 – 25.11.2026
- Warnungen und Niederschlag werden jetzt an 8 bzw. 5 Punkten entlang der Strecke geprüft, nicht nur Start, Mitte, Ziel.

## Version 1.14 – 25.11.2026
- Amtliche Messung in der Nähe (DWD-Station Stechlin-Menz, über Bright Sky) unter der Wetterkachel.

## Version 1.13 – 25.11.2026
- Mini-Karte mit echten Kartenkacheln, Strecke farbig nach Abschnittsstatus.
- DWD-Warnungen erscheinen als ⚠️ auf der Mini-Karte (am jeweiligen Prüfpunkt, nicht genau am Ort der Warnung).

## Version 1.12 – 25.11.2026
- Strecken-Kacheln oben entfernt; stattdessen kleine Streckenkarte mit animierter Fahrtrichtung und Auto.
- „Richtung wechseln“ tauscht Start und Ziel für die Ansicht.
- Animationen: Einblenden der Karten, pulsierende Warnung bei Gefahr. Bei reduzierter Bewegung aus.

## Version 1.11 – 25.11.2026
- Nachhall: War es 1–2 Stunden vor der Fahrt glatt und liegt die Fahrbahn noch bei höchstens +1 °C, bleibt die Bewertung mindestens „Vorsicht“.

## Version 1.10 – 25.11.2026
- Name geändert in „Glätte-Kieker“.

## Version 1.9 – 25.11.2026
- Begrüßung je nach Tageszeit.
- Offline: letzter gespeicherter Stand wird mit Uhrzeit angezeigt, wenn das Netz fehlt.

## Version 1.8 – 25.11.2026
- Wetterfront wird nicht mehr als Text angezeigt, sondern fließt in die Bewertung ein (Stufe mindestens „Vorsicht“ ab Ankunft der Front).

## Version 1.7 – 25.11.2026
- Niederschlags-Vorschau für die nächsten 2 Stunden (15-Minuten-Modelldaten, Start/Mitte/Ziel).
- Wetterfront: Blick 50/100/150 km gegen die Höhenströmung (850 hPa), Hinweis auf heranziehenden Niederschlag oder Kaltluft.

## Version 1.6 – 25.11.2026
- DWD-Amtswarnungen (Glätte, Schnee, Frost, Nebel) entlang der Strecke, Quelle Bright Sky.

## Version 1.5 – 25.11.2026
- Gewählte Orte werden sofort gespeichert (vorher nur nach „Speichern“) und bleiben nach Updates erhalten; Speicher wird dauerhaft angefordert.
- „Strecke automatisch nach Uhrzeit wählen“ ist standardmäßig an; manuelles Antippen einer Strecke schaltet es nur für den Moment ab.

## Version 1.4 – 25.11.2026
- Neu: „Meine Fahrten“ – Status für die festen Pendelzeiten (Hin Mo–Fr 6:30; Rück Mo/Di/Mi/Fr 13:00, Do 17:00) der nächsten 48 Stunden mit Ampelfarbe; Tippen öffnet die Fahrt.

## Version 1.3 – 25.11.2026
- Liste „Abschnitte“ entfernt.

## Version 1.2 – 25.11.2026
- Kacheln transparenter, Hintergrund besser sichtbar.
- Startort heißt „Sonnenberg, Gransee“; keine Schnellwahl-Buttons mehr.

## Version 1.1 – 25.11.2026
- Neue Reihenfolge: Straßenstatus oben, dann Wetter auf einen Blick, Karte, Abschnitte; Ortswahl weiter unten.
- Ortssuche zeigt bis zu 8 Treffer mit Landkreis, Koordinaten und Kartenlink zur Auswahl.
- Zeitplan: Hinweg 0–10 Uhr (Sonnenberg → Oranienburg), Rückweg ab 10 Uhr; Wechsel automatisch, Zeiten und Orte änderbar.
- Einmalige Strecken (z. B. Hamburg) separat prüfbar.

## Version 1.0 – 25.11.2026
- Erste veröffentlichte Version.
- Frei wählbarer Start und Ziel in Deutschland (Orte über Nominatim, Route über OSRM).
- Glätte-Schätzung je Abschnitt (grün, orange, rot) mit Begründung, Abfahrt in den nächsten 48 Stunden, Fahrzeit je Abschnitt berücksichtigt.
- Wetter auf einen Blick (Start, Ziel, 24-Stunden-Verlauf).
- Karte (OpenStreetMap), animierter Wetter-Hintergrund, installierbar als PWA.
- Regeln sind Entwürfe und noch nicht an Messwerten geprüft.
