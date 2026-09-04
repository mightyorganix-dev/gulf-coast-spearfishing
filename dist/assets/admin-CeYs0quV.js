import{i as r}from"./layout-DY9Ki0oV.js";import{s as a}from"./store-Br4tOU-W.js";document.addEventListener("DOMContentLoaded",()=>{r(),g(),l(),c()});function g(){const o=a.getBookings(),i=a.getBoats(),e=o.reduce((n,s)=>n+(s.totalAmount||0),0),t=o.reduce((n,s)=>n+(s.depositPaid||0),0);document.getElementById("stat-revenue").textContent=`$${e.toLocaleString()}`,document.getElementById("stat-deposits").textContent=`$${t.toLocaleString()}`,document.getElementById("stat-boats").textContent=`${i.length} Boats`}function l(){const o=a.getBoats(),i=a.getCaptains();document.getElementById("admin-fleet-container").innerHTML=o.map(e=>{const t=i.find(n=>n.assignedBoatId===e.id);return`
      <article class="card">
        <div class="row-between">
          <div>
            <span class="badge badge-info">${e.lengthFeet}' Center Console</span>
            <h3 style="color:var(--cream);margin-top:0.5rem">${e.name}</h3>
            <p style="margin:0;font-size:0.85rem">${e.homeMarina}</p>
          </div>
          <span class="badge badge-ok">Active</span>
        </div>
        <div class="card" style="margin:1rem 0;padding:0.9rem;background:rgba(0,0,0,0.2)">
          <div style="font-size:0.85rem"><strong>Engines:</strong> ${e.engines}</div>
          <div style="font-size:0.85rem"><strong>Capacity:</strong> Max ${e.capacity} divers (USCG 6-pack)</div>
          <p style="margin:0.5rem 0 0;font-size:0.78rem">${e.features.join(" · ")}</p>
        </div>
        <div style="display:flex;gap:0.75rem;align-items:center;border-top:1px solid var(--line);padding-top:0.85rem">
          <img class="avatar" style="width:40px;height:40px" src="${(t==null?void 0:t.avatar)||""}" alt="" />
          <div>
            <div style="font-weight:750;color:var(--cream);font-size:0.9rem">${(t==null?void 0:t.name)||"Unassigned"}</div>
            <div style="font-size:0.78rem;color:var(--teal-400)">${(t==null?void 0:t.uscgLicense)||""} · ${(t==null?void 0:t.phone)||""}</div>
          </div>
        </div>
      </article>`}).join("")}function c(){const o=a.getBookings(),i=a.getCaptains(),e=a.getBoats();document.getElementById("bookings-table-body").innerHTML=o.map(t=>{const n=i.find(d=>d.id===t.captainId),s=e.find(d=>d.id===t.boatId);return`
      <tr>
        <td style="font-family:monospace;font-weight:700">${t.id}</td>
        <td><strong style="color:var(--cream)">${t.customerName}</strong><div class="muted">${t.customerPhone}</div></td>
        <td>${t.tripDate}<div style="color:var(--ocean-400)">${t.startTime}</div></td>
        <td>${(n==null?void 0:n.name)||"--"}<div class="muted">${(s==null?void 0:s.name)||"--"}</div></td>
        <td>${t.passengerCount}</td>
        <td>
          <div>${t.waiverSigned?'<span class="badge badge-ok">Waiver Signed</span>':'<span class="badge badge-warn">Waiver Pending</span>'}</div>
          <div style="margin-top:0.25rem">${t.diveCertVerified?`<span class="badge badge-info">${t.certAgency}</span>`:'<span class="badge badge-bad">Cert Pending</span>'}</div>
        </td>
        <td><strong>$${t.totalAmount.toLocaleString()}</strong><div style="color:var(--ok)">Dep $${t.depositPaid.toLocaleString()}</div></td>
        <td style="text-align:right"><a class="btn btn-primary btn-sm" href="itinerary.html?id=${t.id}" target="_blank">View Pass</a></td>
      </tr>`}).join("")||'<tr><td colspan="8"><div class="empty-state"><strong>No bookings yet</strong></div></td></tr>'}
