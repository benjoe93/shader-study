varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

void main() {
  vec3 normal = normalize(vNormal);

  vec3 color = vec3(0.0);

  gl_FragColor = vec4(color, 1.0);
}
