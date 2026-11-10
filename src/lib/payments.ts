/**
 * Interest-free instalment maths shared by the payment calculator and the plot
 * panel. Afro Arab advertises interest-free schedules; exact terms are agreed
 * with sales, so every figure shown from here is labelled indicative.
 */
export type InstalmentPlan = {
  price: number;
  depositPercent: number;
  deposit: number;
  months: number;
  monthly: number;
  /** Rounding remainder carried by the final instalment. */
  finalInstalment: number;
};

export function instalmentPlan(price: number, depositPercent: number, months: number): InstalmentPlan {
  const deposit = Math.round((price * depositPercent) / 100);
  const balance = price - deposit;
  if (months <= 0) {
    return { price, depositPercent, deposit: price, months: 0, monthly: 0, finalInstalment: 0 };
  }
  const monthly = Math.floor(balance / months / 10) * 10;
  const finalInstalment = balance - monthly * (months - 1);
  return { price, depositPercent, deposit, months, monthly, finalInstalment };
}

/**
 * Land plot options: deposit share and tenor in months. Afro Arab publishes a
 * 40% deposit with the balance over up to 24 months at 0% interest for all lands.
 */
export const LAND_PLAN_OPTIONS = {
  deposits: [40, 60] as const,
  months: [12, 24] as const,
  defaultDeposit: 40,
  defaultMonths: 24,
};
