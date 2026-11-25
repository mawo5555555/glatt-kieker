# Glatt-Kieker

Glätte- und Wetterschätzung für eine frei wählbare Strecke in Deutschland. Die Strecke wird in Abschnitte geteilt und je Abfahrtszeit grün, orange oder rot bewertet. Dazu gibt es das Wetter auf einen Blick.

> **Keine amtliche Warnung.** Siehe [DISCLAIMER.md](DISCLAIMER.md). Früher Prototyp, die Regeln sind nicht an Messwerten geprüft.

**Aktuelle Version:** 1.0 (siehe [CHANGELOG.md](CHANGELOG.md))

## Nutzen
- **iPhone:** In Safari öffnen, auf „Teilen“ tippen, „Zum Home-Bildschirm“ wählen.
- **Android:** Im Browser „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.

## Technik
Statische Web-App (HTML, JavaScript, Leaflet). Der Browser ruft direkt ab: Orte (Nominatim), Route (OSRM), Wetter (Open-Meteo, DWD ICON). Es gibt keinen Server und keine Nutzerdaten im Projekt.

## Datenquellen und Lizenzen
- Wetterdaten: [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0), Modelle des Deutschen Wetterdienstes (ICON)
- Karte und Orte: © OpenStreetMap-Mitwirkende (ODbL)
- Routing: OSRM / FOSSGIS
- Start und Ziel gehen an die Dienste Nominatim und OSRM.

## Lizenz
MIT, siehe [LICENSE](LICENSE).
