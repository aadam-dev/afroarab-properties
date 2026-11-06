import { create } from "zustand";

export interface Milestone {
  month: number;
  label: string;
  sharePercent: number;
  description: string;
}

export const PAYMENT_MILESTONES: Milestone[] = [
  {
    month: 0,
    label: "Initial Allocation & Substructure",
    sharePercent: 40,
    description: "Secures plot reservation, title registration filing, and site clearance.",
  },
  {
    month: 12,
    label: "Superstructure & Slab Completion",
    sharePercent: 12,
    description: "Reinforced concrete columns, ground and first floor slab casting.",
  },
  {
    month: 24,
    label: "Roofing & External Walling",
    sharePercent: 12,
    description: "Structural roof framing, masonry walling, and weatherproof barrier.",
  },
  {
    month: 36,
    label: "First-Fix MEP & Glazing",
    sharePercent: 12,
    description: "Electrical conduit wiring, plumbing piping, and solar glass windows.",
  },
  {
    month: 48,
    label: "Interior Finishes & Cabinetry",
    sharePercent: 12,
    description: "Flooring, wall plastering, designer sanitary ware, and kitchen installation.",
  },
  {
    month: 60,
    label: "Final Inspection & Key Handover",
    sharePercent: 12,
    description: "Final snagging clearance, municipal occupancy certification, and title deed handover.",
  },
];

interface CalculatorStoreState {
  propertyPrice: number;
  currency: "USD" | "GHS";
  exchangeRate: number; // 1 USD = 15.5 GHS
  paymentMode: "installment" | "upfront";
  downPaymentPercent: number; // default 40%
  tenorMonths: number; // 60 months
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  
  // Actions
  setPropertyPrice: (price: number) => void;
  setCurrency: (currency: "USD" | "GHS") => void;
  setPaymentMode: (mode: "installment" | "upfront") => void;
  setDownPaymentPercent: (percent: number) => void;
  setBuyerDetails: (details: { name?: string; email?: string; phone?: string }) => void;
  resetCalculator: () => void;
}

export const useCalculatorStore = create<CalculatorStoreState>((set) => ({
  propertyPrice: 120000,
  currency: "USD",
  exchangeRate: 15.5,
  paymentMode: "installment",
  downPaymentPercent: 40,
  tenorMonths: 60,
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",

  setPropertyPrice: (propertyPrice) =>
    set({ propertyPrice: Math.max(15000, propertyPrice) }),

  setCurrency: (currency) => set({ currency }),

  setPaymentMode: (paymentMode) => set({ paymentMode }),

  setDownPaymentPercent: (downPaymentPercent) =>
    set({ downPaymentPercent: Math.max(20, Math.min(80, downPaymentPercent)) }),

  setBuyerDetails: (details) =>
    set((state) => ({
      buyerName: details.name !== undefined ? details.name : state.buyerName,
      buyerEmail: details.email !== undefined ? details.email : state.buyerEmail,
      buyerPhone: details.phone !== undefined ? details.phone : state.buyerPhone,
    })),

  resetCalculator: () =>
    set({
      propertyPrice: 120000,
      currency: "USD",
      paymentMode: "installment",
      downPaymentPercent: 40,
      tenorMonths: 60,
    }),
}));

export function formatCurrencyAmount(
  amountUsd: number,
  currency: "USD" | "GHS",
  rate = 15.5,
) {
  if (currency === "GHS") {
    const val = Math.round(amountUsd * rate);
    return `GH¢${val.toLocaleString("en-GH")}`;
  }
  return `$${Math.round(amountUsd).toLocaleString("en-US")}`;
}
