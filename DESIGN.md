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
---

# Design System: WeatherWatch

## Overview

**Creative North Star: "Synoptic Instrument Desk"**

WeatherWatch is a dark, operational weather workspace: an ink-black ground, paper-white readings, cyan telemetry, and a single amber signal for attention. DM Sans carries the readable interface voice; IBM Plex Mono marks measurements, labels, timestamps, and data-state language. Hairline rules and square modules create the feeling of a calibrated observation room without decorative chrome.

The shipped topology makes the decision sequence visible: the persistent Weather Desk rail and header establish navigation and location, the dashboard leads with current conditions and the hourly strip, then risk, alerts, metrics, outlook, and radar follow. Forecast, Satellite & Radar, Weather History, and Alerts & Safety reuse the same ruled surfaces and explicit status vocabulary. Real Open-Meteo and RainViewer data remain distinguishable from unavailable, loading, partial, or application-generated information.

**Key Characteristics:**
- Ink-black instrument ground with cool paper readings.
- Cyan is telemetry and interaction; amber is attention; red is severity; green is clear/live state.
- Hairline rules, square panels, dense tabular readings, and restrained depth.
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

### Named Rules
**The Readout Rule.** Put confirmed measurements and time-like values in IBM Plex Mono; reserve DM Sans for meaning, explanation, and navigation.

**The Compact Label Rule.** Labels stay short, uppercase, mono, and low-contrast so they orient dense modules without competing with the reading.

## Layout

The desktop shell is a sticky 74px header above a two-column workspace: a 220px sticky Weather Desk rail and a flexible content region. At widths below 1100px the rail narrows to 184px and the header's full navigation hides behind a menu control. Main dashboard surfaces are constrained to `min(1180px, calc(100% - 64px))`; general pages use a `min(1380px, calc(100% - 56px))` container. Dashboard content starts with 42px top padding; general page content uses 48px top and 72px bottom padding.

At 720px and below, the workspace becomes a single column, the rail becomes a 5-item icon bar with a bottom rule, and the header wraps to a compact 68px utility row plus a full-width search row. The hourly strip remains a six-column horizontal scroller with 82px columns. Forecast grids reduce to two columns; metric, overview, and radar grids remain two columns; the live map drops from 560px to 460px high. At 430px and below, the current reading stacks vertically, satellite command modules become one column, and compact controls shrink to 34px where implemented.

The spacing rhythm is based on 4px increments, with recurring 8px gaps, 12-20px module padding, 30-42px section separation, and 48px page breathing room. Grid modules use shared top and left rules so adjacent panels read as one instrument table rather than separate floating cards.

## Elevation & Depth

This is a flat-by-default system. Depth comes from dark tonal layering (`deep`, `sidebar`, `panel`, `raised`) and hairline borders, not card shadows. The one functional shadow is the search-results popover (`0 16px 30px rgba(0,0,0,.3)`), which separates a transient result list from the header. Map overlays use opaque dark fills and strong rules so controls remain legible over imagery.

### Named Rules
**The Flat Instrument Rule.** Keep modules flush, square, and ruled at rest; use tonal layering only when a surface is interactive or overlays live imagery.

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
- **Background:** `panel` for data modules; transparent ground for the hourly section's outer wrapper.
- **Border:** 1px `rule`, with shared grid borders collapsed by edge placement.
- **Internal Padding:** 13-22px for readings and cards; 17-20px for larger alert and map modules.
- **Behavior:** Weather metrics, forecast days, satellite intelligence, risk, alerts, history empty state, and loading states share the same restrained ruled container language.

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

## Do's and Don'ts

### Do:
- **Do** use the existing custom properties in `resources/js/app.css` as the source of truth.
- **Do** keep the visual hierarchy in the order of location, current conditions, forecast sequence, risk/alerts, supporting metrics, then radar/history context.
- **Do** use real provider names and source notes where data comes from Open-Meteo, RainViewer, Esri imagery, or WeatherWatch assessment logic.
- **Do** preserve explicit strings such as `Loading forecast...`, `History API not connected`, `UNAVAILABLE`, and `Not an official emergency warning` when data is incomplete or generated.
- **Do** maintain keyboard-visible cyan focus treatment and respect `prefers-reduced-motion: reduce`.
- **Do** use icons as compact functional marks and pair unfamiliar icon-only controls with an accessible label or title.

### Don't:
- **Don't** introduce rounded cards, pill controls, glass surfaces, gradients, or decorative shadows into this system.
- **Don't** turn unavailable or estimated values into visually confident readings.
- **Don't** use amber, red, or green as general decoration; they carry attention and state meaning.
- **Don't** replace the desktop observation rail and mobile utility bar with generic marketing navigation.
- **Don't** hide provider, loading, permission, error, or alert provenance behind ambiguous empty space.
- **Don't** add a second display typeface or a competing mono treatment without revisiting the instrument hierarchy.
