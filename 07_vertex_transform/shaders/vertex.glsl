varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWSPosition;

uniform float uTime;

float InverseLerp(float v, float min_value, float max_value);
float Remap(float v, float in_min, float in_max, float out_min, float out_max);
mat3 RotateY(float radian);

void main() {
  vec3 local_space_position = position;
  local_space_position.y += sin(uTime);                               // Translate
  local_space_position.xz *= Remap(sin(uTime), -1.0, 1.0, 0.5, 1.5);  // Scale
  local_space_position = RotateY(uTime) * local_space_position;       // Rotate

  gl_Position = projectionMatrix * modelViewMatrix * vec4(local_space_position, 1.0);

  // World space -- correct for rigid transforms, not for non-uniform scale.
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vWSPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;
}

float InverseLerp(float v, float min_value, float max_value) {
  return (v - min_value) / (max_value - min_value);
}

float Remap(float v, float in_min, float in_max, float out_min, float out_max) {
  float t = InverseLerp(v, in_min, in_max);
  return mix(out_min, out_max, t);
}

mat3 RotateY(float radian) {
  float s = sin(radian);
  float c = cos(radian);

  return mat3(
    c,   0.0, s,
    0.0, 1.0, 0.0,
    -s,   0.0, c
  );
}