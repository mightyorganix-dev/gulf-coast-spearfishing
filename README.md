# Gulf Coast Spearfishing Charters

Premier static web app for Gulf Shores and Orange Beach. Quiet-luxury redesign with client-side localStorage booking.

## Quick start

    npm install
    npm run dev
    npm run build
    npm run preview

Output: dist/

## Stack
- Vite multi-page, vanilla HTML/CSS/JS
- Shared layout: src/js/layout.js
- Single store: src/js/store.js

## Pages
index, booking, captain, admin, itinerary, about, faq, what-to-bring, red-snapper-season, species, lionfish, safety, contact, reviews

## Functionality
- Keys: gs_boats, gs_captains, gs_trips, gs_gear, gs_bookings
- 5-step booking; validates name/email/phone/cert/signature
- Deposit Step 5: Stripe Checkout when configured; otherwise Reserve hold (localStorage)
- Captain weather+SMS; admin stats; itinerary lookup

## Sensory hooks
1. Caustics on home/booking (caustics.js); prefers-reduced-motion
2. Opt-in ambient audio; never autoplay unmuted; Web Audio noise+LFO royalty-safe; gs_ambient_sound ~18%
3. Logo ripple easter egg

## Known gaps
- Payment: Stripe Checkout via serverless Worker (disabled by default); no email/SMS yet; static forecast; verify ADCNR/NOAA; localStorage per-browser

## Stripe deposit checkout (static + serverless)

GitHub Pages is static, so secret keys never ship in the browser. The client opens Stripe Checkout via a small serverless endpoint.

### 1. Get Stripe keys (test mode first)

1. Create an account at the Stripe Dashboard
2. Developers → API keys
3. Copy Publishable key pk_test_... and Secret key sk_test_...
4. Never commit sk_test / sk_live — only put them in Worker/host env secrets

### 2. Configure the client

Edit src/js/stripe-config.js:

- publishableKey: pk_test_... (placeholder until you have keys)
- checkoutEndpoint: your deployed Worker or /api/create-checkout-session URL
- enabled: true only after the endpoint is live

If enabled is false or the endpoint is still a placeholder, Step 5 shows “Online deposits opening soon — call to book” and a Reserve hold button that still saves a localStorage booking.

### 3. Deploy the checkout API (Cloudflare Worker)

    cd worker
    npx wrangler login
    npx wrangler secret put STRIPE_SECRET_KEY
    npx wrangler secret put SITE_ORIGIN
    npx wrangler deploy

worker/wrangler.toml names the Worker gulf-coast-checkout. After deploy, paste the Worker URL into stripe-config.js → checkoutEndpoint, set enabled: true, rebuild.

Alternatives:

- Cloudflare Pages: functions/api/create-checkout-session.js
- Vercel/Node: api/create-checkout-session.js (wraps the Worker module; set STRIPE_SECRET_KEY + SITE_ORIGIN)

### 4. Test

1. Use Stripe test-mode keys only
2. Build the site and open booking
3. Step 5: use Pay deposit button, then a test card
4. Success opens itinerary with id and session_id
5. Cancel returns to booking.html

### 5. Go live

Switch to live keys, update Worker secrets, set publishableKey, rebuild, redeploy. See GO_LIVE.md.
