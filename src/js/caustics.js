/**
 * Soft underwater caustics / wave shimmer — low opacity CSS + canvas.
 * Pauses when prefers-reduced-motion.
 */

export function mountCaustics(targetSelector = '[data-caustics]') {
  const roots = document.querySelectorAll(targetSelector);
  if (!roots.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  roots.forEach((root) => {
    if (root.querySelector('.caustics-layer')) return;

    const layer = document.createElement('div');
    layer.className = 'caustics-layer';
    layer.setAttribute('aria-hidden', 'true');

    const canvas = document.createElement('canvas');
    canvas.className = 'caustics-canvas';
    layer.appendChild(canvas);
    root.prepend(layer);

    if (reduce) {
      layer.classList.add('is-static');
      drawStatic(canvas, root);
      return;
    }

    let raf = 0;
    let t = 0;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Soft vignette wash
      const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 40, w * 0.5, h * 0.4, Math.max(w, h) * 0.7);
      g.addColorStop(0, 'rgba(94, 234, 212, 0.04)');
      g.addColorStop(0.55, 'rgba(14, 138, 191, 0.03)');
      g.addColorStop(1, 'rgba(6, 16, 28, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Slow caustic ribbons
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        const yBase = h * (0.15 + i * 0.14);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.012 + t * 0.35 + i) * (10 + i * 2) +
            Math.sin(x * 0.004 + t * 0.2 + i * 1.7) * 18;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(165, 243, 252, ${0.045 + i * 0.008})`;
        ctx.lineWidth = 1.2 + i * 0.15;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';

      // Specular flecks
      for (let i = 0; i < 12; i++) {
        const x = ((Math.sin(t * 0.15 + i * 2.1) + 1) / 2) * w;
        const y = ((Math.cos(t * 0.11 + i * 1.4) + 1) / 2) * h * 0.85;
        const r = 0.8 + (i % 3) * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.fill();
      }

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else if (!raf && !reduce) {
          draw();
        }
      });
    }, { threshold: 0.05 });
    io.observe(root);
  });
}

function drawStatic(canvas, root) {
  const ctx = canvas.getContext('2d');
  const rect = root.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  g.addColorStop(0, 'rgba(14, 138, 191, 0.05)');
  g.addColorStop(1, 'rgba(13, 148, 136, 0.03)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, rect.width, rect.height);
}
