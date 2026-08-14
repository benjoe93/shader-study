varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

float inverseLerp(float v, float minValue, float maxValue);
float remap(float v, float inMin, float inMax, float outMin, float outMax);
float saturate(float v);

float SdfCircle(vec2 point, float radius);
mat2 rotate2D(float angle);


void main() {
  vec3 color = vec3(0.0);
  // background loops through - morning, midday, evening, night
  // clouds scroll
  // sun comes up daytime
  // moon and stars come up night time
  gl_FragColor = vec4(color, 1.0);
}


float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

float saturate(float v) {
  return clamp(v, 0.0, 1.0);
}

float SdfCircle(vec2 point, float radius) {
  return length(point) - radius;
}

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(
    c, -s,
    s, c
  );
}