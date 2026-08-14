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
float SdfCircle(vec2 point, float radius);
float SdfLine(vec2 p, vec2 a, vec2 b);
float SdfBox(vec2 p, vec2 b);
float SdfHexagon(vec2 p, float r);
mat2 rotate2D(float angle);

void main() {
  vec3 color = vec3(0.0);
  vec2 pixel_coords = (vUv - 0.5) * uResolution;
  color = BackgroundColor();
  color = DrawGrid(color, vec3(0.5), 10.0, 1.0);
  color = DrawGrid(color, vec3(0.0), 100.0, 2.0);

  // SDF transformation
  vec2 pos = pixel_coords;
  // pos -= vec2(200.0, 300.0);
  // pos *= rotate2D(uTime * 2.0);

  // SHAPES
  float d = SdfHexagon(pos, 300.0);
  // for smoothing, we can swap `step()` -> `smoothstep()`
  color = mix(RED * 0.5, color, smoothstep(-1.0, 1.0, d));
  color = mix(RED, color, smoothstep(-10.0, -0.0, d));

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

float SdfCircle(vec2 point, float radius) {
  return length(point) - radius;
}

float SdfLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float SdfBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float SdfHexagon(vec2 p, float r) {
  const vec3 k = vec3(-0.866025404,0.5,0.577350269);
  p = abs(p);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p)*sign(p.y);
}

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(
    c, -s,
    s, c
  );
}