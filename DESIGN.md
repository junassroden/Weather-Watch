---
name: WeatherWatch
description: A clear local weather record for current conditions, forecasts, risk, and map context.
colors:
  canvas: "#edf2f1"
  canvas-secondary: "#e4eceb"
  panel: "#f8faf9"
  panel-raised: "#ffffff"
  surface-sunken: "#e7eeed"
  hairline: "#ccd8d6"
  hairline-strong: "#aebfbd"
  text-primary: "#1d3035"
  text-secondary: "#4e6266"
  text-muted: "#64777a"
  accent: "#167d89"
  status-good: "#287754"
  status-moderate: "#8d5c08"
  status-high: "#a65318"
  status-severe: "#a3312c"
  glass-primary: "rgba(248, 250, 249, 0.9)"
  glass-secondary: "rgba(248, 250, 249, 0.78)"
  glass-float: "rgba(248, 250, 249, 0.96)"
typography:
  display:
    fontFamily: "Avenir Next, Segoe UI, sans-serif"
    fontSize: "clamp(1.55rem, 2.4vw, 2.05rem)"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "normal"
  headline:
    fontFamily: "Avenir Next, Segoe UI, sans-serif"
    fontSize: "1.18rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Avenir Next, Segoe UI, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  reading:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "clamp(5.5rem, 10vw, 8.25rem)"
    fontWeight: 450
    lineHeight: 0.92
    letterSpacing: "normal"
rounded:
  none: "0px"
  sm: "3px"
  md: "4px"
  lg: "6px"
  full: "999px"
  reading: "5px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  section: "34px"
  page: "48px"
components:
  button-location:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "42px"
  input-search:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "0 11px"
    height: "42px"
  active-nav:
    backgroundColor: "{colors.canvas-secondary}"
    textColor: "{colors.accent}"
    rounded: "{rounded.sm}"
    padding: "8px 13px"
  current-weather:
    backgroundColor: "{colors.glass-primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.reading}"
    padding: "26px 4vw"
  data-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.none}"
    padding: "13px 0"
---

# Design System: WeatherWatch

## Overview

**Creative North Star: "The Local Weather Record"**

WeatherWatch is a practical observation of the weather where someone is now. The interface reads like a calm, well-kept field log: the place and update state establish context, current conditions are unmistakable, and time-based forecasts follow in a continuous sequence. It is designed for people checking the weather while planning an ordinary day, not for interpreting a technical dashboard.

A single atmospheric scene gives the current reading physical depth without competing with its meaning. Real condition and measurement SVGs identify weather and data; typography, spacing, and rules do most of the organizing. Secondary routes retain the same navigation and state vocabulary for forecasts, map, history, and alerts.

**Key Characteristics:**
- Mineral-light ground, charcoal text, and one measured weather-blue interaction color.
- Tabular figures are reserved for temperatures, measurements, and times.
- Open information groups and fine dividers replace repeated metric cards.
- A restrained weather environment sits behind the current reading only.
- Location, forecast, risk, provider, and unavailable states are named in plain language.

## Colors

A daylight-neutral foundation keeps outdoor information legible, with weather blue for interaction and separate colors for risk severity.

### Primary
- **Weather Blue**: Active links, search focus, forecast probability, and the selected navigation state.

### Secondary
- **Clear Green**: A low-risk or clear state only.
- **Watch Ochre**: Moderate attention only.
- **High-Weather Rust**: High-risk state only.
- **Warning Red**: Severe alerts and errors only.

### Neutral
- **Mineral Canvas**: Main page background.
- **Pale Field**: Secondary surfaces and selected forecast states.
- **Clean Surface**: Search results and the primary weather reading.
- **Charcoal Ink**: Headings, confirmed values, and essential copy.
- **Slate Copy**: Supporting descriptions and secondary measurements.
- **Rule Gray**: Table and section dividers.

### Named Rules
**The Signal Economy Rule.** Weather blue means interaction; green, ochre, rust, and red retain severity meaning. Do not use status colors as decoration.

**The Explicit State Rule.** Loading, unavailable, permission-blocked, provider-dependent, and application-generated information is identified in words and never styled as a confirmed observation.

## Typography

**Display Font:** Avenir Next (with Segoe UI and sans-serif fallbacks)
**Body Font:** Avenir Next (with Segoe UI and sans-serif fallbacks)
**Label/Mono Font:** SFMono-Regular, Consolas, Liberation Mono, monospace

**Character:** A compact humanist sans keeps interface copy familiar. Tabular monospace is used only for weather readings and time, where stable digit widths improve comparison.

### Hierarchy
- **Display** (650, `clamp(1.55rem, 2.4vw, 2.05rem)`, `1.15`): Selected city and page-level names.
- **Headline** (650, `1.18rem`, `1.25`): Section headings such as Next 12 hours and Weather details.
- **Title** (600, `clamp(1.05rem, 1.65vw, 1.35rem)`): Current condition description.
- **Body** (400, `0.9rem`, `1.5`): Labels, explanations, and status copy.
- **Reading** (450, `clamp(5.5rem, 10vw, 8.25rem)`, `0.92`): Current temperature in the tabular data face; secondary readings use smaller proportional steps.

### Named Rules
**The Readout Rule.** Use the data face for measured values and timestamps; use the interface face for meaning, labels, and navigation.

## Layout

The shared header presents the WeatherWatch wordmark, five plainly labeled destinations, location search, and a named location action. Main content is constrained to 1240px with 32px desktop gutters. The current page orders content as location and local time, current conditions, the next twelve hours, rain outlook, daily forecast, notices, supporting measurements, daylight, then the map entry.

The Forecast route moves hourly and daily information before the current reading while retaining location context. The Map route keeps its interactive satellite and radar controls together; Alerts and History retain their existing functions and use the same system. At 1040px navigation and search wrap into two rows. At 720px the header and navigation become touch-friendly horizontal bands, forecasts scroll horizontally, and detail rows become a single column. At 390px the daily table preserves aligned day, condition, rain chance, low, and high values without page-level horizontal scrolling.

## Elevation & Depth

Most content sits directly on the page field and is grouped by whitespace and hairline rules. The current-weather surface is the only large elevated reading plane: a thin cool border, translucent light fill, restrained blur, and soft offset shadow separate it from the page while the real condition-driven environment remains behind the text. Search results and map controls rise only as transient or map-specific controls. The scene is decorative only in the sense of atmosphere; it is always selected from real weather data.

### Named Rules
**The One Atmosphere Rule.** Keep motion and dimensional depth inside the current weather environment; the information itself remains still.

**The Selective Glass Rule.** Glass is reserved for the current reading, location search/results, and controls over map imagery. Forecast rows, metric rows, labels, and notices remain flat.

## Shapes

The interface is predominantly square-edged, with small 3-6px corners reserved for the current reading (5px), search (3px), and a few framed surfaces. Data rows and dividers stay square. Status labels use a compact outlined rectangle, never a pill. No nested card treatment is used.

## Components

### Buttons
- **Shape:** Compact rectangles with a thin neutral rule and a small corner (3px).
- **Location:** The header action names “Use my location” beside its location symbol; map controls keep their existing accessible titles and map-specific behavior.
- **Hover / Focus:** Hover shifts the neutral surface. Keyboard focus uses a clearly visible 3px weather-blue outline with offset.

### Cards / Containers
- **Corner Style:** 5px for the primary weather surface; repeated forecast rows have no container shape.
- **Background:** The current reading uses the pale glass surface; data and forecast areas use the page field.
- **Shadow Strategy:** One soft, offset shadow on the current reading; no shadows on ordinary metric or forecast rows.
- **Border:** Thin mineral rules define the weather surface and separate list rows.
- **Internal Padding:** The current reading scales between 24px and 52px; rows use compact vertical spacing.

### Inputs / Fields
- **Style:** White search field with a 1px cool border, 3px corner, and visible search symbol.
- **Focus:** High-contrast weather-blue focus outline.
- **Results:** A white, bounded list directly below the field, with each option showing place and region/country.

### Navigation
- **Style:** Five persistent text links: Current, Forecast, Map, History, Alerts.
- **Active:** A pale blue-green fill, subtle border, and dark weather-blue text identify the current route.
- **Mobile:** The navigation remains labeled and horizontally scrollable instead of disappearing into an icon-only menu.

### Current Weather Record
- **Character:** One quiet, translucent surface pairs the fixed-width dominant temperature with a smaller condition SVG, condition name, feels-like value, and today's high and low.
- **Behavior:** The atmospheric scene and provided condition illustration follow the selected WMO condition; the measurement layout remains stable while data updates.

### Forecast Sequence
- **Hourly:** Twelve compact time columns with condition asset, temperature, and rain probability. The current hour receives a restrained filled state.
- **Daily:** Aligned rows expose day, condition, rain probability, low, and high under visible column labels.

### Weather Notices
- **Character:** Official provider status and WeatherWatch's application-generated risk are separate labeled rows.
- **State:** Severity uses text and status color. The risk disclaimer remains visible and distinguishes it from an official emergency alert.

### Map Entry
- **Character:** A simple, explicit link explains that the separate map page contains satellite imagery, recent rain radar, layer controls, and time controls.

## Do's and Don'ts

### Do:
- **Do** show the selected place and local update context before the temperature.
- **Do** keep feels-like and today's high/low beside current conditions.
- **Do** label each forecast value and keep rain probability beside its time period.
- **Do** use the provided weather SVGs for conditions and matching measurements.
- **Do** preserve real provider, loading, permission, risk, and unavailable states.
- **Do** respect reduced motion and keep the weather information stationary.

### Don't:
- **Don't** hide hourly conditions behind a tab on the Current page.
- **Don't** make every value an icon-and-number card.
- **Don't** use weather icon artwork as the only condition label.
- **Don't** imply that a disconnected official warning source has confirmed “no alerts.”
- **Don't** add motion to the page, forecast rows, or measurements.
