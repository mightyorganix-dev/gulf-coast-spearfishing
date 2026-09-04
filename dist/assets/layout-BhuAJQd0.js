(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(t){if(t.ep)return;t.ep=!0;const n=s(t);fetch(t.href,n)}})();const E="gs_ambient_sound";let h=null,S=null,L=[],g=!1;function G(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function T(e){const a=2*e.sampleRate,s=e.createBuffer(1,a,e.sampleRate),r=s.getChannelData(0);for(let b=0;b<a;b++)r[b]=(Math.random()*2-1)*.4;const t=e.createBufferSource();t.buffer=s,t.loop=!0;const n=e.createBiquadFilter();n.type="lowpass",n.frequency.value=480,n.Q.value=.7;const i=e.createOscillator();i.type="sine",i.frequency.value=.08;const f=e.createGain();f.gain.value=120,i.connect(f),f.connect(n.frequency);const o=e.createOscillator();o.type="sine",o.frequency.value=55;const m=e.createGain();m.gain.value=.015;const p=e.createGain();return p.gain.value=0,t.connect(n),n.connect(p),o.connect(m),m.connect(p),{source:t,filter:n,lfo:i,wave:o,waveGain:m,gain:p}}async function M(){if(g||G())return;h||(h=new(window.AudioContext||window.webkitAudioContext)),h.state==="suspended"&&await h.resume();const e=T(h);S=h.createGain(),S.gain.value=.18,e.gain.connect(S),S.connect(h.destination),e.source.start(),e.lfo.start(),e.wave.start(),e.gain.gain.linearRampToValueAtTime(1,h.currentTime+1.2),L=[e],g=!0,v(!0)}function B(){if(!g||!h){g=!1,v(!1);return}const e=h.currentTime;L.forEach(a=>{try{a.gain.gain.cancelScheduledValues(e),a.gain.gain.linearRampToValueAtTime(0,e+.6),setTimeout(()=>{try{a.source.stop(),a.lfo.stop(),a.wave.stop()}catch{}},700)}catch{}}),L=[],g=!1,v(!1)}function v(e){document.querySelectorAll("[data-ambient-toggle]").forEach(a=>{a.setAttribute("aria-pressed",e?"true":"false"),a.title=e?"Mute ocean ambience":"Play soft ocean ambience",a.classList.toggle("is-on",e)})}function A(){return localStorage.getItem(E)==="on"}async function O(){g?(B(),localStorage.setItem(E,"off")):(await M(),localStorage.setItem(E,"on"))}function x(){if(document.querySelectorAll("[data-ambient-toggle]").forEach(e=>{e.addEventListener("click",a=>{a.preventDefault(),O()})}),A()){v(!0),document.querySelectorAll("[data-ambient-toggle]").forEach(a=>{a.classList.add("is-pending"),a.title="Tap to resume ocean ambience"});const e=async()=>{A()&&!g&&await M(),document.querySelectorAll("[data-ambient-toggle]").forEach(a=>a.classList.remove("is-pending")),window.removeEventListener("pointerdown",e)};window.addEventListener("pointerdown",e,{once:!0})}else v(!1)}function P(e="[data-caustics]"){const a=document.querySelectorAll(e);if(!a.length)return;const s=window.matchMedia("(prefers-reduced-motion: reduce)").matches;a.forEach(r=>{if(r.querySelector(".caustics-layer"))return;const t=document.createElement("div");t.className="caustics-layer",t.setAttribute("aria-hidden","true");const n=document.createElement("canvas");if(n.className="caustics-canvas",t.appendChild(n),r.prepend(t),s){t.classList.add("is-static"),q(n,r);return}let i=0,f=0;const o=n.getContext("2d"),m=()=>{const l=r.getBoundingClientRect(),c=Math.min(window.devicePixelRatio||1,2);n.width=Math.max(1,Math.floor(l.width*c)),n.height=Math.max(1,Math.floor(l.height*c)),n.style.width=`${l.width}px`,n.style.height=`${l.height}px`,o.setTransform(c,0,0,c,0,0)},p=()=>{const l=r.clientWidth,c=r.clientHeight;o.clearRect(0,0,l,c);const y=o.createRadialGradient(l*.5,c*.35,40,l*.5,c*.4,Math.max(l,c)*.7);y.addColorStop(0,"rgba(94, 234, 212, 0.04)"),y.addColorStop(.55,"rgba(14, 138, 191, 0.03)"),y.addColorStop(1,"rgba(6, 16, 28, 0)"),o.fillStyle=y,o.fillRect(0,0,l,c),o.globalCompositeOperation="lighter";for(let d=0;d<5;d++){const k=c*(.15+d*.14);o.beginPath();for(let u=0;u<=l;u+=8){const w=k+Math.sin(u*.012+f*.35+d)*(10+d*2)+Math.sin(u*.004+f*.2+d*1.7)*18;u===0?o.moveTo(u,w):o.lineTo(u,w)}o.strokeStyle=`rgba(165, 243, 252, ${.045+d*.008})`,o.lineWidth=1.2+d*.15,o.stroke()}o.globalCompositeOperation="source-over";for(let d=0;d<12;d++){const k=(Math.sin(f*.15+d*2.1)+1)/2*l,u=(Math.cos(f*.11+d*1.4)+1)/2*c*.85,w=.8+d%3*.4;o.beginPath(),o.arc(k,u,w,0,Math.PI*2),o.fillStyle="rgba(255, 255, 255, 0.06)",o.fill()}f+=.016,i=requestAnimationFrame(p)};m(),p(),window.addEventListener("resize",m),new IntersectionObserver(l=>{l.forEach(c=>{c.isIntersecting?!i&&!s&&p():(cancelAnimationFrame(i),i=0)})},{threshold:.05}).observe(r)})}function q(e,a){const s=e.getContext("2d"),r=a.getBoundingClientRect();e.width=r.width,e.height=r.height;const t=s.createLinearGradient(0,0,r.width,r.height);t.addColorStop(0,"rgba(14, 138, 191, 0.05)"),t.addColorStop(1,"rgba(13, 148, 136, 0.03)"),s.fillStyle=t,s.fillRect(0,0,r.width,r.height)}const I=[{href:"index.html",label:"Home",key:"home"},{href:"about.html",label:"About",key:"about"},{href:"species.html",label:"Species",key:"species"},{href:"faq.html",label:"FAQ",key:"faq"},{href:"what-to-bring.html",label:"What to Bring",key:"bring"},{href:"red-snapper-season.html",label:"Season",key:"season"},{href:"safety.html",label:"Safety",key:"safety"},{href:"reviews.html",label:"Reviews",key:"reviews"},{href:"contact.html",label:"Contact",key:"contact"}],R=[{href:"booking.html",label:"Book"},{href:"itinerary.html",label:"Itinerary"},{href:"captain.html",label:"Captain"},{href:"admin.html",label:"Admin"}];function $(){const e=window.location.pathname.split("/").pop()||"index.html";return e===""?"index.html":e}const C='<svg class="icon-wave" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 14c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0"/><path d="M2 18c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0" opacity=".55"/></svg>',F='<svg class="brand-svg" viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><defs><linearGradient id="brandGrad" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#0c4a6e"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><circle cx="20" cy="20" r="18" fill="url(#brandGrad)"/><path d="M9 23c3.5-5.5 8.5-7 12-3.5s6.5 1.5 9-2" stroke="#f5f0e6" stroke-width="1.75" fill="none" stroke-linecap="round"/><path d="M12 27c2.5-2.5 6-3.5 9-1" stroke="#99f6e4" stroke-width="1.25" fill="none" stroke-linecap="round"/></svg>';function N(e=""){const a=$(),s=document.getElementById("site-nav");if(!s)return;const r=I.map(i=>{const f=a===i.href||e===i.key;return`<a href="${i.href}" class="nav-link${f?" is-active":""}">${i.label}</a>`}).join("");s.innerHTML=`
    <div class="nav-inner">
      <a href="index.html" class="brand" id="brand-mark" title="Gulf Coast Spearfishing">
        <span class="brand-mark">${F}</span>
        <span class="brand-text">
          <strong>Gulf Coast Spearfishing</strong>
          <em>Gulf Shores &amp; Orange Beach</em>
        </span>
      </a>

      <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-panel" id="nav-panel">
        <div class="nav-links">${r}</div>
        <div class="nav-portals">
          ${R.map(i=>`<a href="${i.href}" class="portal-chip">${i.label}</a>`).join("")}
        </div>
        <div class="nav-end">
          <button type="button" class="ambient-toggle" data-ambient-toggle aria-pressed="false" title="Play soft ocean ambience">
            ${C}
            <span class="sr-only">Toggle ocean ambience</span>
          </button>
          <a href="booking.html" class="btn btn-primary nav-cta">Book a Charter</a>
        </div>
      </div>
    </div>
  `;const t=document.getElementById("nav-toggle"),n=document.getElementById("nav-panel");t==null||t.addEventListener("click",()=>{const i=n.classList.toggle("is-open");t.setAttribute("aria-expanded",i?"true":"false")}),W()}function _(){const e=document.getElementById("site-footer");e&&(e.innerHTML=`
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <strong>Gulf Coast Spearfishing Charters</strong>
          <p>USCG-licensed captains. Purpose-built spearfishing vessels. Zeke&rsquo;s Marina &amp; Orange Beach Marina.</p>
          <button type="button" class="ambient-toggle ambient-toggle--footer" data-ambient-toggle aria-pressed="false" title="Play soft ocean ambience">
            ${C}
            <span>Ocean ambience</span>
          </button>
        </div>
        <div class="footer-cols">
          <div>
            <h4>Explore</h4>
            <a href="about.html">About</a>
            <a href="species.html">Target Species</a>
            <a href="lionfish.html">Lionfish Conservation</a>
            <a href="red-snapper-season.html">Red Snapper Season</a>
            <a href="reviews.html">Guest Reviews</a>
          </div>
          <div>
            <h4>Plan</h4>
            <a href="faq.html">FAQ</a>
            <a href="what-to-bring.html">What to Bring</a>
            <a href="safety.html">Safety &amp; Certifications</a>
            <a href="contact.html">Contact &amp; Marinas</a>
            <a href="booking.html">Book Online</a>
          </div>
          <div>
            <h4>Portals</h4>
            <a href="itinerary.html">Guest Itinerary</a>
            <a href="captain.html">Captain Portal</a>
            <a href="admin.html">Fleet Admin</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Gulf Coast Spearfishing Charters LLC</span>
        <span class="notice-tag">Gulf Shores &amp; Orange Beach</span>
      </div>
    </div>
  `)}function W(){const e=document.getElementById("brand-mark");if(!e)return;let a=0,s=null;const r=()=>{e.classList.remove("brand-ripple"),e.offsetWidth,e.classList.add("brand-ripple")};e.addEventListener("click",n=>{a+=1,clearTimeout(s),s=setTimeout(()=>{a=0},600),a>=3&&(n.preventDefault(),a=0,r())});let t=null;e.addEventListener("pointerdown",()=>{t=setTimeout(r,700)}),e.addEventListener("pointerup",()=>clearTimeout(t)),e.addEventListener("pointerleave",()=>clearTimeout(t))}function V(e=""){N(e),_(),x(),P()}export{V as i};
