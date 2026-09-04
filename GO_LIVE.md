# Go-live checklist — Gulf Coast Spearfishing

## Domain
- [ ] Custom domain on Pages
- [ ] Confirm HTTPS
- [ ] Fix asset paths
- [ ] Build and sync docs

## Content
- [ ] Real captain names and photos
- [ ] Seed or remove sample bookings carefully
- [ ] Verify seasons vs ADCNR/NOAA

## Payments
- [ ] Create Stripe account and verify business
- [ ] Deploy checkout API (worker, functions, or api)
- [ ] Set env secrets; never commit secret keys
- [ ] Set checkoutEndpoint in stripe-config.js
- [ ] Use pk_test keys first; then live keys
- [ ] Set enabled true and rebuild

## Legal
- [ ] Attorney reviews liability waiver
- [ ] Form LLC and get business licenses
- [ ] Marine insurance; USCG licenses current
- [ ] Alabama fishing license notes accurate
- [ ] Link privacy, cancel, weather policies

## Comms and analytics
- [ ] Connect real SMS later for dock alerts
- [ ] Optional analytics with consent
- [ ] Real inbox for Contact form

## Smoke test
- [ ] Booking steps 1-5 on mobile and desktop
- [ ] Test pay to itinerary with session_id
- [ ] Cancel returns to booking
- [ ] Reserve hold works when checkout off
