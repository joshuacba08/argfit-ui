# ArgFit Design System

## Company Context

**ArgFit** is an Argentine sports technology company that designs, manufactures, and distributes hardware and software for high-competition sports. Founded in 2017 in Buenos Aires, ArgFit serves 40+ institutions and 900+ athletes across 6 countries with millisecond-precision measurement tools.

### Product Lines
- **Hardware**: Inertial sensors, force platforms, encoders, photocells (ArgFit Jump, ArgFit Speed, ArgFit Light, ArgFit Smart)
- **Software**: Analysis platforms and mobile apps for coaches and athletes
- **Distribution**: Official distributor of elite international sports equipment

### Brand Mission
*"La ciencia del deporte merece tecnología real"* — Science-driven, data-first approach to sports technology, making elite-level tools accessible across Latin America.

### Timeline
- 2017: ArgFit Light (reaction lights)
- 2019: ArgFit Smart (cognitive training), ArgFit Jump (wireless jump platform)
- 2021: ArgFit Jump 2, ArgFit Light update
- 2023: CH1 Sports partnership
- 2025: ArgFit Speed (wireless photocells)
- 2026: Fusion with AIKO DEV (coach app ecosystem)

---

## Sources
- Brand images: Logo wordmark, logo icon (dark), product photo (ArgFit Jump)
- Figma reference: `Main File.fig` — fitness app template used as structural reference (colors/style replaced with ArgFit brand)
- Brand copy and timeline from company materials

---

## Content Fundamentals

- **Voice**: First person plural ("Creamos", "Diseñamos", "Somos")
- **Tone**: Technical-professional with passion undertone. Science meets sport. Confident but accessible.
- **Casing**: Sentence case for body text. UPPERCASE for brand/product names and display headings.
- **Language**: Spanish (primary market), English for international.
- **Tagline style**: Short, declarative. "La ciencia del deporte merece tecnología real."
- **Data emphasis**: Numbers are prominent (40+ institutions, 900+ athletes, 1ms precision).
- **No emoji** in UI. Clean, instrumental tone.
- **Technical terms**: Used freely — coaches and sports scientists are the audience.

---

## Visual Foundations

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2599D5` | Brand blue — buttons, links, active states |
| Accent | `#00D4FF` | Bright cyan — highlights, hover glow, data viz |
| Dark BG | `#0A1628` | Deep navy — main background (dark theme) |
| Surface-1 | `#0F1D32` | Cards, elevated elements |
| Surface-2 | `#152A42` | Secondary surfaces, inputs |
| Neutral-50–900 | Blue-tinted gray scale | Text, borders, dividers |

Full token definitions in `colors_and_type.css`.

### Typography
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Headings | Zalando Sans Expanded | 600–900 | Custom brand font. Exo 2 (Google Fonts) as web fallback |
| Body / UI | Outfit | 300–700 | Geometric, modern, excellent legibility |
| Monospace / Data | JetBrains Mono | 400–500 | Code, sensor readings, timestamps |

Display text is set UPPERCASE with tight tracking (`-0.02em`). Body text uses normal casing with `1.5` line-height.

### Spacing
4px base grid. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px. Moderate density — balanced between data visibility and breathing room.

### Border Radii
Mixed approach reflecting the brand's angular hardware + modern software:
- **Containers/Cards**: `8–12px` (slightly angular, tech feel)
- **Buttons/Chips**: `999px` (pill) or `8px` (rectangular)
- **Inputs**: `8px`
- **Avatars/Icons**: `50%` (circle)

### Shadows
Dark theme uses subtle shadows with blue tint. Primary glow effect (`0 0 24px rgba(37,153,213,0.25)`) for focused/active states. Light theme uses standard neutral shadows.

### Backgrounds
- Dark theme: Deep navy `#0A1628` with subtle gradient overlays
- Cards sit on `#0F1D32` with `rgba(37,153,213,0.10)` borders
- Decorative: Subtle diagonal lines or angular geometric patterns (inspired by hardware PCB traces) used sparingly in heroes and section dividers
- No gradients on buttons. Flat color with glow on hover.

### Borders
- Default: `1px solid var(--border)` — very subtle, `rgba` based
- Strong: `var(--border-strong)` for active/focused elements
- Focus rings: `2px solid var(--primary-400)` with glow shadow

### Motion & Animation
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` for most transitions (fast-out ease)
- **Spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy micro-interactions
- **Duration**: 120ms (fast hover), 200ms (normal), 350ms (slow/complex), 500ms (page transitions)
- **Hover states**: Subtle glow + slight translate-Y (-1px to -2px) on cards; brightness increase on buttons
- **Press states**: Scale down to 0.97, shadow reduction
- **Loading**: Pulse animation with primary-400 color
- **Entry animations**: Fade up (translate-Y 8px → 0) with stagger

### Imagery
- Product photography on dark backgrounds
- Cool-toned, high-contrast
- No stock photography in UI — use product shots or abstract tech patterns
- Data visualization: Blue-cyan palette, clean line charts preferred

---

## Iconography

- **Style**: Outline/linear for navigation and passive icons; filled for active/selected states
- **Stroke**: 1.5–2px, matching Lucide icon set conventions
- **Size**: 20px (nav), 24px (actions), 16px (inline)
- **Source**: Lucide Icons (CDN) — closest match to the clean, geometric brand aesthetic
  - CDN: `https://unpkg.com/lucide-static@latest/font/lucide.min.css`
- **No emoji** in the UI
- **Custom icons**: ArgFit product icons (devices) should be custom SVGs matching the outline style

---

## Frameworks

### Mobile — Ionic + Angular
- Component styling follows Ionic patterns: full-width cards, bottom tab navigation, floating action buttons
- iOS-style switches and segment controls
- Pull-to-refresh, swipe actions
- Safe area handling for notch devices

### Desktop — PrimeNG + Angular
- Sidebar navigation with collapsible groups
- Data tables with sort, filter, pagination
- Dialog modals, confirmations
- Toast notifications (top-right)
- Form layouts with floating labels

---

## File Index

```
├── README.md              ← This file
├── SKILL.md               ← Agent skill definition
├── colors_and_type.css    ← All CSS custom properties (tokens)
├── assets/
│   ├── logo-wordmark.png  ← ARGFIT wordmark (black)
│   ├── logo-icon-dark.png ← Logo icon on dark background
│   └── product-jump.png   ← ArgFit Jump product photo
├── preview/               ← Design System tab preview cards
│   ├── colors-primary.html
│   ├── colors-neutral.html
│   ├── colors-semantic.html
│   ├── colors-surfaces.html
│   ├── type-display.html
│   ├── type-body.html
│   ├── spacing-radii.html
│   ├── comp-buttons.html
│   ├── comp-inputs.html
│   ├── comp-cards.html
│   ├── comp-badges.html
│   ├── comp-toggles.html
│   ├── comp-navigation.html
│   ├── comp-toasts.html
│   └── brand-logo.html
└── ui_kits/
    ├── mobile/            ← Ionic-style mobile UI kit
    │   ├── index.html
    │   ├── README.md
    │   └── components.jsx
    └── desktop/           ← PrimeNG-style desktop UI kit
        ├── index.html
        ├── README.md
        └── components.jsx
```
