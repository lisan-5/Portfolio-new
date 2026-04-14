import { useEffect, useRef } from "react";

export function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseMoveRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveRef.current = performance.now();
    };
    window.addEventListener("mousemove", handleMouse);

    const cols = 72;
    const rows = 36;

    const drawBackdrop = (t: number, isDark: boolean) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      if (isDark) {
        grad.addColorStop(0, "rgba(5,5,5,0.98)");
        grad.addColorStop(0.5, "rgba(10,10,10,0.96)");
        grad.addColorStop(1, "rgba(0,0,0,0.98)");
      } else {
        grad.addColorStop(0, "rgba(252,252,252,0.99)");
        grad.addColorStop(0.5, "rgba(246,246,246,0.97)");
        grad.addColorStop(1, "rgba(240,240,240,0.98)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const orbA = {
        x: w * 0.22 + Math.sin(t * 0.0002) * 55,
        y: h * 0.24 + Math.cos(t * 0.00016) * 40,
      };
      const orbB = {
        x: w * 0.78 + Math.cos(t * 0.00018) * 60,
        y: h * 0.72 + Math.sin(t * 0.00021) * 35,
      };

      const glowA = ctx.createRadialGradient(orbA.x, orbA.y, 10, orbA.x, orbA.y, Math.max(w, h) * 0.5);
      const glowB = ctx.createRadialGradient(orbB.x, orbB.y, 10, orbB.x, orbB.y, Math.max(w, h) * 0.52);

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
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = glowB;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = (t: number) => {
      const isDark = !document.documentElement.classList.contains("light");
      drawBackdrop(t, isDark);

      const isMouseActive = performance.now() - lastMouseMoveRef.current < 3500;
      const driftX = w * 0.5 + Math.sin(t * 0.00035) * w * 0.2;
      const driftY = h * 0.5 + Math.cos(t * 0.00028) * h * 0.16;
      const mx = isMouseActive ? mouseRef.current.x : driftX;
      const my = isMouseActive ? mouseRef.current.y : driftY;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i / cols) * w;
          const y = (j / rows) * h;

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const interaction = Math.max(0, 1 - dist / 300);
          const baseWave =
            Math.sin(i * 0.15 + t * 0.00075) * 6 +
            Math.cos(j * 0.14 + t * 0.00052) * 5 +
            Math.sin((i + j) * 0.09 + t * 0.00095) * 4;
          const ripple = interaction * Math.sin(dist * 0.03 - t * 0.0035) * 10;
          const offsetY = baseWave + ripple;

          const alphaBase = isDark ? 0.03 : 0.024;
          const alphaHover = interaction * (isDark ? 0.045 : 0.035);
          const alphaShimmer = (Math.sin(i * 0.18 + j * 0.11 + t * 0.001) + 1) * 0.01;
          const alpha = alphaBase + alphaHover + alphaShimmer;

          const tint = isDark ? 255 : 24;

          ctx.fillStyle = `rgba(${tint},${tint},${tint},${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y + offsetY, 1.3 + interaction * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let layer = 0; layer < 6; layer++) {
        ctx.beginPath();
        const lineAlpha = isDark ? 0.028 + layer * 0.004 : 0.02 + layer * 0.003;
        const lineTint = isDark ? 245 : 35;
        ctx.strokeStyle = `rgba(${lineTint},${lineTint},${lineTint},${lineAlpha})`;
        ctx.lineWidth = 1;

        for (let x = 0; x < w; x += 3) {
          const baseY = h * (0.24 + layer * 0.13);
          const dx = x - mx;
          const dy = baseY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const interaction = Math.max(0, 1 - dist / 360);

          const y =
            baseY +
            Math.sin(x * 0.0045 + t * 0.0005 + layer * 1.6) * 24 +
            Math.cos(x * 0.0065 + t * 0.00072) * 11 +
            interaction * Math.sin(dist * 0.018 - t * 0.0028) * 14;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.95 }} />;
}
