import{i as h}from"./layout-BhuAJQd0.js";import{s as o}from"./store-C89-ts5_.js";let l="cap-1";document.addEventListener("DOMContentLoaded",()=>{h(),f(),g()});function f(){const a=o.getCaptains(),t=document.getElementById("captain-select");t.innerHTML=a.map(s=>`<option value="${s.id}">${s.name}</option>`).join(""),t.addEventListener("change",()=>{l=t.value,g()})}function g(){l=document.getElementById("captain-select").value||"cap-1";const t=o.getCaptains(),s=o.getBoats(),c=o.getTripTypes(),v=o.getBookings(),r=t.find(e=>e.id===l),n=s.find(e=>e.id===r.assignedBoatId);document.getElementById("cap-name").textContent=r.name,document.getElementById("cap-license").textContent=r.uscgLicense,document.getElementById("cap-avatar").src=r.avatar,document.getElementById("cap-boat").innerHTML=`Vessel: <strong>${(n==null?void 0:n.name)||""}</strong> · ${(n==null?void 0:n.homeMarina)||""}`;const m=v.filter(e=>e.captainId===l);document.getElementById("total-charters-count").textContent=m.length;const i=document.getElementById("manifest-container");if(!m.length){i.innerHTML=`
      <div class="empty-state">
        <strong>No charters assigned</strong>
        <p>No upcoming spearfishing bookings for this captain roster.</p>
      </div>`;return}i.innerHTML=m.map(e=>{var u;const p=c.find(d=>d.id===e.tripTypeId),y=e.weatherStatus==="green"?'<span class="badge badge-ok">Green Light</span>':e.weatherStatus==="yellow"?'<span class="badge badge-warn">Yellow Caution</span>':'<span class="badge badge-bad">Weather Cancelled</span>';return`
      <article class="card" style="margin-bottom:1rem">
        <div class="row-between" style="border-bottom:1px solid var(--line);padding-bottom:1rem;margin-bottom:1rem">
          <div>
            <div class="actions" style="margin-bottom:0.5rem">
              <span class="muted" style="font-family:monospace;font-weight:700">Ref #${e.id}</span>
              ${y}
              <span class="badge badge-info">${e.startTime}</span>
            </div>
            <h3 style="color:var(--cream);margin:0">${(p==null?void 0:p.title)||"Spearfishing Charter"}</h3>
            <p style="margin:0.25rem 0 0;font-size:0.85rem">Date: <strong style="color:var(--cream)">${e.tripDate}</strong></p>
          </div>
          <div class="call-btns" aria-label="Weather call">
            <span class="muted" style="font-size:0.65rem;align-self:center;padding:0 0.35rem;text-transform:uppercase;letter-spacing:0.06em">Call</span>
            <button type="button" class="${e.weatherStatus==="green"?"active-green":""}" data-weather="${e.id}" data-status="green">Green</button>
            <button type="button" class="${e.weatherStatus==="yellow"?"active-yellow":""}" data-weather="${e.id}" data-status="yellow">Yellow</button>
            <button type="button" class="${e.weatherStatus==="red"?"active-red":""}" data-weather="${e.id}" data-status="red">Red</button>
          </div>
        </div>
        <div class="grid-3">
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Charter Lead</div>
            <strong style="color:var(--cream)">${e.customerName}</strong>
            <div style="font-size:0.85rem">${e.customerPhone}</div>
            <div class="muted" style="font-size:0.8rem">${e.customerEmail}</div>
            <div class="badge badge-info" style="margin-top:0.5rem">Party of ${e.passengerCount}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Credentials</div>
            <div style="margin-bottom:0.4rem">${e.diveCertVerified?`<span class="badge badge-ok">${e.certAgency} (${e.certNumber})</span>`:'<span class="badge badge-bad">Cert Pending</span>'}</div>
            <div>${e.waiverSigned?'<span class="badge badge-ok">Waiver Signed</span>':'<span class="badge badge-warn">Waiver Pending</span>'}</div>
          </div>
          <div>
            <div class="muted" style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;font-weight:750;margin-bottom:0.4rem">Gear Rentals</div>
            ${(u=e.gearAddons)!=null&&u.length?e.gearAddons.map(d=>`<div style="font-size:0.85rem">✓ ${d.name} ×${d.quantity}</div>`).join(""):'<div class="muted" style="font-size:0.85rem">No extra rentals</div>'}
          </div>
        </div>
        <div class="row-between" style="border-top:1px solid var(--line);padding-top:1rem;margin-top:1rem">
          <span class="muted">Total $${e.totalAmount} · Deposit <strong style="color:var(--ok)">$${e.depositPaid}</strong></span>
          <div class="actions">
            <button type="button" class="btn btn-ghost btn-sm" data-sms-name="${e.customerName}" data-sms-phone="${e.customerPhone}">Dispatch SMS</button>
            <a class="btn btn-primary btn-sm" href="itinerary.html?id=${e.id}" target="_blank">Guest Pass</a>
          </div>
        </div>
      </article>`}).join(""),i.querySelectorAll("[data-weather]").forEach(e=>{e.addEventListener("click",()=>{o.updateWeatherStatus(e.dataset.weather,e.dataset.status),g()})}),i.querySelectorAll("[data-sms-name]").forEach(e=>{e.addEventListener("click",()=>w(e.dataset.smsName,e.dataset.smsPhone))})}function w(a,t){document.getElementById("sms-recipient").value=`${a} - ${t}`,applySmsTemplate(),document.getElementById("sms-modal").classList.remove("hidden")}window.closeSmsModal=function(){document.getElementById("sms-modal").classList.add("hidden")};window.applySmsTemplate=function(){const t=document.getElementById("sms-template").value,s=document.getElementById("sms-body"),c={dock:"Gulf Coast Spearfishing Alert: Your charter leaves at 06:00 AM tomorrow from Zeke's Marina (Slip 14). Please arrive 20 mins early with your dive cert card and sunscreen!",weather_ok:"Capt. Update: NOAA marine forecast looks phenomenal! 2ft seas and clear vis expected. All systems GO for tomorrow's spearfishing trip.",weather_hold:"Capt. Weather Advisory: Monitoring a morning south wind chop. Please stand by for a 5:00 AM final dock decision.",weather_cancel:"Capt. Weather Cancellation: Offshore seas are forecasted above 5ft with rough bottom currents. Charter postponed for diver safety. We will call you to reschedule!"};s.value=c[t]||""};window.sendSmsAlert=function(){alert("SMS alert dispatched successfully to guest!"),closeSmsModal()};
