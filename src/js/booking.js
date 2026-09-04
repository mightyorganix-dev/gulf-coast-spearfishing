import store from './store.js';
import { initLayout } from './layout.js';

let currentStep = 1;
let selectedTripId = 'trip-2';
let selectedCaptainId = 'cap-1';
let passengerCount = 4;
let selectedGearMap = {};
let canvas, ctx, isDrawing = false, hasSignature = false;

document.addEventListener('DOMContentLoaded', () => {
  if (!store) {
    console.error('CharterStore failed to load');
    return;
  }
  initLayout();
  renderTripTypes();
  renderCaptains();
  renderGearAddons();
  initSignatureCanvas();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  document.getElementById('trip-date').value = tomorrow;
  document.getElementById('passenger-count-display').textContent = passengerCount;
});

function clearFieldErrors(scope) {
  scope.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
  scope.querySelectorAll('.field-error').forEach((el) => el.remove());
  scope.querySelector('.signature-wrap')?.classList.remove('is-invalid');
}

function showError(input, message) {
  input.classList.add('invalid');
  const err = document.createElement('div');
  err.className = 'field-error';
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function validateStep(step) {
  if (step === 1) {
    if (!selectedTripId) {
      alert('Please select a trip type.');
      return false;
    }
    return true;
  }
  if (step === 2) {
    if (!selectedCaptainId) {
      alert('Please select a captain.');
      return false;
    }
    const date = document.getElementById('trip-date');
    clearFieldErrors(document.getElementById('step-2'));
    if (!date.value) {
      showError(date, 'Choose a charter date.');
      return false;
    }
    return true;
  }
  if (step === 4) {
    const section = document.getElementById('step-4');
    clearFieldErrors(section);
    const name = document.getElementById('cust-name');
    const email = document.getElementById('cust-email');
    const phone = document.getElementById('cust-phone');
    const cert = document.getElementById('cert-number');
    let ok = true;
    if (!name.value.trim()) { showError(name, 'Full name is required.'); ok = false; }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, 'Valid email is required.');
      ok = false;
    }
    if (!phone.value.trim() || phone.value.trim().replace(/\D/g, '').length < 7) {
      showError(phone, 'Phone number is required.');
      ok = false;
    }
    if (!cert.value.trim()) { showError(cert, 'Certification number is required.'); ok = false; }
    if (!hasSignature) {
      document.querySelector('.signature-wrap')?.classList.add('is-invalid');
      const wrap = document.querySelector('.signature-wrap');
      if (wrap && !wrap.parentElement.querySelector('.field-error')) {
        const err = document.createElement('div');
        err.className = 'field-error';
        err.textContent = 'Please sign the liability waiver before continuing.';
        wrap.parentElement.appendChild(err);
      }
      ok = false;
    }
    return ok;
  }
  if (step === 5) {
    // Re-validate step 4 fields before submit
    if (!validateStep(4)) {
      goToStep(4);
      return false;
    }
    const cardName = document.getElementById('card-name');
    const cardNumber = document.getElementById('card-number');
    const cardCvc = document.getElementById('card-cvc');
    clearFieldErrors(document.getElementById('step-5'));
    let ok = true;
    if (!cardName.value.trim()) { showError(cardName, 'Cardholder name is required.'); ok = false; }
    if (!cardNumber.value.trim()) { showError(cardNumber, 'Enter your card number.'); ok = false; }
    if (!cardCvc.value.trim()) { showError(cardCvc, 'Enter your CVC.'); ok = false; }
    return ok;
  }
  return true;
}

window.goToStep = function goToStep(step) {
  if (step > currentStep && !validateStep(currentStep)) return;

  document.getElementById(`step-${currentStep}`).classList.add('hidden');
  document.getElementById(`step-indicator-${currentStep}`).classList.remove('is-active');
  currentStep = step;
  document.getElementById(`step-${currentStep}`).classList.remove('hidden');
  document.getElementById(`step-indicator-${currentStep}`).classList.add('is-active');
  if (step === 5) updateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.adjustPassengers = function adjustPassengers(delta) {
  passengerCount = Math.max(1, Math.min(6, passengerCount + delta));
  document.getElementById('passenger-count-display').textContent = passengerCount;
};

window.clearSignature = function clearSignature() {
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
  }
};

window.submitBooking = function submitBooking() {
  if (!validateStep(5)) return;

  const name = document.getElementById('cust-name').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const certAgency = document.getElementById('cert-agency').value;
  const certNumber = document.getElementById('cert-number').value.trim();
  const date = document.getElementById('trip-date').value;
  const startTime = document.getElementById('start-time').value;

  const trips = store.getTripTypes();
  const gearList = store.getGearAddons();
  const captains = store.getCaptains();
  const trip = trips.find((t) => t.id === selectedTripId);
  const captain = captains.find((c) => c.id === selectedCaptainId);

  let selectedGearArr = [];
  let gearSubtotal = 0;
  Object.keys(selectedGearMap).forEach((gId) => {
    const g = gearList.find((x) => x.id === gId);
    const qty = selectedGearMap[gId];
    gearSubtotal += g.price * qty;
    selectedGearArr.push({ id: g.id, name: g.name, price: g.price, quantity: qty });
  });

  const grandTotal = trip.basePrice + gearSubtotal;
  const deposit = grandTotal * 0.3;

  const newBooking = store.addBooking({
    tripTypeId: selectedTripId,
    boatId: captain ? captain.assignedBoatId : 'boat-1',
    captainId: selectedCaptainId,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    tripDate: date,
    startTime,
    passengerCount,
    gearAddons: selectedGearArr,
    totalAmount: grandTotal,
    depositPaid: Math.round(deposit * 100) / 100,
    paymentStatus: 'deposit_paid',
    waiverSigned: true,
    diveCertVerified: true,
    certAgency,
    certNumber,
    weatherStatus: 'green',
    notes: 'Online booking completed.'
  });

  window.location.href = `itinerary.html?id=${encodeURIComponent(newBooking.id)}`;
};

function renderTripTypes() {
  const trips = store.getTripTypes();
  const container = document.getElementById('trip-types-container');
  container.innerHTML = trips.map((t) => `
    <article class="card select-card ${t.id === selectedTripId ? 'is-selected' : ''}" data-trip="${t.id}" role="button" tabindex="0">
      <img src="${t.image}" alt="" />
      <span class="badge badge-info">${t.locationType}</span>
      <h3>${t.title}</h3>
      <p>${t.description}</p>
      <div class="species-strip" style="justify-content:flex-start;margin:0.75rem 0">
        ${t.targetSpecies.map((s) => `<span class="chip">${s}</span>`).join('')}
      </div>
      <div class="row-between" style="border-top:1px solid var(--line);padding-top:0.75rem;margin-top:auto">
        <span class="muted">${t.durationHours} hours</span>
        <strong style="color:var(--cream);font-size:1.25rem;font-family:var(--display)">$${t.basePrice.toLocaleString()}</strong>
      </div>
    </article>
  `).join('');
  container.querySelectorAll('[data-trip]').forEach((el) => {
    const select = () => { selectedTripId = el.dataset.trip; renderTripTypes(); };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });
}

function renderCaptains() {
  const captains = store.getCaptains();
  const boats = store.getBoats();
  const container = document.getElementById('captains-container');
  container.innerHTML = captains.map((c) => {
    const boat = boats.find((b) => b.id === c.assignedBoatId);
    return `
      <article class="card select-card ${c.id === selectedCaptainId ? 'is-selected' : ''}" data-cap="${c.id}" role="button" tabindex="0">
        <div style="display:flex;gap:1rem;align-items:flex-start">
          <img class="avatar" src="${c.avatar}" alt="" />
          <div>
            <h3 style="font-size:1.3rem">${c.name}</h3>
            <div class="badge badge-ok">${c.uscgLicense}</div>
            <p style="margin:0.4rem 0 0;font-size:0.88rem">${c.experienceYears} years on Gulf waters</p>
          </div>
        </div>
        <div class="card" style="margin-top:1rem;padding:0.9rem;background:rgba(0,0,0,0.18)">
          <strong style="color:var(--cream)">${boat?.name || 'Vessel'} · ${boat?.lengthFeet || 32}'</strong>
          <p style="margin:0.25rem 0 0;font-size:0.82rem">${boat?.homeMarina || ''}</p>
        </div>
      </article>
    `;
  }).join('');
  container.querySelectorAll('[data-cap]').forEach((el) => {
    const select = () => { selectedCaptainId = el.dataset.cap; renderCaptains(); };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });
}

function renderGearAddons() {
  const gear = store.getGearAddons();
  const container = document.getElementById('gear-container');
  container.innerHTML = gear.map((g) => {
    const qty = selectedGearMap[g.id] || 0;
    return `
      <div class="card row-between" style="padding:1rem">
        <div>
          <strong style="color:var(--cream);font-size:0.92rem">${g.name}</strong>
          <div style="color:var(--ocean-soft);font-size:0.8rem;font-weight:560">$${g.price} / ${g.per}</div>
        </div>
        <div class="qty">
          <button type="button" data-gear="${g.id}" data-delta="-1" aria-label="Decrease">−</button>
          <span style="width:1.5rem;text-align:center;font-weight:600">${qty}</span>
          <button type="button" data-gear="${g.id}" data-delta="1" aria-label="Increase">+</button>
        </div>
      </div>
    `;
  }).join('');
  container.querySelectorAll('[data-gear]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.gear;
      const delta = Number(btn.dataset.delta);
      const next = Math.max(0, (selectedGearMap[id] || 0) + delta);
      if (next === 0) delete selectedGearMap[id];
      else selectedGearMap[id] = next;
      renderGearAddons();
    });
  });
}

function updateSummary() {
  const trips = store.getTripTypes();
  const captains = store.getCaptains();
  const gearList = store.getGearAddons();
  const trip = trips.find((t) => t.id === selectedTripId);
  const cap = captains.find((c) => c.id === selectedCaptainId);
  const date = document.getElementById('trip-date').value;

  document.getElementById('summary-trip-title').textContent = trip?.title || '';
  document.getElementById('summary-trip-date').textContent = `${date} · ${cap?.name || ''} · ${passengerCount} divers`;
  document.getElementById('summary-base-price').textContent = `$${(trip?.basePrice || 0).toLocaleString()}`;

  let gearSubtotal = 0;
  let gearHtml = '';
  Object.keys(selectedGearMap).forEach((gId) => {
    const item = gearList.find((g) => g.id === gId);
    const qty = selectedGearMap[gId];
    const cost = item.price * qty;
    gearSubtotal += cost;
    gearHtml += `<div class="row-between"><span>${item.name} ×${qty}</span><span>$${cost}</span></div>`;
  });
  document.getElementById('summary-gear-list').innerHTML = gearHtml || '<div class="muted">No extra gear selected</div>';

  const grandTotal = (trip?.basePrice || 0) + gearSubtotal;
  const deposit = grandTotal * 0.3;
  document.getElementById('summary-subtotal').textContent = `$${grandTotal.toLocaleString()}`;
  document.getElementById('summary-total').textContent = `$${grandTotal.toLocaleString()}`;
  document.getElementById('summary-deposit').textContent = `$${deposit.toFixed(2)}`;
}

function initSignatureCanvas() {
  canvas = document.getElementById('signature-pad');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.strokeStyle = '#7dd3c0';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };
  resize();
  window.addEventListener('resize', resize);

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };
  const start = (e) => { e.preventDefault(); isDrawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    hasSignature = true;
    document.querySelector('.signature-wrap')?.classList.remove('is-invalid');
  };
  const stop = () => { isDrawing = false; };
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stop);
  canvas.addEventListener('mouseleave', stop);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stop);
}
