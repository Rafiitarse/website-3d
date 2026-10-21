import * as THREE from 'three';
import {
  makeGlowTexture,
  makePlanetTexture,
  makeRingTexture,
  makeStarTexture,
  makeSunTexture,
} from './textures.js';

const ORBIT_BASE = 0.36;
const EARTH_DISTANCE = 14.5;

export const PLANETS = [
  {
    id: 'merkurius',
    name: 'Merkurius',
    radius: 0.58,
    distance: 8.5,
    inclination: 0.03,
    spin: 0.18,
    texture: { base: '#8d8378', accent: '#4d4740', bands: 1, noise: 0.32, craters: 30 },
    info: {
      jarak: '57,9 juta km',
      revolusi: '88 hari',
      rotasi: '58,6 hari',
      bulan: '0',
      fakta: 'Planet terkecil dan paling dekat ke Matahari. Suhu siangnya bisa mencapai 430 °C, tetapi malamnya turun sampai -180 °C.',
    },
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 0.82,
    distance: 11.5,
    inclination: 0.02,
    spin: -0.1,
    texture: { base: '#d9b06f', accent: '#f2ddb0', bands: 7, noise: 0.18 },
    info: {
      jarak: '108,2 juta km',
      revolusi: '225 hari',
      rotasi: '243 hari (retrograd)',
      bulan: '0',
      fakta: 'Planet terpanas di tata surya, sekitar 465 °C, karena efek rumah kaca dari atmosfer karbon dioksidanya.',
    },
  },
  {
    id: 'bumi',
    name: 'Bumi',
    radius: 0.88,
    distance: EARTH_DISTANCE,
    inclination: 0,
    spin: 0.55,
    texture: {
      base: '#1f5fbf',
      accent: '#2f8f4f',
      bands: 0,
      noise: 0.2,
      continents: true,
      clouds: true,
    },
    moon: { radius: 0.22, distance: 1.9, speed: 0.9 },
    info: {
      jarak: '149,6 juta km',
      revolusi: '365,25 hari',
      rotasi: '24 jam',
      bulan: '1',
      fakta: 'Satu-satunya planet yang diketahui memiliki kehidupan. Sekitar 71% permukaannya tertutup air.',
    },
  },
  {
    id: 'mars',
    name: 'Mars',
    radius: 0.66,
    distance: 18.5,
    inclination: 0.025,
    spin: 0.52,
    texture: { base: '#b5502f', accent: '#7a3a22', bands: 3, noise: 0.28, craters: 14 },
    info: {
      jarak: '227,9 juta km',
      revolusi: '687 hari',
      rotasi: '24,6 jam',
      bulan: '2',
      fakta: 'Rumah bagi Olympus Mons, gunung berapi tertinggi di tata surya dengan tinggi sekitar 22 km.',
    },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 1.65,
    distance: 25,
    inclination: 0.015,
    spin: 1.3,
    texture: { base: '#d6b48b', accent: '#a87b52', bands: 12, noise: 0.1, spot: true },
    info: {
      jarak: '778,5 juta km',
      revolusi: '11,9 tahun',
      rotasi: '9,9 jam',
      bulan: '95',
      fakta: 'Planet terbesar di tata surya. Bintik Merah Besarnya adalah badai raksasa yang lebih besar dari Bumi.',
    },
  },
  {
    id: 'saturnus',
    name: 'Saturnus',
    radius: 1.4,
    distance: 32,
    inclination: 0.04,
    spin: 1.15,
    texture: { base: '#e2cba1', accent: '#c2a273', bands: 10, noise: 0.08 },
    ring: { inner: 1.55, outer: 2.5 },
    info: {
      jarak: '1,43 miliar km',
      revolusi: '29,5 tahun',
      rotasi: '10,7 jam',
      bulan: '146',
      fakta: 'Terkenal karena cincin es dan debunya yang sangat lebar, meski tebalnya di banyak tempat hanya sekitar 10 meter.',
    },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radius: 1.02,
    distance: 38.5,
    inclination: 0.05,
    spin: 0.85,
    texture: { base: '#8fd7dc', accent: '#64b3bd', bands: 4, noise: 0.06 },
    info: {
      jarak: '2,87 miliar km',
      revolusi: '84 tahun',
      rotasi: '17,2 jam',
      bulan: '28',
      fakta: 'Porosnya miring hampir 98°, jadi planet ini seolah "rebahan" saat mengelilingi Matahari.',
    },
  },
  {
    id: 'neptunus',
    name: 'Neptunus',
    radius: 0.98,
    distance: 44,
    inclination: 0.035,
    spin: 0.9,
    texture: { base: '#3f63c9', accent: '#2b4699', bands: 5, noise: 0.12 },
    info: {
      jarak: '4,5 miliar km',
      revolusi: '165 tahun',
      rotasi: '16,1 jam',
      bulan: '16',
      fakta: 'Planet terjauh dari Matahari. Angin di atmosfernya bisa mencapai 2.100 km/jam, tercepat di tata surya.',
    },
  },
];

function makeLabelSprite(text, { color = '#dfe9ff', height = 1.3, weight = 600 } = {}) {
  const fontSize = 56;
  const padding = 20;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `${weight} ${fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;

  ctx.font = font;
  const textWidth = ctx.measureText(text).width;
  canvas.width = Math.ceil(textWidth + padding * 2);
  canvas.height = Math.ceil(fontSize * 1.6);

  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 14;
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set((canvas.width / canvas.height) * height, height, 1);
  sprite.renderOrder = 10;
  sprite.userData.baseScale = sprite.scale.clone();
  sprite.userData.hoverScale = 1;
  return sprite;
}

function makeOrbitLine(radius, color = 0x4a5f82) {
  const segments = 256;
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.38,
  });
  return new THREE.LineLoop(geometry, material);
}

function makeRingMesh(radius, { inner, outer }) {
  const geometry = new THREE.RingGeometry(radius * inner, radius * outer, 128, 1);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const vertex = new THREE.Vector3();
  const innerRadius = radius * inner;
  const outerRadius = radius * outer;

  // RingGeometry default UV tidak radial, jadi dipetakan ulang supaya
  // tekstur pita cincin mengikuti arah jari-jari.
  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i);
    const distance = vertex.length();
    uv.setXY(i, (distance - innerRadius) / (outerRadius - innerRadius), 0.5);
  }

  const material = new THREE.MeshBasicMaterial({
    map: makeRingTexture(),
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function createStarfield() {
  const count = 2600;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const radius = 140 + Math.random() * 260;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    color.setHSL(0.58 + Math.random() * 0.08, 0.35, 0.65 + Math.random() * 0.3);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.6,
    map: makeStarTexture(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

function createAsteroidBelt() {
  const count = 900;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const radius = 20.4 + Math.random() * 2.6;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.7;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    color.setHSL(0.08, 0.2, 0.45 + Math.random() * 0.3);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

export function createSolarSystem(scene) {
  scene.background = new THREE.Color('#03050c');

  const bodies = [];

  scene.add(createStarfield());

  // Pencahayaan: Matahari sebagai sumber utama.
  const sunLight = new THREE.PointLight(0xfff2d0, 3.2, 0, 0);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x8fa6cc, 0.28));

  // Matahari
  const sunGroup = new THREE.Group();
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(3.6, 64, 48),
    new THREE.MeshBasicMaterial({ map: makeSunTexture() }),
  );
  sunMesh.name = 'matahari';
  sunGroup.add(sunMesh);

  const glowTexture = makeGlowTexture();
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xffc061,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  glow.scale.setScalar(17);
  sunGroup.add(glow);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0xff8a24,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  halo.scale.setScalar(27);
  sunGroup.add(halo);

  const sunLabel = makeLabelSprite('Matahari', { color: '#ffe7a8', height: 1.55 });
  sunLabel.position.set(0, 7.2, 0);
  sunGroup.add(sunLabel);

  // Area klik yang lebih besar dari bentuk aslinya, tidak ikut dirender.
  const sunHit = new THREE.Mesh(
    new THREE.SphereGeometry(5, 16, 12),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  sunGroup.add(sunHit);
  scene.add(sunGroup);

  bodies.push({
    id: 'matahari',
    mesh: sunMesh,
    hitMesh: sunHit,
    focus: sunGroup,
    label: sunLabel,
    focusDistance: 24,
    data: {
      name: 'Matahari',
      info: {
        jarak: 'Pusat tata surya',
        revolusi: '—',
        rotasi: '±25 hari',
        bulan: '—',
        fakta: 'Bintang di pusat tata surya. Massanya sekitar 99,8% dari seluruh massa tata surya dan suhu permukaannya sekitar 5.500 °C.',
      },
    },
  });

  // Planet-planet
  for (const [index, planet] of PLANETS.entries()) {
    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.x = planet.inclination;

    const orbitGroup = new THREE.Group();
    // Sudut awal disebar supaya planet tidak tampak berbaris lurus.
    orbitGroup.rotation.y = (index * 2.4) % (Math.PI * 2);
    tiltGroup.add(orbitGroup);

    const holder = new THREE.Group();
    holder.position.x = planet.distance;
    orbitGroup.add(holder);

    const texture = makePlanetTexture(planet.texture);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(planet.radius, 48, 32),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.92, metalness: 0.02 }),
    );
    mesh.name = planet.id;
    holder.add(mesh);

    const hitMesh = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(planet.radius * 2.2, 1.1), 16, 12),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    holder.add(hitMesh);

    const orbitLine = makeOrbitLine(planet.distance);
    tiltGroup.add(orbitLine);
    scene.add(tiltGroup);

    // Label dinaikkan bergantian supaya planet-planet dalam tidak saling menimpa.
    const label = makeLabelSprite(planet.name);
    label.position.set(0, planet.radius + 1.0 + (index % 2) * 0.95, 0);
    holder.add(label);

    if (planet.ring) {
      const ring = makeRingMesh(planet.radius, planet.ring);
      ring.position.y = 0;
      holder.add(ring);
    }

    const moons = [];
    if (planet.moon) {
      const moonPivot = new THREE.Group();
      const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.moon.radius, 24, 16),
        new THREE.MeshStandardMaterial({
          map: makePlanetTexture({
            base: '#b9b6b0',
            accent: '#6c6a66',
            bands: 0,
            noise: 0.25,
            craters: 26,
          }),
          roughness: 1,
          metalness: 0,
        }),
      );
      moonMesh.position.x = planet.moon.distance;
      moonPivot.add(moonMesh);
      holder.add(moonPivot);
      moons.push({ pivot: moonPivot, speed: planet.moon.speed });
    }

    bodies.push({
      id: planet.id,
      mesh,
      hitMesh,
      focus: holder,
      label,
      orbitLine,
      focusDistance: planet.radius * 7 + 2.6,
      data: { name: planet.name, info: planet.info },
      orbitSpeed: ORBIT_BASE * Math.pow(EARTH_DISTANCE / planet.distance, 1.5),
      spinSpeed: planet.spin,
      orbitGroup,
      moons,
    });
  }

  const asteroidBelt = createAsteroidBelt();
  scene.add(asteroidBelt);

  let elapsed = 0;

  function update(delta) {
    elapsed += delta;
    sunMesh.rotation.y += delta * 0.05;
    asteroidBelt.rotation.y += delta * 0.02;

    for (const body of bodies) {
      if (!body.orbitGroup) continue;
      body.orbitGroup.rotation.y += body.orbitSpeed * delta;
      body.mesh.rotation.y += body.spinSpeed * delta;
      for (const moon of body.moons) {
        moon.pivot.rotation.y += moon.speed * delta;
      }
    }

    // Denyut halus pada lapisan glow Matahari.
    const pulse = 1 + Math.sin(elapsed * 1.4) * 0.02;
    glow.scale.setScalar(17 * pulse);
    halo.scale.setScalar(27 * (2 - pulse));
  }

  const labelWorldPosition = new THREE.Vector3();

  // Label dijaga berukuran tetap di layar, berapa pun jarak kamera.
  // Di layar sempit label sedikit dikecilkan supaya tidak saling menimpa.
  function updateLabels(camera) {
    const aspectScale = THREE.MathUtils.clamp(camera.aspect / 1.2, 0.62, 1);

    for (const body of bodies) {
      const label = body.label;
      if (!label) continue;
      label.getWorldPosition(labelWorldPosition);
      const distance = camera.position.distanceTo(labelWorldPosition);
      const factor = THREE.MathUtils.clamp(distance / 70, 0.3, 2.2);
      label.scale
        .copy(label.userData.baseScale)
        .multiplyScalar(factor * aspectScale * label.userData.hoverScale);
    }
  }

  function setOrbitsVisible(visible) {
    for (const body of bodies) {
      if (body.orbitLine) body.orbitLine.visible = visible;
    }
  }

  function setLabelsVisible(visible) {
    for (const body of bodies) {
      if (body.label) body.label.visible = visible;
    }
  }

  return { bodies, update, updateLabels, setOrbitsVisible, setLabelsVisible };
}
