varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

vec3 YELLOW = vec3(1.0,  1.0,  0.5);
vec3 BLUE   = vec3(0.25, 0.25, 1.0);
vec3 RED    = vec3(1.0,  0.25, 0.25);
vec3 GREEN  = vec3(0.25, 1.0,  0.25);
vec3 PURPLE = vec3(1.0,  0.25, 1.0);

float inverseLerp(float v, float minValue, float maxValue);
float remap(float v, float inMin, float inMax, float outMin, float outMax);
vec3 BackgroundColor();
vec3 DrawGrid(vec3 color, vec3 line_color, float cell_size, float line_thickness);


void main() {
  vec3 color = vec3(0.0);
  vec2 pixel_coords = (vUv - 0.5) * uResolution;
  color = BackgroundColor();
  color = DrawGrid(color, vec3(0.5), 10.0, 1.0);
  color = DrawGrid(color, vec3(0.0), 100.0, 2.0);

  gl_FragColor = vec4(color, 1.0);
}


float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec3 BackgroundColor(){
  float dist_from_center = length(abs(vUv - 0.5));
  float vignette = 1.0 - dist_from_center;
  vignette = smoothstep(0.0, 0.7, vignette);
  vignette = remap(vignette, 0.0, 1.0, 0.3, 1.0);

  return vec3(vignette);
}

vec3 DrawGrid(vec3 color, vec3 line_color, float cell_size, float line_thickness) {
  vec2 center = vUv - vec2(0.5);
  vec2 cell = abs(fract(center * uResolution / cell_size) - 0.5);
  float dist_from_cell = (0.5 - max(cell.x, cell.y)) * cell_size;
  float lines = smoothstep(0.0, line_thickness, dist_from_cell);


  return mix(line_color, color, lines);
}

