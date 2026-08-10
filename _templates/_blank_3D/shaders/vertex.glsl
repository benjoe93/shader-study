varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  // World space -- correct for rigid transforms, not for non-uniform scale.
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
