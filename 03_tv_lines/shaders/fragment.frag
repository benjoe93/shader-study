varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

uniform sampler2D diffuse;

vec3 red = vec3(1.0, 0.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);

float InverseLerp(float v, float min_value, float max_value);
float Remap(float v, float in_min, float in_max, float out_min, float out_max);


void main() {
  vec3 color = vec3(0.0);

  float t = Remap(sin(vUv.y * 500.0 + (uTime * 10.0)), -1.0, 1.0, 0.75, 1.0);
  color = vec3(t) * (texture2D(diffuse, vUv).xyz * 0.75);

  gl_FragColor = vec4(color, 1.0);
}

float InverseLerp(float v, float min_value, float max_value) {
  return (v - min_value) / (max_value - min_value);
}

float Remap(float v, float in_min, float in_max, float out_min, float out_max) {
  float t = InverseLerp(v, in_min, in_max);
  return mix(out_min, out_max, t);
}