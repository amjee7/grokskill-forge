import Stripe from 'stripe';

// Server-side only Stripe client
// This file should only be imported in server components, route handlers, or server actions.

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia', // Use a recent stable version
  typescript: true,
});

/**
 * Helper to format price for display
 * @param priceCents - price in smallest currency unit (cents for USD)
 */
export function formatPrice(priceCents: number): string {
  if (priceCents === 0) return 'Free';
  return `$${(priceCents / 100).toFixed(2)}`;
}

/**
 * Convert USD dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}
