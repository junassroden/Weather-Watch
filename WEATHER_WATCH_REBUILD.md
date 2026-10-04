# Weather Watch — 3D Interface Rebuild

This rebuild replaces the deleted UI with a new scene-first weather experience.

## Core additions
- Native React/CSS 3D weather scene with atmospheric depth, volumetric cloud construction, sun/moon lighting, perspective rain/snow particles, fog layers, lightning flashes, pointer parallax, and reduced-motion support.
- New scene-first Dashboard.
- New selectable Forecast page with 24-hour temperature visualization.
- New full-screen RainViewer Radar page with playback, timeline, speed, precipitation layer and current-location recentering.
- New Alerts page separating official alerts from Weather Watch's forecast-derived risk model.
- New Locations page with search, current location, saved locations, and weather-scene transitions.
- Responsive mobile layout and radar controls.
- Dark navy weather palette requested in the brief.

## Run on Windows / Laragon
The uploaded ZIP included platform-specific `node_modules` from Windows. Because the rebuild workspace is Linux, that copied Vite/Rolldown binary cannot be used here for a production compile.

From the project directory on your Windows machine:

```bash
rmdir /s /q node_modules
npm install
npm run dev
```

Then run Laravel as you normally do in Laragon. No new JavaScript dependency was added by this rebuild; the 3D system uses native React, CSS perspective and Canvas so it does not depend on Three.js/WebGL packages.
