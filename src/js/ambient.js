/**
 * Optional ambient ocean bed — never autoplays unmuted.
 * Preference key: gs_ambient_sound ("on" | "off")
 * Audio: Web Audio API gentle filtered noise + slow LFO (no external asset).
 */

const PREF_KEY = 'gs_ambient_sound';
let ctx = null;
let master = null;
let nodes = [];
let playing = false;

function preferReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function createBed(audioCtx) {
  const bufferSize = 2 * audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.4;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 480;
  filter.Q.value = 0.7;

  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const wave = audioCtx.createOscillator();
  wave.type = 'sine';
  wave.frequency.value = 55;
  const waveGain = audioCtx.createGain();
  waveGain.gain.value = 0.015;

  const gain = audioCtx.createGain();
  gain.gain.value = 0;

  source.connect(filter);
  filter.connect(gain);
  wave.connect(waveGain);
  waveGain.connect(gain);

  return { source, filter, lfo, wave, waveGain, gain };
}

async function startAmbient() {
  if (playing || preferReducedMotion()) return;
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') await ctx.resume();

  const bed = createBed(ctx);
  master = ctx.createGain();
  master.gain.value = 0.18; // ~18% perceived bed
  bed.gain.connect(master);
  master.connect(ctx.destination);

  bed.source.start();
  bed.lfo.start();
  bed.wave.start();
  bed.gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);

  nodes = [bed];
  playing = true;
  syncToggleUI(true);
}

function stopAmbient() {
  if (!playing || !ctx) {
    playing = false;
    syncToggleUI(false);
    return;
  }
  const now = ctx.currentTime;
  nodes.forEach((bed) => {
    try {
      bed.gain.gain.cancelScheduledValues(now);
      bed.gain.gain.linearRampToValueAtTime(0, now + 0.6);
      setTimeout(() => {
        try { bed.source.stop(); bed.lfo.stop(); bed.wave.stop(); } catch (_) {}
      }, 700);
    } catch (_) {}
  });
  nodes = [];
  playing = false;
  syncToggleUI(false);
}

function syncToggleUI(on) {
  document.querySelectorAll('[data-ambient-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = on ? 'Mute ocean ambience' : 'Play soft ocean ambience';
    btn.classList.toggle('is-on', on);
  });
}

export function getAmbientPreference() {
  return localStorage.getItem(PREF_KEY) === 'on';
}

export async function toggleAmbient() {
  if (playing) {
    stopAmbient();
    localStorage.setItem(PREF_KEY, 'off');
  } else {
    await startAmbient();
    localStorage.setItem(PREF_KEY, 'on');
  }
}

export function bindAmbientToggles() {
  document.querySelectorAll('[data-ambient-toggle]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAmbient();
    });
  });
  // Restore preference only after explicit prior consent (stored "on")
  // Still requires a gesture on many browsers — we attempt; if blocked, UI stays off.
  if (getAmbientPreference()) {
    syncToggleUI(true);
    // Do not auto-start without gesture; mark UI as "ready to resume"
    document.querySelectorAll('[data-ambient-toggle]').forEach((btn) => {
      btn.classList.add('is-pending');
      btn.title = 'Tap to resume ocean ambience';
    });
    const resume = async () => {
      if (getAmbientPreference() && !playing) await startAmbient();
      document.querySelectorAll('[data-ambient-toggle]').forEach((b) => b.classList.remove('is-pending'));
      window.removeEventListener('pointerdown', resume);
    };
    window.addEventListener('pointerdown', resume, { once: true });
  } else {
    syncToggleUI(false);
  }
}

export function isAmbientPlaying() {
  return playing;
}
