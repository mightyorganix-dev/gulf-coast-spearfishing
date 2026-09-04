/**
 * Cloudflare Worker — Stripe Checkout Session for 30% charter deposits.
 *
 * Deploy:
 *   1. npx wrangler secret put STRIPE_SECRET_KEY
 *   2. Optional: npx wrangler secret put SITE_ORIGIN  (e.g. https://yoursite.github.io)
 *   3. npx wrangler deploy  (from worker/ with wrangler.toml)
 *
 * Env:
 *   STRIPE_SECRET_KEY  — sk_test_... or sk_live_... (never commit)
 *   SITE_ORIGIN        — public site origin for success/cancel URLs (optional)
 *   CORS_ORIGIN        — allowed browser origin (defaults to *)
 */

const DEPOSIT_PERCENT = 0.3;

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (request.method === 'GET' && (path === '/' || path === '/health')) {
      return json({ ok: true, service: 'gulf-coast-checkout' }, 200, cors);
    }

    if (
      request.method === 'POST' &&
      (path === '/' ||
        path.endsWith('/create-checkout-session') ||
        path === '/api/create-checkout-session')
    ) {
      return createCheckoutSession(request, env, cors);
    }

    return json({ error: 'Not found' }, 404, cors);
  },
};

async function createCheckoutSession(request, env, cors) {
  const secret = env.STRIPE_SECRET_KEY;
  if (!secret || secret.includes('REPLACE') || secret.includes('YOUR_')) {
    return json({ error: 'STRIPE_SECRET_KEY is not configured on the worker.' }, 500, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400, cors);
  }

  const {
    bookingId,
    tripTitle,
    tripTypeId,
    captainId,
    captainName,
    customerName,
    customerEmail,
    customerPhone,
    tripDate,
    startTime,
    passengerCount,
    totalAmount,
    depositAmount,
    successPath,
    cancelPath,
  } = body || {};

  const total = Number(totalAmount);
  const deposit =
    depositAmount != null
      ? Number(depositAmount)
      : Math.round(total * DEPOSIT_PERCENT * 100) / 100;

  if (!customerEmail || !Number.isFinite(deposit) || deposit <= 0) {
    return json(
      { error: 'customerEmail and a positive depositAmount (or totalAmount) are required.' },
      400,
      cors
    );
  }

  const amountCents = Math.round(deposit * 100);
  if (amountCents < 50) {
    return json({ error: 'Deposit must be at least $0.50 USD.' }, 400, cors);
  }

  const siteOrigin = (env.SITE_ORIGIN || body.siteOrigin || '').replace(/\/$/, '');
  const success = successPath || '/itinerary.html';
  const cancel = cancelPath || '/booking.html';
  const successUrl = siteOrigin
    ? `${siteOrigin}${success.startsWith('/') ? success : `/${success}`}?id=${encodeURIComponent(bookingId || '')}&session_id={CHECKOUT_SESSION_ID}`
    : `${success}?id=${encodeURIComponent(bookingId || '')}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = siteOrigin
    ? `${siteOrigin}${cancel.startsWith('/') ? cancel : `/${cancel}`}`
    : cancel;

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', successUrl);
  params.set('cancel_url', cancelUrl);
  params.set('customer_email', String(customerEmail));
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', 'usd');
  params.set('line_items[0][price_data][unit_amount]', String(amountCents));
  params.set(
    'line_items[0][price_data][product_data][name]',
    `Charter deposit — ${tripTitle || 'Gulf Coast Spearfishing'}`
  );
  params.set(
    'line_items[0][price_data][product_data][description]',
    `30% deposit for ${tripDate || 'charter'} (${passengerCount || 1} divers). Balance due before departure.`
  );
  params.set('metadata[bookingId]', String(bookingId || ''));
  params.set('metadata[tripTypeId]', String(tripTypeId || ''));
  params.set('metadata[tripTitle]', String(tripTitle || ''));
  params.set('metadata[captainId]', String(captainId || ''));
  params.set('metadata[captainName]', String(captainName || ''));
  params.set('metadata[customerName]', String(customerName || ''));
  params.set('metadata[customerEmail]', String(customerEmail || ''));
  params.set('metadata[customerPhone]', String(customerPhone || ''));
  params.set('metadata[tripDate]', String(tripDate || ''));
  params.set('metadata[startTime]', String(startTime || ''));
  params.set('metadata[passengerCount]', String(passengerCount || ''));
  params.set('metadata[totalAmount]', String(total || ''));
  params.set('metadata[depositAmount]', String(deposit));

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    return json(
      {
        error: session?.error?.message || 'Stripe Checkout Session creation failed.',
        details: session?.error || null,
      },
      stripeRes.status >= 400 ? stripeRes.status : 502,
      cors
    );
  }

  return json({ id: session.id, url: session.url }, 200, cors);
}

function corsHeaders(env) {
  const origin = env.CORS_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...cors,
    },
  });
}
