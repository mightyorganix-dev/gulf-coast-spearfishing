import store from './store.js';
import { initLayout } from './layout.js';

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  loadStats();
  loadFleet();
  loadBookingsTable();
});

function loadStats() {
  const bookings = store.getBookings();
  const boats = store.getBoats();
  const totalRev = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalDep = bookings.reduce((sum, b) => sum + (b.depositPaid || 0), 0);
  document.getElementById('stat-revenue').textContent = `$${totalRev.toLocaleString()}`;
  document.getElementById('stat-deposits').textContent = `$${totalDep.toLocaleString()}`;
  document.getElementById('stat-boats').textContent = `${boats.length} Boats`;
}

function loadFleet() {
  const boats = store.getBoats();
  const captains = store.getCaptains();
  document.getElementById('admin-fleet-container').innerHTML = boats.map(b => {
    const captain = captains.find(c => c.assignedBoatId === b.id);
    return `
      <article class="card">
        <div class="row-between">
          <div>
            <span class="badge badge-info">${b.lengthFeet}' Center Console</span>
            <h3 style="color:var(--cream);margin-top:0.5rem">${b.name}</h3>
            <p style="margin:0;font-size:0.85rem">${b.homeMarina}</p>
          </div>
          <span class="badge badge-ok">Active</span>
        </div>
        <div class="card" style="margin:1rem 0;padding:0.9rem;background:rgba(0,0,0,0.2)">
          <div style="font-size:0.85rem"><strong>Engines:</strong> ${b.engines}</div>
          <div style="font-size:0.85rem"><strong>Capacity:</strong> Max ${b.capacity} divers (USCG 6-pack)</div>
          <p style="margin:0.5rem 0 0;font-size:0.78rem">${b.features.join(' · ')}</p>
        </div>
        <div style="display:flex;gap:0.75rem;align-items:center;border-top:1px solid var(--line);padding-top:0.85rem">
          <img class="avatar" style="width:40px;height:40px" src="${captain?.avatar || ''}" alt="" />
          <div>
            <div style="font-weight:750;color:var(--cream);font-size:0.9rem">${captain?.name || 'Unassigned'}</div>
            <div style="font-size:0.78rem;color:var(--teal-400)">${captain?.uscgLicense || ''} · ${captain?.phone || ''}</div>
          </div>
        </div>
      </article>`;
  }).join('');
}

function loadBookingsTable() {
  const bookings = store.getBookings();
  const captains = store.getCaptains();
  const boats = store.getBoats();
  document.getElementById('bookings-table-body').innerHTML = bookings.map(b => {
    const cap = captains.find(c => c.id === b.captainId);
    const boat = boats.find(bt => bt.id === b.boatId);
    return `
      <tr>
        <td style="font-family:monospace;font-weight:700">${b.id}</td>
        <td><strong style="color:var(--cream)">${b.customerName}</strong><div class="muted">${b.customerPhone}</div></td>
        <td>${b.tripDate}<div style="color:var(--ocean-400)">${b.startTime}</div></td>
        <td>${cap?.name || '--'}<div class="muted">${boat?.name || '--'}</div></td>
        <td>${b.passengerCount}</td>
        <td>
          <div>${b.waiverSigned ? '<span class="badge badge-ok">Waiver Signed</span>' : '<span class="badge badge-warn">Waiver Pending</span>'}</div>
          <div style="margin-top:0.25rem">${b.diveCertVerified ? `<span class="badge badge-info">${b.certAgency}</span>` : '<span class="badge badge-bad">Cert Pending</span>'}</div>
        </td>
        <td><strong>$${b.totalAmount.toLocaleString()}</strong><div style="color:var(--ok)">Dep $${b.depositPaid.toLocaleString()}</div></td>
        <td style="text-align:right"><a class="btn btn-primary btn-sm" href="itinerary.html?id=${b.id}" target="_blank">View Pass</a></td>
      </tr>`;
  }).join('') || `<tr><td colspan="8"><div class="empty-state"><strong>No bookings yet</strong></div></td></tr>`;
}
