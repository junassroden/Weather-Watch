---
name: WeatherWatch
description: A synoptic instrument desk for current weather, forecast sequence, risk, alerts, and radar.
colors:
  ink: "#101820"
  deep: "#0a1016"
  panel: "#17242d"
  raised: "#1d2d37"
  paper: "#edf2ef"
  soft: "#c3d0cf"
  muted: "#8da0a5"
  faint: "#60747b"
  rule: "rgba(183,211,213,.18)"
  strong: "rgba(183,211,213,.34)"
  cyan: "#75d4d2"
  cyan-deep: "#287d85"
  amber: "#f2b35f"
  red: "#ee7c73"
  green: "#83cf9b"
  sidebar: "#0d171e"
  map-ground: "#13252b"
typography:
  display:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "clamp(32px, 4vw, 58px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  reading:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1
rounded:
  none: "0px"
  dot: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  section: "42px"
  page: "48px"
components:
  button-utility:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.soft}"
    rounded: "{rounded.none}"
    padding: "0 11px"
    size: "38px"
  button-emergency:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 13px"
  input-search:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 11px"
    height: "38px"
  ruled-module:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "16px"
  active-nav:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "9px 11px"
  weather-scene:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.cyan}"
    rounded: "{rounded.none}"
    size: "180px x 150px"
---

# Design System: WeatherWatch

## Overview

**Creative North Star: "Synoptic Instrument Desk"**

WeatherWatch is a dark, operational weather workspace: an ink-black ground, paper-white readings, cyan telemetry, and a single amber signal for attention. DM Sans carries the readable interface voice; IBM Plex Mono marks measurements, labels, timestamps, and data-state language. Hairline rules and square modules create the feeling of a calibrated observation room without decorative chrome.

The shipped topology makes the decision sequence visible: the persistent Weather Desk rail and header establish navigation and location, the dashboard leads with current conditions and the hourly strip, then risk, alerts, metrics, outlook, and radar follow. Forecast, Satellite & Radar, Weather History, and Alerts & Safety reuse the same ruled surfaces and explicit status vocabulary. Real Open-Meteo and RainViewer data remain distinguishable from unavailable, loading, partial, or application-generated information.

**Key Characteristics:**
- Ink-black instrument ground with cool paper readings.
- Cyan is telemetry and interaction; amber is attention; red is severity; green is clear/live state.
- Hairline rules, square panels, dense tabular readings, and selective glass depth.
- CSS-rendered, condition-driven weather scenes with explicit neutral loading state.
- Weekly forecast cards use the daily WMO code to set their atmospheric environment.
- Persistent desktop observation rail; compact utility navigation on small screens.
- Loading, unavailable, permission, error, provider, and disclaimer states are written plainly.

## Colors

The palette is cool, low-glare, and functional. Contrast comes from tonal separation between the deep ground, panel surfaces, paper readings, and thin cyan-tinted rules.

### Primary
- **Telemetry Cyan** (#75d4d2): Active navigation marks, weather icons, focus rings, live controls, map controls, and data accents.
- **Deep Cyan** (#287d85): Active control borders where a quieter cyan signal is needed.

### Secondary
- **Signal Amber** (#f2b35f): Attention, sunrise/sunset readings, emergency action, and watch-level weather states.
- **Clear Green** (#83cf9b): Low-risk, clear, and live indicators.
- **Severity Red** (#ee7c73): High or severe risk and error-state emphasis.

### Neutral
- **Deep Ground** (#0a1016): Page background and primary instrument ground.
- **Ink** (#101820): Dark foreground for amber emergency actions.
- **Panel Blue-Black** (#17242d): Ruled modules, controls, cards, and navigation surfaces.
- **Raised Panel** (#1d2d37): Hovered search results and raised interaction state.
- **Sidebar Ink** (#0d171e): Desktop rail and footer band.
- **Map Ground** (#13252b): Map canvas fallback beneath live imagery.
- **Paper White** (#edf2ef): Headings, confirmed readings, and primary copy.
- **Soft Paper** (#c3d0cf): Supporting copy and secondary readings.
- **Muted Slate** (#8da0a5): Descriptions, inactive navigation, and helper text.
- **Faint Slate** (#60747b): Metadata, disclaimers, mono labels, and low-priority state text.
- **Hairline Rule** (rgba(183,211,213,.18)): Module borders, separators, and grid lines.
- **Strong Rule** (rgba(183,211,213,.34)): Focus-adjacent borders and map/control frames.

### Named Rules
**The Signal Economy Rule.** Cyan communicates telemetry and interaction; amber, red, and green communicate state. Do not use accents as decoration.

**The Explicit State Rule.** A value that is loading, unavailable, permission-blocked, provider-dependent, or application-generated must say so in text rather than looking like a confirmed reading.

## Typography

**Display Font:** DM Sans (with `ui-sans-serif, sans-serif`)
**Body Font:** DM Sans (with `ui-sans-serif, sans-serif`)
**Label/Mono Font:** IBM Plex Mono (with `ui-monospace, monospace`)

**Character:** DM Sans keeps headings and utility copy compact and legible. IBM Plex Mono turns numbers, timestamps, status labels, sources, and control readouts into instrument markings.

### Hierarchy
- **Display** (700, `clamp(32px, 4vw, 58px)`, `1.02`): Page and dashboard titles with tight tracking (`-0.035em`).
- **Headline** (700, `20px`, `1.2`): Section titles such as Weather Now, Forecast Hourly, and Current Weather Risk.
- **Title** (700, `17-18px`, approximately `1.2`): Current condition descriptions, risk headings, and alert headings.
- **Body** (400, `14px`, `1.6`): Explanatory copy, descriptions, and service messages.
- **Label** (400, `9-10px`, `0.1em`, uppercase): Eyebrow and source labels in IBM Plex Mono.
- **Reading** (500, `15-104px`, `1`): Weather measurements and key numeric outputs in IBM Plex Mono; the current temperature is fluid and can reach `104px`.

Compact mono labels and the fluid current reading are intentional density exceptions: labels remain small and instrument-like, while the current temperature is allowed to dominate the current-conditions row without changing the broader type ramp.

### Named Rules
**The Readout Rule.** Put confirmed measurements and time-like values in IBM Plex Mono; reserve DM Sans for meaning, explanation, and navigation.

**The Compact Label Rule.** Labels stay short, uppercase, mono, and low-contrast so they orient dense modules without competing with the reading.

**The Density Exception Rule.** Compact IBM Plex Mono labels and the fluid current reading (`clamp(58px, 8vw, 104px)`) are deliberate readout behaviors, not invitations to compress every text role.

## Layout

The desktop shell is a sticky 74px header above a two-column workspace: a 220px sticky Weather Desk rail and a flexible content region. At widths below 1100px the rail narrows to 184px and the header's full navigation hides behind a menu control. Main dashboard surfaces are constrained to `min(1180px, calc(100% - 64px))`; general pages use a `min(1380px, calc(100% - 56px))` container. Dashboard content starts with 42px top padding; general page content uses 48px top and 72px bottom padding.

At 720px and below, the workspace becomes a single column, the rail becomes a 5-item icon bar with a bottom rule, and the header wraps to a compact 68px utility row plus a full-width search row. The hourly strip remains a six-column horizontal scroller with 82px columns. Forecast grids reduce to two columns; metric, overview, and radar grids remain two columns; the live map drops from 560px to 460px high. At 430px and below, the current reading stacks vertically, satellite command modules become one column, and compact controls shrink to 34px where implemented.

The spacing rhythm is based on 4px increments, with recurring 8px gaps, 12-20px module padding, 30-42px section separation, and 48px page breathing room. Grid modules use shared top and left rules so adjacent panels read as one instrument table rather than separate floating cards.

## Elevation & Depth

This is a selectively glass system. The header, current reading, hourly strip, risk and alert surfaces, map shell, and weekly forecast cards use controlled translucency, restrained backdrop blur, translucent borders, and soft depth to establish hierarchy over the dark instrument ground. Other metric and utility modules remain opaque, square, and ruled. The search-results popover keeps the stronger transient shadow (`0 16px 30px rgba(0,0,0,.3)`), while the map shell and forecast cards use softer shadows. Map controls and overlays use opaque dark fills and strong rules so controls remain legible over imagery.

### Named Rules
**The Selective Glass Rule.** Use translucency and blur only for the named hierarchy surfaces: header, current reading, hourly strip, risk/alerts, map shell, and weekly forecast cards. Keep the rest of the desk opaque and ruled.

**The Soft Depth Rule.** Glass surfaces use controlled blur, translucent borders, and low-contrast shadows; never turn the operational desk into a uniformly glossy layer.

The weather visual is a bounded atmospheric depth system. Its CSS perspective (`520px`) and `preserve-3d` scene stack create small volumes inside the glass hierarchy without introducing a general card-shadow language. Forecast environments expand that scene behind weekly cards at reduced opacity and scale.

## Shapes

The shipped surface is square: primary modules, navigation states, cards, alerts, buttons, and map frames use `border-radius: 0`. Circular geometry is reserved for status dots, the location marker, and the marker pulse. Controls are stable rectangles, typically 34px or 38px square, with 1px rules. No pill language is part of the current system.

## Components

### Buttons
- **Shape:** Square with a 1px rule (`border-radius: 0`); utility icon buttons are 38px square, 34px at the smallest viewport.
- **Utility:** Panel fill, soft-paper icon/text, hairline border, and cyan focus outline with 3px offset.
- **Emergency:** Amber fill, ink text, IBM Plex Mono at 11px and 600 weight, `10px 13px` padding; always reads as an action for immediate help.
- **Hover / Focus:** Navigation and controls use a panel/raised tonal shift; all buttons use the shared 2px cyan `:focus-visible` outline.

### Inputs / Fields
- **Style:** The location search is a 210px by 38px panel field with a 1px hairline border, 11px horizontal padding, a search icon, and 12px DM Sans text.
- **Focus:** The input itself has no browser outline; the shared focus-visible outline applies to the input when keyboard focused.
- **Results:** Search results appear in a panel popover 8px below the field, with a strong border, 5px outer padding, 9px result padding, and a transient shadow.

### Cards / Containers
- **Corner Style:** Square (`0px`).
- **Background:** `panel` for ordinary data modules; translucent panel layers for the named glass hierarchy.
- **Border:** 1px `rule` or translucent white/cyan-tinted rules, with shared grid borders collapsed by edge placement.
- **Internal Padding:** 13-22px for readings and cards; 17-20px for larger alert and map modules.
- **Behavior:** Weather metrics and utility states remain restrained ruled containers. Risk, alerts, the map shell, and weekly forecast cards may use soft glass depth; weekly cards place a WMO-driven atmospheric environment behind readable content.

### Navigation
- **Desktop:** A sticky header pairs the WeatherWatch mark, current route links, location search, locate action, and alerts action. The dashboard adds a sticky 220px Weather Desk rail with labeled links, support/settings utilities, and a watcher identity chip.
- **Active / Hover:** Header and rail links become paper-colored with a panel fill and hairline border; the current rail icon becomes cyan.
- **Mobile:** Header navigation collapses behind a menu button. The dashboard rail becomes a compact five-icon row with labels hidden, while search and utility actions occupy a wrapped header row.

### Risk Assessment
- **Character:** A full-width ruled assessment panel separates current status, message, recommendation, and disclaimer.
- **State:** Low uses green; high and severe use red; unavailable remains explicit as `UNAVAILABLE` and keeps the application-generated disclaimer.
- **Boundary:** The component distinguishes WeatherWatch's assessment from official emergency warnings.

### Live Weather Map
- **Character:** A framed operational map with provider attribution, layer controls, a locate control, radar loading/error overlay, and a time scrubber.
- **State:** RainViewer radar frames, Open-Meteo context, and missing telemetry are shown as separate readings. Overlay controls use opaque ink fills to preserve legibility over imagery.

### Condition-Driven Weather Scene
- **Purpose:** `WeatherVisual` is a dependency-free React/CSS scene used for current and forecast conditions. It maps Open-Meteo WMO codes to `clear`, `partly`, `overcast`, `fog`, `drizzle`, `rain`, `showers`, `snow`, and `storm`; null or undefined data maps to neutral `unknown`.
- **Composition:** The bounded visual uses CSS perspective and irregular, volumetric `cloud-volume-back`, `cloud-volume-mid`, and `cloud-volume-front` masses with separate depth and cloud shadow. Clear and partly clear states use atmospheric sun orbs; night adds a moon orb. Fog, drizzle, rain, showers, and snow use dedicated particle fields with varied scale, opacity, delay, blur, and fall speed to imply depth. Storms add a restrained flash, lightning bolt, and heavy rain. Clear and partly states also carry animated wind traces.
- **Forecast environment:** `ForecastCard` derives a weather type from each daily WMO code and renders that same environment behind the card content, so the weekly sequence is atmospheric without losing the readable temperature and precipitation readings.
- **Loading / unknown:** Before API weather data arrives, the scene remains neutral: it renders the scan orb and `Waiting for conditions` accessible label, with no sun, cloud, precipitation, or storm implication. Unsupported non-null codes fall back to the overcast visual and `Variable conditions` label as implemented.
- **Accessibility:** The visual wrapper is a labelled `role="img"` using the condition label; internal scene layers and particles are `aria-hidden`. Header search, navigation, and icon actions expose accessible labels. The global reduced-motion rule collapses animation and transition duration to `.01ms`, limits iterations, and disables smooth scrolling when `prefers-reduced-motion: reduce` is enabled.

### Named Rules
**The Neutral Loading Scene Rule.** Never imply a weather condition before API data arrives; unknown and loading are a neutral state with explicit text, not a guessed sky.

**The Weather Volume Rule.** Keep dimensionality inside the weather visual's bounded CSS scene; the surrounding instrument desk remains square, ruled, and flat by default.

**The Atmospheric Forecast Rule.** Let the actual daily WMO code choose the weekly card environment; never use a generic decorative sky for an unknown forecast.

## Do's and Don'ts

### Do:
- **Do** use the existing custom properties in `resources/js/app.css` as the source of truth.
- **Do** keep the visual hierarchy in the order of location, current conditions, forecast sequence, risk/alerts, supporting metrics, then radar/history context.
- **Do** use real provider names and source notes where data comes from Open-Meteo, RainViewer, Esri imagery, or WeatherWatch assessment logic.
- **Do** preserve explicit strings such as `Loading forecast...`, `History API not connected`, `UNAVAILABLE`, and `Not an official emergency warning` when data is incomplete or generated.
- **Do** maintain keyboard-visible cyan focus treatment and respect `prefers-reduced-motion: reduce`.
- **Do** use icons as compact functional marks and pair unfamiliar icon-only controls with an accessible label or title.
- **Do** use the condition-driven CSS weather scene for WMO-backed visual context, including its atmospheric sun/moon, irregular volumetric cloud, varied-depth particle, restrained storm, and wind layers.
- **Do** apply glass selectively to the header, current reading, hourly strip, risk/alerts, map shell, and weekly forecast cards, with controlled blur, translucent borders, and soft depth.
- **Do** keep compact mono labels and current-reading scale as intentional density exceptions; preserve readable labels and data state language around them.
- **Do** keep unknown/loading weather neutral and expose the condition through the visual's accessible label.

### Don't:
- **Don't** introduce rounded cards, pill controls, or glass treatment into surfaces outside the named hierarchy; the weather scene's gradients and atmospheric effects are bounded native exceptions.
- **Don't** turn unavailable or estimated values into visually confident readings.
- **Don't** use amber, red, or green as general decoration; they carry attention and state meaning.
- **Don't** replace the desktop observation rail and mobile utility bar with generic marketing navigation.
- **Don't** hide provider, loading, permission, error, or alert provenance behind ambiguous empty space.
- **Don't** add a second display typeface or a competing mono treatment without revisiting the instrument hierarchy.
- **Don't** add Three.js, canvas, or another rendering dependency to the weather scene; the shipped implementation is CSS-based and dependency-free.
- **Don't** make a loading scene look clear, cloudy, rainy, or severe before weather data is available.
- **Don't** make weekly forecast environments contradict their daily WMO code or let atmospheric layers reduce the legibility of the card readings.
