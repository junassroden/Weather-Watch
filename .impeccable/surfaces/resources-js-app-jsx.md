---
version: 1
slug: "resources-js-app-jsx"
primary_target: "resources/js/App.jsx"
related_targets: ["resources/js/app.css","resources/js/weather-log.css","resources/js/components/Header.jsx","resources/js/components/LocationSearch.jsx","resources/js/components/LiveWeatherMap.jsx","resources/js/components/WeatherEnvironment.jsx","resources/js/components/ForecastExperience.jsx","resources/js/pages/Dashboard.jsx","resources/js/pages/CurrentWeather.jsx","resources/js/pages/Forecast.jsx","resources/js/pages/SatelliteRadar.jsx","resources/js/pages/WeatherHistory.jsx","resources/js/pages/AlertsSafety.jsx"]
---

## Scope
Operate-mode redesign of WeatherWatch home and shared navigation, preserving all existing routes, Open-Meteo data, location search/geolocation, RainViewer/Esri map behavior, risk assessments, alerts, and explicit unavailable states.

## THESIS
WeatherWatch is a local weather record that answers practical questions in the order people ask them. It refuses the side-by-side dashboard and hidden time-range tabs; today’s weather and what happens next read as one continuous, scannable sequence.

## OWN-WORLD
A calm daylight observation log: clear mineral-white surfaces, charcoal text, weather-sky blue for active readings, and semantic amber/red/green only for conditions. Numeric readings use tabular figures with a subtle fixed-cell discipline; labels remain plain language. Rules and spacing do the grouping. Weather SVGs are semantic marks; one restrained, condition-driven atmospheric field gives the current reading depth. Glass is limited to search, the primary weather surface, and map controls.

## STORY
A first-time visitor identifies the selected place and update state, understands the temperature, condition and feels-like reading, then scans coming hours, today and tomorrow. An explicit alert state precedes grouped useful measurements and daylight times; the map follows with its imagery and radar layers identified. Search, retry, navigation, and map controls remain familiar and keyboard accessible. Missing values stay visibly unavailable.

## FIRST VIEWPORT
A compact labeled top navigation keeps Current, Forecast, Map, History, and Alerts visible, with location search beside it. The content begins with city, region when available, local time and update status. A wide, quiet weather surface pairs the largest stable temperature with a smaller provided condition SVG, condition text, feels-like value and today’s high/low. The next-hours timeline follows immediately and remains visible without a tab or route change; rain probability and current hour are explicit. Mobile uses this same question order, with horizontal forecast scrolling and no page overflow.

## FORM
Grounded candidate three: the local observer’s field log, selected under direction seed 93e7f0d0. The seven-segment challenger is declined because its glowing technical face weakens approachability; retain its disciplined, stable numeric alignment only. Structure is one ordered observation record, not a card grid. The signature action is changing location from the visible masthead and seeing all readings update together. Motion is a slow environment-only condition crossfade, with reduced motion honored. Unresolved: city/region and freshness are shown only where the real service supplies enough information.

## FINISH
unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
