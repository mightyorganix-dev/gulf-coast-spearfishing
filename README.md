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
- Simulated payment empty by default
- Captain weather+SMS; admin stats; itinerary lookup

## Sensory hooks
1. Caustics on home/booking (caustics.js); prefers-reduced-motion
2. Opt-in ambient audio; never autoplay unmuted; Web Audio noise+LFO royalty-safe; gs_ambient_sound ~18%
3. Logo ripple easter egg

## Known gaps
- No real payment/email/SMS; static forecast; verify ADCNR/NOAA; localStorage per-browser
