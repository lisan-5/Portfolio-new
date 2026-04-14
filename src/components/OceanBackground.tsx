import { useEffect, useRef } from "react";

export function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
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
    };
    window.addEventListener("mousemove", handleMouse);

    const cols = 80;
    const rows = 40;

    const animate = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i / cols) * w;
          const y = (j / rows) * h;

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseFactor = Math.max(0, 1 - dist / 250);

          const wave1 = Math.sin(i * 0.15 + t * 0.0008) * 8;
          const wave2 = Math.cos(j * 0.12 + t * 0.0006) * 6;
          const wave3 = Math.sin((i + j) * 0.1 + t * 0.001) * 4;
          const ripple = mouseFactor * Math.sin(dist * 0.03 - t * 0.004) * 15;

          const offsetY = wave1 + wave2 + wave3 + ripple;

          const baseAlpha = 0.03 + mouseFactor * 0.12;
          const waveAlpha = (Math.sin(i * 0.15 + j * 0.1 + t * 0.001) + 1) * 0.02;

          // Get theme from document
          const isDark = !document.documentElement.classList.contains("light");
          const r = isDark ? 120 : 30;
          const g = isDark ? 200 : 130;
          const b = isDark ? 220 : 180;

          ctx.fillStyle = `rgba(${r},${g},${b},${baseAlpha + waveAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y + offsetY, 1.5 + mouseFactor * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw wave lines
      const isDark = !document.documentElement.classList.contains("light");
      for (let l = 0; l < 5; l++) {
        ctx.beginPath();
        ctx.strokeStyle = isDark
          ? `rgba(120,200,220,${0.02 + l * 0.005})`
          : `rgba(30,130,180,${0.03 + l * 0.005})`;
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 3) {
          const baseY = h * (0.3 + l * 0.15);
          const dx = x - mx;
          const dy = baseY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseFactor = Math.max(0, 1 - dist / 300);
          const y =
            baseY +
            Math.sin(x * 0.005 + t * 0.0005 + l * 2) * 30 +
            Math.cos(x * 0.008 + t * 0.0008) * 15 +
            mouseFactor * Math.sin(dist * 0.02 - t * 0.003) * 25;
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

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
