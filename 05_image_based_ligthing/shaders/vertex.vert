varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWSPosition;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  // World space -- correct for rigid transforms, not for non-uniform scale.
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

  vWSPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}
