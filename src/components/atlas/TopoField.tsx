/**
 * A living topographic map, drawn on the GPU.
 *
 * A fractal-noise heightfield drifts slowly; contour lines are extracted per pixel in a
 * fragment shader (fract of height × levels, anti-aliased with screen-space derivatives),
 * with every fifth line drawn as a heavier index contour. The pointer raises a hill the
 * contours flow around, and those nearby lines pick up the accent colour. Scrolling
 * slides the terrain, so moving down the page feels like flying over the land.
 *
 * The same height function runs in JS (`heightAt`) so the UI can read the elevation
 * under the cursor. Pauses when the tab is hidden; a still frame for reduced motion.
 */
import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uLift;
uniform float uScroll;
uniform float uZoom;
uniform float uVel;
uniform vec3 uBg;
uniform vec3 uLine;
uniform vec3 uIndex;
uniform vec3 uAccent;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
float height(vec2 q) {
  vec2 drift = vec2(uTime * 0.012, uTime * 0.007 - uScroll * 0.55);
  return fbm(q * 1.35 * uZoom + drift);
}

void main() {
  vec2 q = gl_FragCoord.xy / uRes.y;
  vec2 m = uMouse / uRes.y;
  // fast scrolling stretches the land along the direction of travel
  vec2 c = vec2(0.5 * uRes.x / uRes.y, 0.5);
  vec2 qs = c + (q - c) * vec2(1.0, 1.0 / (1.0 + uVel));
  float h = height(qs);
  // the pointer pushes up a hill
  float d = distance(q, m);
  float hill = exp(-d * d / 0.018);
  h += hill * 0.32 * uLift;

  float levels = 26.0 / mix(1.0, 2.4, clamp((uZoom - 1.0) / 7.0, 0.0, 1.0));
  float v = h * levels;
  float f = fract(v);
  float w = fwidth(v);
  float dist = min(f, 1.0 - f) / max(w, 1e-4);
  float isIndex = step(abs(mod(floor(v + 0.5), 5.0)), 0.5);
  float line = 1.0 - smoothstep(0.0, mix(1.0, 1.9, isIndex), dist);

  vec3 lineCol = mix(uLine, uIndex, isIndex);
  float glow = exp(-d * d / 0.03) * uLift;
  lineCol = mix(lineCol, uAccent, glow * 0.85);

  // soft hypsometric tint: higher ground a touch lighter
  vec3 ground = mix(uBg, mix(uBg, uIndex, 0.18), smoothstep(0.35, 0.85, h));
  vec3 col = mix(ground, lineCol, line * (0.75 + 0.25 * isIndex));

  // vignette toward the sheet edge
  vec2 uv = gl_FragCoord.xy / uRes;
  float vig = smoothstep(1.15, 0.35, length(uv - 0.5) * 1.4);
  col = mix(uBg, col, 0.55 + 0.45 * vig);
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ---- JS twin of the shader's height function, for the elevation readout ---- */
const fract = (x: number) => x - Math.floor(x);
const hash = (x: number, y: number) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return (a + (b - a) * ux) * (1 - uy) + (c + (d - c) * ux) * uy;
}
function fbm(x: number, y: number) {
  let v = 0;
  let a = 0.5;
  for (let i = 0; i < 5; i++) {
    v += a * noise(x, y);
    const nx = x * 2.02 + 1.7;
    y = y * 2.02 + 9.2;
    x = nx;
    a *= 0.5;
  }
  return v;
}

/** Shared state so the UI can read where the pointer is on the map. */
export const topo = {
  time: 0,
  scroll: 0,
  /** Terrain zoom (1 = street level); the flyover scene drives this. */
  zoom: 1,
  res: { w: 1, h: 1 },
  /** Normalised height (≈0..1) at a client-space point. */
  heightAt(cx: number, cy: number) {
    const x = cx / this.res.h;
    const y = (this.res.h - cy) / this.res.h;
    const z = 1.35 * this.zoom;
    return fbm(x * z + this.time * 0.012, y * z + this.time * 0.007 - this.scroll * 0.55);
  },
};

function hexToRgb(color: string): [number, number, number] {
  const c = document.createElement("canvas").getContext("2d")!;
  c.fillStyle = color;
  const hex = c.fillStyle as string; // normalised to #rrggbb
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function TopoField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl || !gl.getExtension("OES_standard_derivatives")) {
      canvas.style.display = "none";
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("uRes"),
      time: u("uTime"),
      mouse: u("uMouse"),
      lift: u("uLift"),
      scroll: u("uScroll"),
      zoom: u("uZoom"),
      vel: u("uVel"),
      bg: u("uBg"),
      line: u("uLine"),
      index: u("uIndex"),
      accent: u("uAccent"),
    };

    const applyTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      gl.uniform3fv(U.bg, hexToRgb(cs.getPropertyValue("--background").trim()));
      gl.uniform3fv(U.line, hexToRgb(cs.getPropertyValue("--contour").trim()));
      gl.uniform3fv(U.index, hexToRgb(cs.getPropertyValue("--contour-index").trim()));
      gl.uniform3fv(U.accent, hexToRgb(cs.getPropertyValue("--accent").trim()));
    };
    applyTheme();
    const mo = new MutationObserver(applyTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      topo.res = { w, h };
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, lift: 0, tlift: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      if (mouse.x < -9000) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.tlift = 1;
    };
    const onLeave = () => (mouse.tlift = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const t0 = performance.now();
    let lastScroll = window.scrollY;
    let vel = 0;
    let zoom = 1;
    const frame = (now: number) => {
      const t = reduced ? 40 : (now - t0) / 1000 + 40;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.lift += (mouse.tlift - mouse.lift) * 0.04;
      const scroll = window.scrollY / Math.max(1, window.innerHeight);
      const dy = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      vel += (Math.min(1.2, dy / 60) - vel) * 0.12;
      zoom += (topo.zoom - zoom) * 0.12;
      gl.uniform1f(U.vel, reduced ? 0 : vel);
      gl.uniform1f(U.zoom, zoom);
      topo.time = t;
      topo.scroll = scroll;
      gl.uniform1f(U.time, t);
      gl.uniform1f(U.scroll, scroll);
      gl.uniform2f(U.mouse, mouse.x * dpr, (canvas.clientHeight - mouse.y) * dpr);
      gl.uniform1f(U.lift, mouse.lift);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener("visibilitychange", onVis);
    const onScroll = () => reduced && start();
    window.addEventListener("scroll", onScroll, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
