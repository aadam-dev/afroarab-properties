# 🏛️ Afro-Arab Properties — Brand Design System & Tokens
**Version:** 2.0.0 (Executive Luxury Release)  
**Target:** Afro-Arab Group & Afro-Arab Properties (Ghana & International Diaspora)

---

## 1. Brand Philosophy & Aesthetic Vision

Afro-Arab Properties is transitioning from standard regional development marketing into an executive-grade, institutional luxury real estate experience. The visual identity reflects architectural permanence, Ghanaian heritage, and cosmopolitan elegance.

- **Tone of Voice:** Authoritative, sophisticated, transparent, visionary.
- **Visual Tenets:** High-contrast deep slate foundations, warm brushed gold accents, champagne atmospheric undertones, optical glassmorphism, and cinematic spatial typography.

---

## 2. Color System & Semantic Tokens

### Core Luxury Palette
| Token Name | HEX | RGB | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Deep Slate** | `#080E14` | `rgb(8, 14, 20)` | Core application canvas, structural backdrops, dark panels |
| **Slate Surface Elevation** | `#101822` | `rgb(16, 24, 34)` | Floating cards, navigation bars, modal dialogs |
| **Royal Gold / Bronze** | `#C5A059` | `rgb(197, 160, 89)` | Primary brand accent, active state borders, highlight icons |
| **Gold Light** | `#DFC283` | `rgb(223, 194, 131)` | Hover states, glowing radiants, secondary accents |
| **Gold Deep** | `#9E7B36` | `rgb(158, 123, 54)` | Embossed text shadows, active borders, press states |
| **Champagne Light** | `#F4EFE6` | `rgb(244, 239, 230)` | Soft typographical contrast, secondary light backdrops |
| **Champagne Muted** | `#E2D9CC` | `rgb(226, 217, 204)` | Subtitle text, muted metadata, divider strokes |

### Inventory Status Tokens (Masterplan & Plot Explorer)
| Status | HEX | Meaning | Visual Cue |
| :--- | :--- | :--- | :--- |
| **Available** | `#00E676` | Prime inventory ready for reservation | Vibrant emerald pulse, 85% opacity fill |
| **Reserved** | `#FFB300` | Deposit in escrow / underwriting review | Warm amber glow, 75% opacity fill |
| **Sold Out** | `#374151` | Fully settled and allocated | Dark slate-zinc, subtle boundary line |
| **Unreleased** | `#6B7280` | Future phase masterplan zoning | 30% dashed boundary, neutral slate |

### Glassmorphic Tokens
- **Standard Card Surface:** `rgba(16, 24, 34, 0.75)` with `backdrop-blur-xl` and `1px border border-white/10`.
- **Active / Elevated Card:** `rgba(197, 160, 89, 0.08)` fill with `1px border border-[#C5A059]/40` and `backdrop-blur-2xl`.
- **Backdrop Overlay:** `rgba(8, 14, 20, 0.85)` with `backdrop-blur-md`.

---

## 3. Typography Scales

### Display / Serif (Headlines & Title Elements)
- **Primary Font Family:** *Fraunces* / *Playfair Display* / *Cormorant Garamond* (`font-display`)
- **Weights:** Light (300), Regular (400), SemiBold (600)
- **Usage:** Hero titles, estate titles, editorial statement openers, currency numerals in executive cards.

| Level | Size (rem / px) | Line Height | Tracking |
| :--- | :--- | :--- | :--- |
| **Display 2XL** | `4.5rem` / `72px` | `1.0` | `-0.03em` |
| **Display XL** | `3.5rem` / `56px` | `1.05` | `-0.025em` |
| **Display LG** | `2.75rem` / `44px` | `1.15` | `-0.02em` |
| **Display MD** | `2.0rem` / `32px` | `1.2` | `-0.015em` |
| **Display SM** | `1.5rem` / `24px` | `1.3` | `-0.01em` |

### Technical & UI (Body & Interactive Controls)
- **Primary Font Family:** *Plus Jakarta Sans* / *Manrope* (`font-sans`)
- **Tabular Font Family:** *IBM Plex Mono* (`font-mono-data`)
- **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)

| Level | Size (rem / px) | Line Height | Usage |
| :--- | :--- | :--- | :--- |
| **Body LG** | `1.125rem` / `18px` | `1.7` | Hero intro paragraphs, editorial lead copy |
| **Body MD** | `1.0rem` / `16px` | `1.6` | Standard description text, specification tables |
| **Body SM** | `0.875rem` / `14px` | `1.5` | Form labels, helper captions, secondary list items |
| **Eyebrow / Badge** | `0.75rem` / `12px` | `1.4` | Uppercase tracking `0.18em`, category badges |
| **Tabular Numbers**| `0.875rem` / `14px` | `1.2` | Plot dimensions, coordinate stamps, pricing |

---

## 4. Spacing, Grid & Responsive Layout Rules

- **Max Container Width:** `1600px` (`max-w-[1600px]`) for wide interactive canvases; `1280px` (`max-w-7xl`) for editorial sections.
- **Horizontal Margins:**
  - Mobile (`< 640px`): `16px` (`px-4`)
  - Tablet (`640px - 1024px`): `24px` (`px-6`)
  - Desktop (`> 1024px`): `32px` to `48px` (`px-8` to `px-12`)
- **Section Vertical Rhythm:**
  - Mobile: `64px` (`py-16`)
  - Desktop: `96px` to `128px` (`py-24` to `py-32`)
- **Responsive Breakpoints:**
  - `sm`: `640px` (Phone landscape / compact tablet)
  - `md`: `768px` (iPad portrait)
  - `lg`: `1024px` (Desktop / iPad Pro landscape)
  - `xl`: `1280px` (Standard desktop display)
  - `2xl`: `1536px` (Ultra-wide executive display)

---

## 5. Motion & Interaction Standards

1. **Scroll Performance:** Strict 60 FPS standard with hardware-accelerated transforms (`translate3d`, `will-change`).
2. **Transition Curves:**
   - Standard Ease: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy luxury decelerate).
   - Modal & Drawer: `cubic-bezier(0.22, 1, 0.36, 1)` over `400ms`.
3. **Interactive Feedback:**
   - All interactive controls provide immediate visual state changes (`hover:border-[#C5A059]`, `active:scale-[0.98]`).
   - SVG map polygons smoothly scale stroke width and brighten fill on hover.
