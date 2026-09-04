import store from './store.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'GS-8921';
  const sessionId = params.get('session_id');
  const isHold = params.get('hold') === '1';

  if (sessionId && id) {
    const booking = store.getBookingById(id);
    if (booking && booking.paymentStatus !== 'deposit_paid') {
      store.updateBooking(id, {
        paymentStatus: 'deposit_paid',
        stripeSessionId: sessionId,
        notes: (booking.notes ? booking.notes + ' ' : '') + `Stripe session ${sessionId}.`,
      });
    }
  }

  document.getElementById('lookup-input').value = id;
  loadBookingItinerary(id, { sessionId, isHold });
  document.getElementById('lookup-btn').addEventListener('click', () => {
    const val = document.getElementById('lookup-input').value.trim();
    if (val) loadBookingItinerary(val);
  });
  document.getElementById('lookup-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('lookup-btn').click();
  });
});

function loadBookingItinerary(bookingId, flags = {}) {
  const booking = store.getBookingById(bookingId);
  if (!booking) {
    document.getElementById('ticket-card').classList.add('hidden');
    document.getElementById('not-found-card').classList.remove('hidden');
    return;
  }
  document.getElementById('not-found-card').classList.add('hidden');
  document.getElementById('ticket-card').classList.remove('hidden');

  let banner = document.getElementById('payment-status-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'payment-status-banner';
    banner.className = 'notice-banner';
    banner.style.marginBottom = '1rem';
    const ticket = document.getElementById('ticket-card');
    ticket.parentElement.insertBefore(banner, ticket);
  }
  const refreshed = store.getBookingById(bookingId);
  if (flags.sessionId) {
    banner.classList.remove('hidden');
    banner.innerHTML = '<strong style="color:var(--cream)">Deposit confirmed</strong> — thank you. Your charter date is locked; balance is due 24h before dock time.';
  } else if (flags.isHold || refreshed?.paymentStatus === 'hold_pending') {
    banner.classList.remove('hidden');
    banner.innerHTML = '<strong style="color:var(--cream)">Reserve hold placed</strong> — online deposits open soon. We will call to confirm and collect the 30% deposit.';
  } else if (refreshed?.paymentStatus === 'awaiting_stripe') {
    banner.classList.remove('hidden');
    banner.innerHTML = '<strong style="color:var(--cream)">Payment pending</strong> — finish Stripe Checkout to lock your deposit.';
  } else {
    banner.classList.add('hidden');
    banner.innerHTML = '';
  }

  const trip = store.getTripTypes().find(t => t.id === booking.tripTypeId);
  const cap = store.getCaptains().find(c => c.id === booking.captainId);
  const boat = store.getBoats().find(b => b.id === booking.boatId);

  document.getElementById('pass-ref-id').textContent = `REF #${booking.id}`;
  document.getElementById('pass-trip-title').textContent = trip?.title || 'Spearfishing Charter';
  document.getElementById('pass-trip-subtitle').textContent = trip?.subtitle || '';
  document.getElementById('pass-date').textContent = booking.tripDate;
  document.getElementById('pass-time').textContent = booking.startTime;
  document.getElementById('pass-captain').textContent = cap?.name || '--';
  document.getElementById('pass-vessel').textContent = boat ? `${boat.name} (${boat.lengthFeet}')` : '--';

  if (boat) {
    document.getElementById('pass-marina-name').textContent = boat.homeMarina;
    document.getElementById('pass-marina-address').textContent = boat.address;
    document.getElementById('pass-gps-link').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(boat.address)}`;
  }

  const weatherBanner = document.getElementById('pass-weather-banner');
  if (booking.weatherStatus === 'green') {
    weatherBanner.className = 'weather-banner weather-green';
    weatherBanner.innerHTML = `<div><strong style="display:block;color:var(--cream);margin-bottom:0.2rem">Captain weather call — Green light</strong>Marine forecast indicates calm seas with excellent underwater visibility. All systems go.</div>`;
  } else if (booking.weatherStatus === 'yellow') {
    weatherBanner.className = 'weather-banner weather-yellow';
    weatherBanner.innerHTML = `<div><strong style="display:block;color:var(--cream);margin-bottom:0.2rem">Captain weather advisory — Yellow caution</strong>Monitoring wind chop. Stand by for a final dock decision one hour before departure.</div>`;
  } else {
    weatherBanner.className = 'weather-banner weather-red';
    weatherBanner.innerHTML = `<div><strong style="display:block;color:var(--cream);margin-bottom:0.2rem">Charter weather cancellation</strong>Offshore conditions exceed safe spearfishing parameters. Your captain will contact you to reschedule.</div>`;
  }

  document.getElementById('pass-cert-badge').textContent = `${booking.certAgency} (${booking.certNumber})`;
  document.getElementById('pass-waiver-badge').textContent = booking.waiverSigned ? 'Signed & Stamped' : 'Pending Signature';
  document.getElementById('pass-waiver-badge').className = booking.waiverSigned ? 'badge badge-ok' : 'badge badge-warn';
  const gearEl = document.getElementById('pass-gear-addons');
  gearEl.innerHTML = booking.gearAddons?.length
    ? booking.gearAddons.map(g => `<div>• ${g.name} ×${g.quantity}</div>`).join('')
    : 'No extra rental gear requested';
}
