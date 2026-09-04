import store from './store.js';
import { initLayout } from './layout.js';

let currentCaptainId = 'cap-1';

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  populateCaptainDropdown();
  loadCaptainManifest();
});

function populateCaptainDropdown() {
  const captains = store.getCaptains();
  const select = document.getElementById('captain-select');
  select.innerHTML = captains.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  select.addEventListener('change', () => {
    currentCaptainId = select.value;
    loadCaptainManifest();
  });
}

function loadCaptainManifest() {
  const select = document.getElementById('captain-select');
  currentCaptainId = select.value || 'cap-1';
  const captains = store.getCaptains();
  const boats = store.getBoats();
  const trips = store.getTripTypes();
  const bookings = store.getBookings();
  const captain = captains.find(c => c.id === currentCaptainId);
  const boat = boats.find(b => b.id === captain.assignedBoatId);

  document.getElementById('cap-name').textContent = captain.name;
  document.getElementById('cap-license').textContent = captain.uscgLicense;
  document.getElementById('cap-avatar').src = captain.avatar;
  document.getElementById('cap-boat').innerHTML = `Vessel: <strong>${boat?.name || ''}</strong> · ${boat?.homeMarina || ''}`;

  const capBookings = bookings.filter(b => b.captainId === currentCaptainId);
  document.getElementById('total-charters-count').textContent = capBookings.length;
  const container = document.getElementById('manifest-container');

  if (!capBookings.length) {
    container.innerHTML = `
      <div class="empty-state">
        <strong>No charters assigned</strong>
        <p>No upcoming spearfishing bookings for this captain roster.</p>
      </div>`;
    return;
  }

  container.innerHTML = capBookings.map(b => {
    const trip = trips.find(t => t.id === b.tripTypeId);
    const weatherBadge = b.weatherStatus === 'green'
      ? '<span class="badge badge-ok">Green Light</span>'
      : b.weatherStatus === 'yellow'
        ? '<span class="badge badge-warn">Yellow Caution</span>'
        : '<span class="badge badge-bad">Weather Cancelled</span>';

    return `
      <article class="card" style="margin-bottom:1rem">
        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:1rem">
          <div>
            <div class="actions" style="margin-bottom:0.5rem">
              <span class="muted" style="font-family:monospace;font-weight:700">Ref #${b.id}</span>
              ${weatherBadge}
              <span class="badge badge-info">${b.startTime}</span>
            </div>
            <h3 style="color:var(--cream);margin:0">${trip?.title || 'Spearfishing Charter'}</h3>
            <p style="margin:0.25rem 0 0;font-size:0.85rem">Date: <strong style="color:var(--cream)">${b.tripDate}</strong></p>
          </div>
          <div class="call-btns" aria-label="Weather call">
            <span class="muted" style="font-size:0.65rem;align-self:center;padding:0 0.35rem;text-transform:uppercase;letter-spacing:0.06em">Call</span>
            <button type="button" class="${b.weatherStatus === 'green' ? 'active-green' : ''}" data-weather="${b.id}" data-status="green">Green</button>
            <button type="button" class="${b.weatherStatus === 'yellow' ? 'active-yellow' : ''}" data-weather="${b.id}" data-status="yellow">Yellow</button>
            <button type="button" class="${b.weatherStatus === 'red' ? 'active-red' : ''}" data-weather="${b.id}" data-status="red">Red</button>
          </div>
        </div>
        <div class="grid-3">
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Charter Lead</div>
            <strong style="color:var(--cream)">${b.customerName}</strong>
            <div style="font-size:0.85rem">${b.customerPhone}</div>
            <div class="muted" style="font-size:0.8rem">${b.customerEmail}</div>
            <div class="badge badge-info" style="margin-top:0.5rem">Party of ${b.passengerCount}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Credentials</div>
            <div style="margin-bottom:0.4rem">${b.diveCertVerified
              ? `<span class="badge badge-ok">${b.certAgency} (${b.certNumber})</span>`
              : `<span class="badge badge-bad">Cert Pending</span>`}</div>
            <div>${b.waiverSigned
              ? `<span class="badge badge-ok">Waiver Signed</span>`
              : `<span class="badge badge-warn">Waiver Pending</span>`}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Gear Rentals</div>
            ${b.gearAddons?.length
              ? b.gearAddons.map(g => `<div style="font-size:0.85rem">✓ ${g.name} ×${g.quantity}</div>`).join('')
              : '<div class="muted" style="font-size:0.85rem">No extra rentals</div>'}
          </div>
        </div>
        <div class="row-between" style="border-top:1px solid var(--line);padding-top:1rem;margin-top:1rem">
          <span class="muted">Total $${b.totalAmount} · Deposit <strong style="color:var(--ok)">$${b.depositPaid}</strong></span>
          <div class="actions">
            <button type="button" class="btn btn-ghost btn-sm" data-sms-name="${b.customerName}" data-sms-phone="${b.customerPhone}">Dispatch SMS</button>
            <a class="btn btn-primary btn-sm" href="itinerary.html?id=${b.id}" target="_blank">Guest Pass</a>
          </div>
        </div>
      </article>`;
  }).join('');

  container.querySelectorAll('[data-weather]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.updateWeatherStatus(btn.dataset.weather, btn.dataset.status);
      loadCaptainManifest();
    });
  });
  container.querySelectorAll('[data-sms-name]').forEach(btn => {
    btn.addEventListener('click', () => openSmsModal(btn.dataset.smsName, btn.dataset.smsPhone));
  });
}

function openSmsModal(name, phone) {
  document.getElementById('sms-recipient').value = `${name} - ${phone}`;
  applySmsTemplate();
  document.getElementById('sms-modal').classList.remove('hidden');
}

window.closeSmsModal = function closeSmsModal() {
  document.getElementById('sms-modal').classList.add('hidden');
};

window.applySmsTemplate = function applySmsTemplate() {
  const tmpl = document.getElementById('sms-template').value;
  const body = document.getElementById('sms-body');
  const map = {
    dock: "Gulf Coast Spearfishing Alert: Your charter leaves at 06:00 AM tomorrow from Zeke's Marina (Slip 14). Please arrive 20 mins early with your dive cert card and sunscreen!",
    weather_ok: 'Capt. Update: NOAA marine forecast looks phenomenal! 2ft seas and clear vis expected. All systems GO for tomorrow\'s spearfishing trip.',
    weather_hold: 'Capt. Weather Advisory: Monitoring a morning south wind chop. Please stand by for a 5:00 AM final dock decision.',
    weather_cancel: 'Capt. Weather Cancellation: Offshore seas are forecasted above 5ft with rough bottom currents. Charter postponed for diver safety. We will call you to reschedule!'
  };
  body.value = map[tmpl] || '';
};

window.sendSmsAlert = function sendSmsAlert() {
  alert('SMS alert dispatched successfully to guest!');
  closeSmsModal();
};
