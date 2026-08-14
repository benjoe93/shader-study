varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

vec3 black  = vec3(0.0);
vec3 white  = vec3(1.0);
vec3 red    = vec3(1.0, 0.0, 0.0);
vec3 blue   = vec3(0.0, 0.0, 1.0);
vec3 yellow = vec3(1.0, 1.0, 0.0);

float cell_size = 100.0;

float DrawGridLines(float cell_size) {
  // center uvs to the screen
  vec2 center = vUv - 0.5;
  // resolution independent division
  vec2 cell = fract(center * uResolution / cell_size);
  // center cells
  cell = abs(cell - 0.5);

  // SDF
  float dist_to_cell = max(cell.x, cell.y);
  dist_to_cell = dist_to_cell * 2.0; // normalize
  dist_to_cell = 1.0 - dist_to_cell; // invert

  // create lines
  float cell_line = smoothstep(0.0, 0.02, dist_to_cell);
  return cell_line;
}


void main() {
  vec3 color = vec3(0.75);

  // Draw grid
  color = mix(black, color, DrawGridLines(cell_size));

  // Axis
  float x_axis = smoothstep(0.0, 0.005, abs(vUv.y - 0.5));
  float y_axis = smoothstep(0.0, 0.005, abs(vUv.x - 0.5));

  color = mix(blue, color, x_axis);
  color = mix(blue, color, y_axis);

  // Lines
  vec2 center = vUv - 0.5;
  vec2 pos = center * uResolution / cell_size;
  float value1 = pos.x;

  // float value2 = floor(pos.x);
  // float value2 = ceil(pos.x);
  // float value2 = round(pos.x);
  // float value2 = fract(pos.x);
  float value2 = mod(pos.x, 1.45);

  float function_line1 = smoothstep(0.0, 0.05, abs(pos.y - value1));
  float function_line2 = smoothstep(0.0, 0.05, abs(pos.y - value2));

  color = mix(yellow, color, function_line1);
  color = mix(red, color, function_line2);

  gl_FragColor = vec4(color, 1.0);
}
