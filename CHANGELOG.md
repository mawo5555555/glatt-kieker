# Änderungen

## Version 1.60 – 27.11.2026
- Neue Karte: Folgen-Knopf zoomt jetzt auch auf das stehende Auto (geneigt), beim Fahren folgt die Karte in Fahrtrichtung.
- Genauere Fahrbahntemperatur: Brücken (frieren früher) und Waldstücke (nachts etwas wärmer, morgens länger kalt) an der Strecke werden aus OpenStreetMap erkannt und berücksichtigt. Auch klare, windstille Nächte und Restwärme nach sonnigen Tagen fließen ein. Die Werte sind Faustwerte und werden mit den Messungen nachgestellt.
- Statt „Wettermodelle uneinig“ steht jetzt eine Wahrscheinlichkeit da, z. B. „Glätte möglich (20 %)“ oder „Glätte wahrscheinlich (70 %)“. Die Farben bleiben wie gewohnt.
- Regen oder Schnee in den nächsten 6 Stunden: Beginn auf die Viertelstunde genau („Schnee ab 14:15 Uhr“).
- Meldet jemand „Gestreut“, wird der Abschnitt dort für einige Stunden eine Stufe milder eingestuft (nicht bei Eisregen).
- Optionen: kurzer Wochenbericht mit Trefferquote, Fehlalarmen und Genauigkeit der Wettermodelle.

## Version 1.59 – 27.11.2026
- Neue Karte (Test): Statt des Kastens fährt jetzt ein echt wirkendes weißes 3D-Auto mit glänzendem Lack, getönten Scheiben und Rädern. Weicher Schatten darunter, nachts weiche Scheinwerferkegel und rot glimmende Rücklichter. Bei kleinem Zoom wird es größer gezeigt, damit man es sieht.
- Lädt das Modell nicht, erscheint wie bisher das einfache Auto.
- Auf schmalen Handys verdeckt die Zeitleiste den untersten Kartenknopf (⌖) nicht mehr.

## Version 1.58 – 27.11.2026
- Zeitleiste besser lesbar: Beschriftung unter dem Balken, Tageswechsel mit Wochentag und Trennstrich, „jetzt“ am Anfang.
- Neu zum Ausprobieren: „Neue Karte (Test)“ in den Optionen. Stufenlos zoombar, größere Ortsnamen, echte Nachtkarte, Strecke als ein Band mit Farbverlauf, gefährliche Stellen breiter.
- Während der Fahrt (Tesla live) neigt sich die neue Karte, das Auto steht im unteren Drittel und die Karte blickt in Fahrtrichtung. Ziehen löst das Folgen, der Kompass-Knopf holt es zurück, ⌖ zeigt die ganze Strecke.
- Auf der neuen Karte fährt ein kleines weißes 3D-Auto flüssig mit, nachts mit Scheinwerfern; eine Fahne zeigt Zustand und Außentemperatur.
- Die bisherige Karte bleibt Standard. Klappt die neue Karte auf einem Gerät nicht, schaltet die App von selbst zurück. Luftbild gibt es nur auf der alten Karte.

## Version 1.57 – 27.11.2026
- Tesla-Kopplung startet nur noch im Tesla-Browser von selbst. Am Mac/Tablet keine falschen „Ein Tesla möchte sich verbinden“-Fragen mehr; dort bei Bedarf in den Optionen „Tesla koppeln“.
- Ein Blick reicht: Statuskarte sagt groß „Frei“, „Vorsicht ab …“ oder „Glatt – später fahren“, bei Gelb/Rot mit der nächsten freien Uhrzeit.
- Neue farbige Zeitleiste über der Statuskarte: Stunde antippen wählt die Abfahrt, eigene Fahrzeiten sind markiert. Selten Gebrauchtes (Tesla, Statistik, Server) liegt in den Optionen unter „Weitere Einstellungen“.

## Version 1.56 – 27.11.2026
- Intern: Glätte-Berechnung in eigene Datei engine.js (App und Server nutzen dieselbe), automatische Tests für Regeln und Push-Zeitplan. Keine sichtbare Änderung.

## Version 1.55 – 27.11.2026
- Push nur noch zu den festen Zeiten aus dem Zeitplan; „Lage geändert“-Nachrichten entfallen (Schalter entfernt, Server sendet sie nicht mehr).

## Version 1.54 – 26.11.2026
- Zuverlässigkeit: Push meldet „Keine aktuellen Wetterdaten“, statt still auszufallen; Route wird im Server gespeichert; zweiter Routendienst in der App; Push-Protokoll und Serverzustand in den Optionen.
- Schneller: beide Wetterabfragen laufen gleichzeitig.

## Version 1.53 – 26.11.2026
- Wetterdaten werden nach 10 statt 40 Minuten neu geladen.

## Version 1.52 – 26.11.2026
- Nutzungsstatistik: anonyme Gerätezählung; Schalter „Das ist mein Gerät“ in den Optionen schließt eigene Geräte aus und zeigt die Statistik.

## Version 1.51 – 26.11.2026
- Karte: höchstens 2 Hinweise, nahe Abschnitte (< 3 km) zusammengefasst, Ortsname statt Ursache („! Vorsicht bei Löwenberg“), Ursache beim Antippen. Restglätte nur noch als Streckenfarbe.

## Version 1.50 – 26.11.2026
- Unten in der Statuszeile: „Stand HH:MM“ der Wetterdaten, ab 45 Min. Alter mit ⚠️ „veraltet“.

## Version 1.49 – 27.11.2026
- Schlitten fährt auf der Straße weiter (Tempo aus dem Tesla, auf die Route gelegt) statt stehen zu bleiben und zu springen.
- Schlitten klein in der Übersicht, wächst beim Heranzoomen.
- Kacheln unter den Uhrzeiten ausgeblendet.

## Version 1.48 – 26.11.2026
- „Modelle uneinig“ erscheint nur noch, wenn mindestens zwei Wettermodelle Frost (≤ 0,5 °C) melden. Eine einzelne abweichende Quelle löst keinen Hinweis mehr aus.

- Karte wieder Esri (CARTO verlangte plötzlich einen Schlüssel); Schlitten-Beschriftung links und zweizeilig, überdeckt die Knöpfe nicht mehr.

- Karte jetzt OpenStreetMap Deutschland (deutsche, größere Ortsnamen). Satellit nicht mehr zu hell, im Dunkelmodus nicht mehr invertiert, mit Ortsnamen darüber.

## Version 1.47 – 26.11.2026
- Schlitten gleitet flüssig zwischen den Positionen (statt Springen), Beschriftung seitlich: „Schlitten fährt / wartet / parkt“ (nicht mehr „Tesla“), hellere Karte (CARTO Voyager), schlankere Routenlinie.

## Version 1.46 – 25.11.2026
- Kartenhinweis „Wettermodelle uneinig“ wird nicht mehr abgeschnitten (kurz: „Modelle uneinig“).

## Version 1.45 – 25.11.2026
- Schlitten: Glitzerspur bei Fahrt, laufende Rentiere, Laterne bei Dunkelheit, Rudolfs Nase leuchtet/blinkt bei Glättewarnung, geparkt mit Schneedecke, weihnachtliche Texte (Dez./Anfang Jan.), optional leichter Schneefall auf der Karte (Optionen).
- Weihnachtsschlitten statt Auto-Symbol: Weihnachtsmann mit Geschenken, zwei Rentiere (eins mit roter Nase).
- Kontrolle mit Nutzermeldungen: Der Server prüft täglich die DWD-WarnWetter-Glättemeldungen im Umkreis der Strecke gegen die eigene Vorhersage (Trefferquote in den Optionen).

## Version 1.44 – 25.11.2026
- Kontrollschleife: Der Server vergleicht stündlich die Vorhersage mit Messwerten (DWD, Flughafen BER) und stellt nach 7 Tagen die Modellgewichte automatisch nach. Ergebnis in den Optionen.

## Version 1.43 – 25.11.2026
- Wettermodelle gemittelt (ICON, ECMWF, GFS), Warnung bei uneinigen Modellen.
- Regenradar (DWD): Kachel „Radar 2 Std." und Radar-Ebene auf der Karte.
- Fahrtrichtung folgen (Karte dreht sich), Vollansicht, neues Tesla-Symbol.
- Tesla-Temperatur wird mit der Prognose verglichen.

## Version 1.42 – 25.11.2026
- Abgelehnter Tesla-Schlüssel wird gelöscht, die Kopplung startet dann automatisch; Tesla-Browser wird auch am Namen erkannt.

## Version 1.41 – 25.11.2026
- Tesla verbindet sich ohne Tippen: Tesla zeigt automatisch einen Code, das iPhone fragt „Zulassen?" mit Code-Vergleich.

## Version 1.40 – 25.11.2026
- Tesla koppeln: Code im Tesla anzeigen, am iPhone eingeben, Schlüssel wird automatisch übertragen.

## Version 1.39 – 25.11.2026
- Kacheln verständlicher: „Niederschlag" (Wert „keiner" statt „trocken"), „Frost in 6 Std." mit tiefster Temperatur, z. B. „nein (3°)".

## Version 1.38 – 25.11.2026
- Karte automatisch dunkel nach Sonnenuntergang, hell bei Tageslicht (Option: immer dunkel / immer hell).

## Version 1.37 – 25.11.2026
- Dunkle Kartenansicht (Option „Kartenansicht"), standardmäßig an auf großen Bildschirmen (Tesla) und bei dunklem Systemmodus.

## Version 1.36 – 25.11.2026
- Tesla-Status in den Optionen zeigt, warum der Tesla nicht erscheint (Schlüssel, Server, Daten).

## Version 1.35 – 25.11.2026
- Neues App-Icon: Schneeflocke über Straße mit orangem Warnzeichen.

## Version 1.34 – 25.11.2026
- Benachrichtigungen (Push): morgens 5:00 Mo–Fr, 12:00 Mo/Di/Mi/Fr und Do 17:00 vor den Heimfahrten, dazu Meldung bei Änderung der Lage. Zeiten, Tage und Fahrt in den Optionen einstellbar, mit Test-Knopf.

## Version 1.33 – 25.11.2026
- Wetterdaten und Strecke werden auf dem Gerät zwischengespeichert (40 Min.). Weniger Abrufe beim Wetterdienst, schnellerer Start, kein Hängen mehr, wenn der Dienst sein Stundenlimit erreicht hat.
- Verständliche Meldung bei Stundenlimit des Wetterdienstes.

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
