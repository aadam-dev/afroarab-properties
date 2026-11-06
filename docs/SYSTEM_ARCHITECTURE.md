# 🏗️ Afro-Arab Properties — System Architecture & Engineering Blueprint

**System Version:** 2.0.0 (Executive Luxury Digital Platform)  
**Author:** Principal Creative Engineer & UI/UX Architect

---

## 1. High-Level Architecture Overview

The Afro-Arab Properties luxury platform is engineered as a high-performance Next.js App Router application delivering sub-second initial loads, client-side motion choreography, and reactive SVG / WebGL spatial engines.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js App Router                            │
│  ┌───────────────┬───────────────────┬───────────────────────────────┐ │
│  │   Homepage    │  Plot Explorer    │  Spatial Walkthrough & Calc   │ │
│  │ (Hero / Stats)│ (SVG Pan / Zoom)  │  (Three.js / 60-Month Engine) │ │
│  └───────┬───────┴─────────┬─────────┴───────────────┬───────────────┘ │
└──────────┼─────────────────┼─────────────────────────┼─────────────────┘
           │                 │                         │
           ▼                 ▼                         ▼
┌──────────────────┐ ┌───────────────────┐ ┌───────────────────────────┐
│  GSAP & Framer   │ │ Zustand Stores    │ │ WebGL / Three.js Canvas   │
│ Motion Engine    │ │ (Plots, Calc, Nav)│ │ (360° Spherical Walker)   │
└──────────────────┘ └───────────────────┘ └───────────────────────────┘
```

---

## 2. Tech Stack Breakdown

- **Core Framework:** Next.js (App Router, React 19, TypeScript strict mode)
- **Styling Architecture:** Tailwind CSS v4 + Radix UI semantic patterns + custom luxury glassmorphic utilities
- **Motion & Smooth Scroll:** Custom smooth scroll synchronization + Framer Motion staggered orchestration + GSAP ScrollTrigger patterns
- **Interactive Canvases:**
  - **Plot Explorer Engine:** Scalable SVG vector viewport with matrix pan/zoom, dynamic polygon mapping, sun altitude/azimuth calculation (via `suncalc`), and reactive state sync.
  - **Floor Plan Walkthrough:** Multi-level architectural blueprint vector walker + Three.js WebGL 360° Equirectangular spherical panorama inspector.
- **State Management:** Zustand (atomic stores with zero prop-drilling)
- **Validation & Form Submissions:** Zod schemas with Supabase client-server endpoints.

---

## 3. Global State Architecture (Zustand)

### 3.1. `usePlotStore` (`src/store/usePlotStore.ts`)
Manages plot inventory, filter state, active selection, and drawer visibility:
```typescript
interface PlotState {
  activeEstate: string;
  selectedPlotCode: string | null;
  statusFilter: "all" | "available" | "reserved" | "sold";
  sizeFilter: string | null;
  budgetRange: [number, number];
  searchQuery: string;
  facingFilter: "N" | "E" | "S" | "W" | null;
  viewMode: "plan" | "3d";
  isDrawerOpen: boolean;
  selectPlot: (code: string | null) => void;
  setStatusFilter: (status: "all" | "available" | "reserved" | "sold") => void;
  setSizeFilter: (size: string | null) => void;
  setBudgetRange: (range: [number, number]) => void;
  setSearchQuery: (query: string) => void;
  setDrawerOpen: (open: boolean) => void;
  resetFilters: () => void;
}
```

### 3.2. `useFloorPlanStore` (`src/store/useFloorPlanStore.ts`)
Controls architectural level transitions, room hotspot inspection, and interior finishes:
```typescript
interface FloorPlanState {
  activeLevel: "ground" | "upper" | "terrace";
  activeRoomId: string | null;
  activeFinish: "marble" | "hardwood";
  activeLighting: "daylight" | "sunset" | "ambient";
  isInspectionModalOpen: boolean;
  setLevel: (level: "ground" | "upper" | "terrace") => void;
  inspectRoom: (roomId: string) => void;
  closeInspection: () => void;
  setFinish: (finish: "marble" | "hardwood") => void;
  setLighting: (lighting: "daylight" | "sunset" | "ambient") => void;
}
```

### 3.3. `useCalculatorStore` (`src/store/useCalculatorStore.ts`)
Computes real-time amortization schedules, upfront discount rates, and PDF export data:
```typescript
interface CalculatorState {
  propertyPrice: number;
  currency: "USD" | "GHS";
  exchangeRate: number; // 1 USD = 15.5 GHS
  paymentMode: "installment" | "upfront";
  downPaymentPercent: number; // Default 40%
  tenorMonths: number; // Default 60 months
  calculateMonthlyInstallment: () => number;
  calculateUpfrontDiscount: () => number;
  calculateDownPaymentAmount: () => number;
}
```

---

## 4. Masterplan SVG Coordinate Mapping Engine

The Masterplan engine maps geographical plot surveys directly onto scalable SVG vector viewports:

1. **Coordinate Normalization:** Plots are defined by normalized 2D coordinate tuples `[ [x1, y1], [x2, y2], [x3, y3], [x4, y4] ]`.
2. **Dynamic Bounding Box:**
   ```typescript
   const bounds = useMemo(() => {
     const pts = plots.flatMap(p => p.polygon);
     const xs = pts.map(p => p[0]);
     const ys = pts.map(p => p[1]);
     return {
       minX: Math.min(...xs) - 8,
       maxX: Math.max(...xs) + 8,
       minY: Math.min(...ys) - 8,
       maxY: Math.max(...ys) + 8,
     };
   }, [plots]);
   ```
3. **Interactive Path Resolution:** Each plot is rendered as a standalone `<polygon>` with programmatic tabIndex, ARIA live updates, and click-to-open drawer triggers.

---

## 5. WebGL Spatial Walkthrough Architecture

The 360° Panorama modal leverages Three.js inside an HTML5 canvas:
- **Geometry:** Inverted Sphere geometry (`SphereGeometry(500, 60, 40)`) with `scale(-1, 1, 1)`.
- **Texture Generation:** Procedurally rendered luxury interior environment texture with realistic ambient occlusion, marble reflection maps, and dynamic lighting warmths.
- **Controls:** Intuitive touch/mouse orbit controls enabling diaspora buyers to pan 360° horizontally and 180° vertically.

---

## 6. Financial Calculation Formulae

- **Down Payment Amount:**
  $$\text{DownPayment} = \text{Price} \times \frac{\text{DownPaymentPercent}}{100}$$
- **Monthly Interest-Free Installment (60 Months):**
  $$\text{MonthlyPayment} = \frac{\text{Price} - \text{DownPayment}}{60}$$
- **Upfront Full-Payment Cash Incentive (10% Off):**
  $$\text{DiscountedPrice} = \text{Price} \times 0.90$$
  $$\text{ImmediateSavings} = \text{Price} \times 0.10$$
- **Interest Fee:**
  $$\text{InterestRate} = 0.00\% \quad (\text{Strictly Interest-Free})$$
