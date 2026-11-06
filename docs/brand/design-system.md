# Design system — Afro Arab

## Direction

Warm Ghanaian modernism — luxurious but grounded. Architectural photography full-bleed, forest and sand materials, gold for proof accents, crimson CTAs sparingly. Not purple SaaS, not cream terracotta cliché, not generic glass dark-mode.

## Color tokens

```css
:root {
  --aa-forest-950: #0f1c16;
  --aa-forest-900: #15261d;
  --aa-forest-800: #1b3022;
  --aa-forest-700: #234032;
  --aa-forest-600: #2f5643;
  --aa-sand-50: #f7f4ef;
  --aa-sand-100: #efe8dc;
  --aa-sand-200: #e2d5c3;
  --aa-stone-500: #6e675d;
  --aa-ink: #14110f;
  --aa-red-600: #c4161c;
  --aa-red-700: #a31217;
  --aa-gold-500: #c4a35a;
  --aa-success: #1f7a4c;
  --aa-warning: #c47b1a;
  --aa-danger: #b42318;
  --aa-available: #1f7a4c;
  --aa-held: #c47b1a;
  --aa-reserved: #b45309;
  --aa-sold: #9b1c1c;
  --aa-unreleased: #6e675d;
}
```

Usage: forest for brand surfaces and headers; sand for page backgrounds; red for primary CTAs (<10% of surface); gold sparingly for awards/proof.

## Typography

- Display: **Fraunces** (expressive, architectural)
- Body/UI: **Manrope**
- Data/mono: **IBM Plex Mono** for plot IDs, prices, dimensions

Never Inter, Roboto, Open Sans, or Arial as display.

Scale (Tailwind-aligned):

| Role | Class | Notes |
| --- | --- | --- |
| Hero brand | `text-5xl`–`text-7xl` | Brand name can lead the first viewport |
| Page H1 | `text-4xl`–`text-5xl` | One H1 per page |
| Section H2 | `text-3xl` | |
| Body | `text-base` / `text-lg` | `text-wrap: pretty` |
| Meta/labels | `text-sm` / `text-xs` | Uppercase sparingly |

## Spacing & radius

Spacing steps: 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96  
Radius: controls `rounded-lg` (8–10px); large media may be square or slight radius; avoid pill-everything.

## Layout

- Max content width: 1200–1280px
- First viewport: brand + one headline + one supporting sentence + one CTA group + one full-bleed hero visual
- No card grids in the hero
- Cards only when they contain interaction (plot selection, form, filters)

## Motion grammar

| Layer | Behavior |
| --- | --- |
| Load | Mask-rise headlines, 80–120ms stagger, `cubic-bezier(0.22, 1, 0.36, 1)` |
| Scroll | One signature pin/reveal per page max; section-specific entrances |
| Micro | Magnetic CTAs, hover underlines, count-ups once |
| 3D | Camera/orbit only inside Plot Explorer / Walkthrough |

Rules:

- Animate `transform` / `opacity` only
- Native scroll remains source of truth
- `prefers-reduced-motion: reduce` → opacity fades only; no pin/zoom
- Touch: no scroll hijack; simplify choreography

## Imagery

- Real Accra/project photography and architectural renders
- Site-plan line drawings as SVG motifs
- Avoid stock skyline collage and generic glass towers

## Accessibility

- WCAG 2.2 AA contrast
- Focus rings: `outline: 2px solid var(--aa-red-600); outline-offset: 2px`
- Touch targets ≥ 44×44 CSS px
- Status never by color alone (pattern + text)
- One H1; unique form IDs; skip link
