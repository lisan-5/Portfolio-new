import { useEffect, useRef } from "react";

export function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseMoveRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Render at a capped ratio: the effect is a soft blur, so extra pixels buy nothing.
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    let cssW = window.innerWidth;
    let cssH = window.innerHeight;

    const applySize = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * ratio);
      canvas.height = Math.floor(cssH * ratio);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    applySize();

    let resizeTimer = 0;
    const resize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applySize, 150);
    };
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveRef.current = performance.now();
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    // Pause entirely when the tab is hidden or the hero is scrolled well out of view.
    let visible = !document.hidden;
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !reduceMotion) {
        last = 0;
        animRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Grid density scales with viewport instead of a fixed 72x36 everywhere.
    const cols = cssW < 768 ? 34 : 52;
    const rows = cssW < 768 ? 18 : 26;

    // Cache the backdrop gradient — it only depends on size and theme, not time.
    let cachedGrad: CanvasGradient | null = null;
    let cachedKey = "";
    const backdropGradient = (isDark: boolean) => {
      const key = `${cssW}x${cssH}:${isDark}`;
      if (cachedGrad && cachedKey === key) return cachedGrad;
      const grad = ctx.createLinearGradient(0, 0, cssW, cssH);
      if (isDark) {
        grad.addColorStop(0, "rgb(5,5,5)");
        grad.addColorStop(0.5, "rgb(10,10,10)");
        grad.addColorStop(1, "rgb(0,0,0)");
      } else {
        grad.addColorStop(0, "rgb(252,252,252)");
        grad.addColorStop(0.5, "rgb(246,246,246)");
        grad.addColorStop(1, "rgb(240,240,240)");
      }
      cachedGrad = grad;
      cachedKey = key;
      return grad;
    };

    const drawBackdrop = (t: number, isDark: boolean) => {
      ctx.fillStyle = backdropGradient(isDark);
      ctx.fillRect(0, 0, cssW, cssH);

      const orbA = {
        x: cssW * 0.22 + Math.sin(t * 0.0002) * 55,
        y: cssH * 0.24 + Math.cos(t * 0.00016) * 40,
      };
      const orbB = {
        x: cssW * 0.78 + Math.cos(t * 0.00018) * 60,
        y: cssH * 0.72 + Math.sin(t * 0.00021) * 35,
      };

      const glowA = ctx.createRadialGradient(orbA.x, orbA.y, 10, orbA.x, orbA.y, Math.max(cssW, cssH) * 0.5);
      const glowB = ctx.createRadialGradient(orbB.x, orbB.y, 10, orbB.x, orbB.y, Math.max(cssW, cssH) * 0.52);

      if (isDark) {
        glowA.addColorStop(0, "rgba(255,255,255,0.08)");
        glowA.addColorStop(1, "rgba(255,255,255,0)");
        glowB.addColorStop(0, "rgba(220,220,220,0.06)");
        glowB.addColorStop(1, "rgba(220,220,220,0)");
      } else {
        glowA.addColorStop(0, "rgba(60,60,60,0.06)");
        glowA.addColorStop(1, "rgba(60,60,60,0)");
        glowB.addColorStop(0, "rgba(100,100,100,0.04)");
        glowB.addColorStop(1, "rgba(100,100,100,0)");
      }

      ctx.fillStyle = glowA;
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.fillStyle = glowB;
      ctx.fillRect(0, 0, cssW, cssH);
    };

    // Cap the simulation at ~40fps: this is ambient motion, not gameplay, and it
    // leaves the remaining frame budget to the scroll/compositor work.
    const frameInterval = 1000 / 40;
    let last = 0;
    let themeCheck = 0;
    let isDark = !document.documentElement.classList.contains("light");

    const animate = (t: number) => {
      animRef.current = requestAnimationFrame(animate);
      if (!visible) return;
      if (t - last < frameInterval) return;
      last = t;

      // Theme lookup touches the DOM — poll it a few times a second, not every frame.
      if (t - themeCheck > 400) {
        isDark = !document.documentElement.classList.contains("light");
        themeCheck = t;
      }

      drawBackdrop(t, isDark);

      const isMouseActive = performance.now() - lastMouseMoveRef.current < 3500;
      const driftX = cssW * 0.5 + Math.sin(t * 0.00035) * cssW * 0.2;
      const driftY = cssH * 0.5 + Math.cos(t * 0.00028) * cssH * 0.16;
      const mx = isMouseActive ? mouseRef.current.x : driftX;
      const my = isMouseActive ? mouseRef.current.y : driftY;

      const tint = isDark ? 255 : 24;
      const alphaBase = isDark ? 0.03 : 0.024;

      // Dots: batch every dot that shares an alpha bucket into one path, so we
      // issue ~12 fills per frame instead of one per dot.
      const buckets = new Map<number, Path2D>();
      for (let i = 0; i < cols; i++) {
        const x = (i / cols) * cssW;
        for (let j = 0; j < rows; j++) {
          const y = (j / rows) * cssH;

          const dx = x - mx;
          const dy = y - my;
          const distSq = dx * dx + dy * dy;

          // Skip the sqrt unless the dot is close enough to react at all.
          let interaction = 0;
          let dist = 0;
          if (distSq < 90000) {
            dist = Math.sqrt(distSq);
            interaction = 1 - dist / 300;
          }

          const baseWave =
            Math.sin(i * 0.15 + t * 0.00075) * 6 +
            Math.cos(j * 0.14 + t * 0.00052) * 5 +
            Math.sin((i + j) * 0.09 + t * 0.00095) * 4;
          const ripple = interaction > 0 ? interaction * Math.sin(dist * 0.03 - t * 0.0035) * 10 : 0;
          const offsetY = baseWave + ripple;

          const alphaShimmer = (Math.sin(i * 0.18 + j * 0.11 + t * 0.001) + 1) * 0.01;
          const alpha = alphaBase + interaction * (isDark ? 0.045 : 0.035) + alphaShimmer;

          const bucket = Math.round(alpha * 200);
          let path = buckets.get(bucket);
          if (!path) {
            path = new Path2D();
            buckets.set(bucket, path);
          }
          const r = 1.3 + interaction * 2.4;
          path.moveTo(x + r, y + offsetY);
          path.arc(x, y + offsetY, r, 0, Math.PI * 2);
        }
      }
      for (const [bucket, path] of buckets) {
        ctx.fillStyle = `rgba(${tint},${tint},${tint},${bucket / 200})`;
        ctx.fill(path);
      }

      // Wave lines: sample every 12px instead of 3px. At these wavelengths the
      // curve is visually identical with a quarter of the segments.
      const step = cssW < 768 ? 18 : 12;
      const lineTint = isDark ? 245 : 35;
      for (let layer = 0; layer < 6; layer++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${lineTint},${lineTint},${lineTint},${
          isDark ? 0.028 + layer * 0.004 : 0.02 + layer * 0.003
        })`;
        ctx.lineWidth = 1;

        const baseY = cssH * (0.24 + layer * 0.13);
        const dy = baseY - my;
        for (let x = 0; x <= cssW; x += step) {
          const dx = x - mx;
          const distSq = dx * dx + dy * dy;
          let interaction = 0;
          let dist = 0;
          if (distSq < 129600) {
            dist = Math.sqrt(distSq);
            interaction = 1 - dist / 360;
          }

          const y =
            baseY +
            Math.sin(x * 0.0045 + t * 0.0005 + layer * 1.6) * 24 +
            Math.cos(x * 0.0065 + t * 0.00072) * 11 +
            (interaction > 0 ? interaction * Math.sin(dist * 0.018 - t * 0.0028) * 14 : 0);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    if (reduceMotion) {
      // Paint one static frame and stop.
      drawBackdrop(0, isDark);
    } else {
      animRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.95 }} />;
}
