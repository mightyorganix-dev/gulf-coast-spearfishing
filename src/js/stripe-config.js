/**
 * Stripe Checkout client config (public values only).
 * Never put STRIPE_SECRET_KEY here — secrets belong in the Worker/API env.
 *
 * Flip `enabled` to true and set `checkoutEndpoint` to your deployed Worker
 * or Vercel/Cloudflare function URL once secrets are configured.
 */
export const stripeConfig = {
  /** When false, booking uses Reserve hold (localStorage) only. */
  enabled: false,

  /**
   * Serverless endpoint that creates a Stripe Checkout Session.
   * Examples:
   *   https://gulf-coast-checkout.YOUR_SUBDOMAIN.workers.dev
   *   https://your-site.pages.dev/api/create-checkout-session
   *   /api/create-checkout-session
   */
  checkoutEndpoint: 'https://YOUR_WORKER.workers.dev/api/create-checkout-session',

  /** Publishable key for future Elements use (Checkout redirect does not require it). */
  publishableKey: 'pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY',

  /** Deposit fraction of charter total (must match Worker). */
  depositPercent: 0.3,
};

/** True when online Stripe deposits are ready to call. */
export function isStripeCheckoutReady() {
  const endpoint = (stripeConfig.checkoutEndpoint || '').trim();
  if (!stripeConfig.enabled) return false;
  if (!endpoint) return false;
  if (/YOUR_WORKER|YOUR_SUBDOMAIN|example\.com|placeholder/i.test(endpoint)) return false;
  return true;
}

export default stripeConfig;
