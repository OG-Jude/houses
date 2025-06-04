import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

const exrLoader = new EXRLoader();
exrLoader.load('poolbeg_4k.exr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture; // Optional
});



const scene = new THREE.Scene();

const rgbeLoader = new RGBELoader();
rgbeLoader.load('poolbeg_2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture; // Optional: shows the HDR as background
});



const camera = new THREE.PerspectiveCamera(
  50, // Narrower FOV to avoid stretching
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Load the GLB model
const loader = new GLTFLoader();
loader.load('myHome.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1); // Adjust if your model looks too tall
  model.position.set(0, 0, 0);
  scene.add(model);
}, undefined, (err) => {
  console.error('Failed to load model:', err);
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Resize Fix
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
