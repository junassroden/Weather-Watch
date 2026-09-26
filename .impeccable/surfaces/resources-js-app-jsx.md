---
version: 1
slug: "resources-js-app-jsx"
primary_target: "resources/js/App.jsx"
related_targets: ["resources/js/app.css","resources/js/components/Header.jsx","resources/js/pages/Dashboard.jsx","resources/js/pages/Forecast.jsx","resources/js/pages/SatelliteRadar.jsx","resources/js/pages/WeatherHistory.jsx","resources/js/pages/AlertsSafety.jsx"]
---

# WeatherWatch Whole UI Direction Contract

## Scope
Operate-mode redesign of the shared WeatherWatch shell and the Dashboard, Forecast, Satellite/Radar, Weather History, and Alerts/Safety routes. Preserve all existing data services, location flows, map behavior, route navigation, and real Open-Meteo/RainViewer data.

## THESIS
WeatherWatch becomes a Synoptic Instrument Desk: a weather decision workspace that behaves like a calibrated observation room rather than a generic card dashboard. It refuses the category-default hero metric plus decorative weather cards by making location, data freshness, current conditions, forecast sequence, and risk status one readable operating surface.

## OWN-WORLD
The world uses an ink-black instrument ground, warm paper-white readings, measured cyan for active telemetry, and a single signal amber reserved for risk and attention. Hairline grid rules, tabular numerals, compact sans labels, and quiet chart-like bands create meteorological structure without decorative glass or fake technical chrome. Navigation is a persistent index rail on wide screens and a compact utility bar on small screens.

## STORY
A visitor confirms the place first, reads the live condition as the main instrument, scans the next hours and days as a continuous forecast record, then checks risk and official alerts before deciding what to do. Current, forecast, map, history, and safety routes share the same observation vocabulary. Loading, missing, partial, offline, and error states expose data status plainly and never impersonate weather.

## FIRST VIEWPORT
The first viewport opens with a compact WeatherWatch masthead, location search, and live data-status signal. Below it, the selected location and last update sit beside the dominant current-condition readout. A forecast strip runs directly beneath the reading, while the risk/alert state occupies a visible adjacent band on desktop and moves immediately below the current reading on mobile. Secondary metrics and the radar map follow without competing with the decision sequence.

## FORM
Primary form: calibrated synoptic desk, grounded candidate five, seed key dfdf38d5, assigned direction. Raised disciplines: discrete state changes from the paper-fold challenger, explicit relationships from the tensegrity challenger, and strong active/inactive contrast from the cathode and segment challengers. The system must scale across dense forecast data, quiet empty states, maps, alerts, and future route surfaces.

## FINISH
unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
