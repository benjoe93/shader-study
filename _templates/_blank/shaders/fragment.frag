varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

float inverseLerp(float v, float minValue, float maxValue);
float remap(float v, float inMin, float inMax, float outMin, float outMax);


void main() {
  vec3 color = vec3(1.0);

  gl_FragColor = vec4(color, 1.0);
}


float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

