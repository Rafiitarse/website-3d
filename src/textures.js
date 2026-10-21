import * as THREE from 'three';

const TAU = Math.PI * 2;

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function mixColor(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function toTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Tekstur planet prosedural: pita atmosfer, bintik, kawah, dan benua.
 * Semua digambar di canvas supaya project tidak butuh file gambar.
 */
export function makePlanetTexture({
  base,
  accent,
  bands = 4,
  noise = 0.2,
  craters = 0,
  continents = false,
  clouds = false,
  spot = false,
}) {
  const width = 1024;
  const height = 512;
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  // Pita warna horizontal (Jupiter, Saturnus, Venus).
  for (let i = 0; i < bands; i += 1) {
    const y = rand(0, height);
    const bandHeight = rand(height * 0.02, height * 0.11);
    ctx.globalAlpha = rand(0.12, 0.4);
    ctx.fillStyle = mixColor(base, accent, rand(0.25, 0.85));
    ctx.fillRect(0, y, width, bandHeight);
  }
  ctx.globalAlpha = 1;

  // Benua / daratan untuk planet berbatu.
  if (continents) {
    for (let i = 0; i < 26; i += 1) {
      const x = rand(0, width);
      const y = rand(height * 0.1, height * 0.9);
      const rx = rand(20, 90);
      const ry = rand(12, 55);
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rand(0, TAU), 0, TAU);
      ctx.fillStyle = mixColor(accent, base, rand(0, 0.45));
      ctx.globalAlpha = rand(0.5, 0.95);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Awan tipis.
  if (clouds) {
    for (let i = 0; i < 40; i += 1) {
      const x = rand(0, width);
      const y = rand(0, height);
      const rx = rand(30, 110);
      const ry = rand(8, 26);
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rand(-0.4, 0.4), 0, TAU);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.globalAlpha = rand(0.05, 0.2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Bintik halus untuk tekstur permukaan.
  const speckles = Math.floor(900 * noise);
  for (let i = 0; i < speckles; i += 1) {
    const x = rand(0, width);
    const y = rand(0, height);
    const r = rand(1, 5);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = Math.random() > 0.5 ? accent : '#ffffff';
    ctx.globalAlpha = rand(0.02, 0.09);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Kawah untuk Merkurius, Mars, dan Bulan.
  for (let i = 0; i < craters; i += 1) {
    const x = rand(0, width);
    const y = rand(height * 0.05, height * 0.95);
    const r = rand(4, 20);
    const gradient = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.28)');
    gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.14)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Bintik Merah Besar Jupiter.
  if (spot) {
    const x = width * 0.63;
    const y = height * 0.62;
    const gradient = ctx.createRadialGradient(x, y, 4, x, y, 80);
    gradient.addColorStop(0, 'rgba(176, 58, 36, 0.95)');
    gradient.addColorStop(0.55, 'rgba(196, 96, 60, 0.7)');
    gradient.addColorStop(1, 'rgba(196, 96, 60, 0)');
    ctx.beginPath();
    ctx.ellipse(x, y, 92, 46, 0, 0, TAU);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  return toTexture(canvas);
}

export function makeSunTexture() {
  const width = 1024;
  const height = 512;
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#fff3b0');
  gradient.addColorStop(0.45, '#ffb02e');
  gradient.addColorStop(1, '#f06a12');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 260; i += 1) {
    const x = rand(0, width);
    const y = rand(0, height);
    const r = rand(6, 46);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, 'rgba(255, 255, 220, 0.5)');
    glow.addColorStop(1, 'rgba(255, 140, 20, 0)');
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  return toTexture(canvas);
}

export function makeGlowTexture() {
  const size = 512;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const center = size / 2;

  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, 'rgba(255, 245, 210, 1)');
  gradient.addColorStop(0.18, 'rgba(255, 205, 110, 0.85)');
  gradient.addColorStop(0.42, 'rgba(255, 140, 40, 0.32)');
  gradient.addColorStop(0.75, 'rgba(255, 110, 20, 0.08)');
  gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeRingTexture() {
  const width = 512;
  const height = 16;
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);
  for (let x = 0; x < width; x += 1) {
    const t = x / width;
    const band = 0.35 + 0.35 * Math.sin(t * 46) + 0.2 * Math.sin(t * 13 + 1.2);
    const gap = t > 0.62 && t < 0.68 ? 0.15 : 1;
    const alpha = Math.max(0, Math.min(1, band)) * gap;
    const shade = 190 + Math.round(45 * Math.sin(t * 21));
    ctx.fillStyle = `rgba(${shade + 30}, ${shade}, ${Math.max(0, shade - 45)}, ${alpha})`;
    ctx.fillRect(x, 0, 1, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  return texture;
}

export function makeStarTexture() {
  const size = 64;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.35, 'rgba(210, 228, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(160, 190, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
