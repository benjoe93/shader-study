varying vec2 vUv;

void main() {
  vUv = uv;
  // Already in clip space -- no projection needed.
  gl_Position = vec4(position, 1.0);
}
