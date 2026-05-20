---
name: argfit-design
description: Use this skill to generate well-branded interfaces and assets for ArgFit, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping sports technology interfaces (mobile Ionic + desktop PrimeNG).
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick Reference

### Brand
- **Company**: ArgFit — Sports technology (hardware + software) from Argentina
- **Industry**: High-competition sports, sensor technology, performance analysis
- **Audience**: Coaches, sports scientists, athletes

### Colors
- Primary: `#2599D5` (brand blue)
- Accent: `#00D4FF` (bright cyan)
- Dark BG: `#0A1628` (deep navy)
- Surfaces: `#0F1D32`, `#152A42`, `#1C3550`
- Success: `#00C853` | Warning: `#FFB300` | Error: `#FF3D71`
- Full token definitions in `colors_and_type.css`

### Typography
- Display / Headings: `Zalando Sans Expanded` (fallback: `Exo 2` from Google Fonts)
- Body / UI: `Outfit` (Google Fonts)
- Monospace / Data: `JetBrains Mono` (Google Fonts)
- Headings are UPPERCASE with tight tracking (-0.02em)

### Key Patterns
- Dark theme default (blue-tinted navy backgrounds)
- Border radii: 8-12px cards, 8px inputs, 999px pills for buttons
- Shadows: Subtle with blue glow on hover/focus
- Motion: ease-out (0.22, 1, 0.36, 1), 200ms default
- Icons: Lucide-style outline (1.8px stroke)

### Frameworks
- Mobile: Ionic + Angular (bottom tabs, full-width cards, segment controls)
- Desktop: PrimeNG + Angular (sidebar nav, data tables, dialog modals)

### Assets Available
- `assets/logo-icon-dark.png` — Logo icon on dark background
- `assets/logo-wordmark.png` — ARGFIT wordmark
- `assets/product-jump.png` — ArgFit Jump product photo

### UI Kits
- `ui_kits/mobile/` — Ionic-style mobile prototype (Home, Training, Results)
- `ui_kits/desktop/` — PrimeNG-style desktop prototype (Dashboard, Athletes, Devices, Reports, Settings)
