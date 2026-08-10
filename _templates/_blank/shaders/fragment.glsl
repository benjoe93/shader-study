varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  gl_FragColor = vec4(vUv, sin(uTime) * 0.5 + 0.5, 1.0);
}
