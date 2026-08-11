import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const load = (path) => fetch(new URL(path, import.meta.url)).then((r) => r.text());

const [vertexShader, fragmentShader] = await Promise.all([
  load('./shaders/vertex.glsl'),
  load('./shaders/fragment.glsl'),
]);

const CubeMapLoader = new THREE.CubeTextureLoader();
// Order is [px, nx, py, ny, pz, nz] — right before left, or the X faces swap.
const CubeMapTextures = CubeMapLoader.load([
  '/_resources/textures/skybox/right.jpg',
  '/_resources/textures/skybox/left.jpg',
  '/_resources/textures/skybox/top.jpg',
  '/_resources/textures/skybox/bottom.jpg',
  '/_resources/textures/skybox/front.jpg',
  '/_resources/textures/skybox/back.jpg',
]);
CubeMapTextures.colorSpace = THREE.SRGBColorSpace;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
// Mid grey so the black material reads as a silhouette.
// scene.background = new THREE.Color(0x808080);
scene.background = CubeMapTextures;

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 0, 3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// UNIFORM DECLARATION
const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2() },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  uSpecularMap: { value: CubeMapTextures}
};

const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });

// const geometry = new THREE.IcosahedronGeometry(1, 128);
// scene.add(new THREE.Mesh(geometry, material));

const loader = new GLTFLoader();
// Server-root path, so it resolves both here and from a copied sketch one level up.
const gltf = await loader.loadAsync('/_resources/models/suzanne.glb');
gltf.scene.traverse((child) => {
  if (child.isMesh) child.material = material;
});
scene.add(gltf.scene);

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // Drawing buffer size, not CSS size, so uResolution matches gl_FragCoord.
  renderer.getDrawingBufferSize(uniforms.uResolution.value);
}

resize();
window.addEventListener('resize', resize);

// Normalized to 0..1 with a bottom-left origin, matching vUv.
window.addEventListener('pointermove', (e) => {
  uniforms.uMouse.value.set(
    e.clientX / window.innerWidth,
    1 - e.clientY / window.innerHeight,
  );
});

const timer = new THREE.Timer();
timer.connect(document); // Pause uTime while the tab is hidden.

renderer.setAnimationLoop((timestamp) => {
  timer.update(timestamp);
  uniforms.uTime.value = timer.getElapsed();
  controls.update();
  renderer.render(scene, camera);
});
