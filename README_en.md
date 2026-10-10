# PJSK_LH

> Project SEKAI card personal collection gallery · Offline web version

[中文](README.md)

A **purely static, offline-capable** card collection gallery for *Project SEKAI: Colorful Stage!* (プロジェクトセカイ / Project SEKAI). No backend, no build step — just open the page to browse your card collection and filter it quickly by unit, character, and card type.

🌐 Live demo: https://a39yile.github.io/PJSK_LH/

## ✨ Features

- **Card gallery**: **76 cards** organized into the six main units
  - Leo/need · MORE MORE JUMP! · Vivid BAD SQUAD · Wonderlands×Showtime · 25时，在Nightcord见 (25-ji, Nightcord de.) · Virtual Singers
- **Multi-dimensional filtering**: combine filters by *keyword / card type / unit / character*
  - Card types: Permanent (常驻), Limited (期间限定), WL Limited (WL限定), BFES, CFES, Collaboration Limited (联动限定), Birthday (生日)
- **Shareable filter state**: filter conditions are synced to the URL (`pushState`), so you can copy the link to share and they survive a page refresh
- **Collapsible unit sections**: tap the top icon bar to expand / collapse a unit
- **Dual-view routing**: `#home` (gallery) and `#mine` ("About" / My page) switch without a page reload via hash routing
- **Card detail view**: tap a card to see the full image with a two-line info bar (card name / type / character); tap the character name to jump to the corresponding unit
- **Safe external-link interstitials**: all outbound links go through `external.html` for a confirmation step, and only `http/https` is allowed (blocks `javascript:` injection)
- **Light / Dark theme**: supports light and dark modes, remembers your preference (localStorage), and adapts to system preference and in-app WebViews
- **Responsive layout**: optimized for both mobile and desktop

## 📊 Collection Overview

| Unit | Cards |
|---|---|
| MORE MORE JUMP! | 21 |
| Virtual Singers | 14 |
| Leo/need | 12 |
| Wonderlands×Showtime | 11 |
| Vivid BAD SQUAD | 9 |
| 25时，在Nightcord见 | 9 |
| **Total** | **76** |

## 🗂 Directory Structure

```
PJSK_LH/
├── index.html          # Home page (card gallery)
├── mine.html           # "About" view (character external links)
├── detail.html         # Card detail / full-image page
├── external.html       # External-link confirmation interstitial
├── app.js              # Core home logic (filtering / URL sync / routing / rendering)
├── script.js           # Theme-switching logic
├── style.css           # Styles
├── data/
│   ├── zy_data.js      # Card data: cardsData (76 cards)
│   ├── gy_data.js      # "About" page link data: linkData
│   └── data.zip        # Data bundle
└── icon/               # Card images, unit icons, character portraits, background, etc.
```

## 🚀 Running Locally

This is a fully static site with **no dependencies to install**. Pick either option:

**Option 1: Local static server (recommended)**

```bash
# Run from the project root using Python
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

**Option 2: Open directly**

Double-click `index.html` to open it in a browser. Some browsers restrict loading scripts over `file://`; if the page appears blank, use Option 1 instead.

## 📝 Maintaining the Data

All content lives in the data files — **edit the data, not the page logic**:

- **Add / edit cards**: edit the `cardsData` array in `data/zy_data.js`. Each entry contains:

  ```js
  {
    "group": "Leo/need",                 // Unit
    "character": "天马咲希",              // Character name
    "type": "常驻",                      // Card type
    "card_name": "谢意满满！",            // Card name
    "image": "icon/Leoneed/1098.webp"    // Image path
  }
  ```

- **Edit "About" page links**: edit the `linkData` array in `data/gy_data.js` (character → pjsk.moe profile, etc.).

> Tip: after changing data and redeploying, bump the version query string (`?v=xxxxxx`) on the script tags in `index.html` to avoid browsers serving cached old data.

## 🛠 Tech Stack

- Pure **HTML + CSS + JavaScript** (vanilla, no framework, no bundler)
- No backend, no database — runs fully offline
- Deployment: GitHub Pages

## 📦 Deployment

The repository has GitHub Pages enabled; pushing to the `main` branch publishes automatically:

- Live URL: https://a39yile.github.io/PJSK_LH/

## ⚠️ Copyright Notice

*Project SEKAI: Colorful Stage!* and its related characters, cards, and artwork are the property of **SEGA / Crypton Future Media** and other rightful owners.

This project is a **non-commercial fan work for personal collection / study purposes**. All game assets are used solely to display a personal collection and must not be used for commercial purposes. If any rightful owner raises an objection, the relevant content will be removed promptly.
