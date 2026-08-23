// Sampled verbatim from https://efn.co.ke/fitness-studio/ "Membership Plans" section
// and the "Choose Plan" dropdown on the membership signup popup (same on every page).

export interface MembershipPlan {
  id: string;
  name: string;
  priceKes: number;
  period?: string;
}

export const membershipPlans: MembershipPlan[] = [
  { id: 'daily', name: 'Daily Pass', priceKes: 400 },
  { id: 'monthly', name: 'Monthly Pass', priceKes: 4000 },
  { id: 'quarterly', name: 'Quarterly Pass', priceKes: 10500 },
  { id: 'half-year', name: 'Half Year Pass', priceKes: 20000 },
  { id: 'annual', name: 'Annual Pass', priceKes: 36000 },
  { id: 'couples-monthly', name: 'Couples Monthly Pass', priceKes: 7500 },
];
