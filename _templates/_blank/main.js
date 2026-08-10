import * as THREE from 'three';

const load = (path) => fetch(new URL(path, import.meta.url)).then((r) => r.text());

const [vertexShader, fragmentShader] = await Promise.all([
  load('./shaders/vertex.glsl'),
  load('./shaders/fragment.glsl'),
]);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// UNIFORM DECLARATION
const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2() },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },
};

const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
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
  renderer.render(scene, camera);
});
