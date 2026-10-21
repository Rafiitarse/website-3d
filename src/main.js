import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';
import { createSolarSystem } from './solarSystem.js';
import { setupInteraction } from './interaction.js';
import { setupUI } from './ui.js';

const canvas = document.querySelector('#scene');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  1200,
);

const HOME_POSITION = new THREE.Vector3(0, 29, 74);
camera.position.copy(HOME_POSITION);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.55;
controls.zoomSpeed = 0.8;
controls.enablePan = false;
controls.minDistance = 4.5;
controls.maxDistance = 175;
controls.target.set(0, 0, 0);

const state = {
  speed: 1,
  paused: false,
};

const solar = createSolarSystem(scene);

const interaction = setupInteraction({
  renderer,
  camera,
  controls,
  bodies: solar.bodies,
  home: HOME_POSITION,
});

setupUI({ state, solar, interaction });

function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
}

window.addEventListener('resize', handleResize);

const timer = new THREE.Timer();
timer.connect(document);

function animate() {
  timer.update();
  const delta = Math.min(timer.getDelta(), 0.05);
  const simulationDelta = state.paused ? 0 : delta * state.speed;

  solar.update(simulationDelta);
  interaction.update(delta);
  solar.updateLabels(camera);
  controls.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
