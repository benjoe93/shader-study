varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

float LINE_THICKNESS = 0.002;

void main() {
  vec3 white = vec3(1.0);
  vec3 black = vec3(0.0);
  vec3 red = vec3(1.0, 0.0, 0.0);
  vec3 blue = vec3(0.0, 0.0, 1.0);

  vec3 color = vec3(0.0);

  if (vUv.y > 0.5) {
    color = mix(red, blue, vUv.x);
  }
  else {
    color = mix(red, blue, smoothstep(0.0, 1.0, vUv.x));
  }

  float line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - 0.5));
  color = mix(black, color, line);

  // linear line - top
  float value1 = vUv.x;
  float linear_line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - mix(0.5, 1.0, value1)));
  color = mix(white, color, linear_line);

  // smoothstep line - bottom
  float value2 = smoothstep(0.0, 1.0, vUv.x);
  float smooth_line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - mix(0.0, 0.5, value2)));
  color = mix(white, color, smooth_line);

  gl_FragColor = vec4(color, 1.0);
}
