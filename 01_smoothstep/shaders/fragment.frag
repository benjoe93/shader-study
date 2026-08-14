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

  // GRADIENTS
  if (vUv.y > 0.8) {
    // linear
    color = mix(red, blue, vUv.x);
  }
  else if (vUv.y > 0.6) {
    // smoothstep
    color = mix(red, blue, smoothstep(0.0, 1.0, vUv.x));
  }
  else if (vUv.y > 0.4) {
    // min
    color = mix(red, blue, min(0.2, vUv.x));
  }
  else if (vUv.y > 0.2) {
    // max
    color = mix(red, blue, max(0.2, vUv.x));
  }
  else {
    // clamp
    color = mix(red, blue, clamp(vUv.x, 0.2, 0.8));
  }

  float line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - 0.8));
  color = mix(black, color, line);
  line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - 0.6));
  color = mix(black, color, line);
  line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - 0.4));
  color = mix(black, color, line);
  line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - 0.2));
  color = mix(black, color, line);

  // linear line
  float value1 = vUv.x;
  float linear_line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - mix(0.8, 1.0, value1)));
  color = mix(white, color, linear_line);

  // smoothstep line
  float value2 = smoothstep(0.0, 1.0, vUv.x);
  float smooth_line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - mix(0.6, 0.8, value2)));
  color = mix(white, color, smooth_line);

  // min line
  float value3 = min(0.2, vUv.x);
  float min_line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - mix(0.4, 0.6, value3)));
  color = mix(white, color, min_line);

  // max
  float value4 = max(0.2, vUv.x);
  float max_line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - mix(0.2, 0.4, value4)));
  color = mix(white, color, max_line);

  //clamp
  float value5 = clamp(vUv.x, 0.2, 0.8);
  float clamp_line = smoothstep(0.0, LINE_THICKNESS, abs(vUv.y - mix(0.0, 0.2, value5)));
  color = mix(white, color, clamp_line);

  gl_FragColor = vec4(color, 1.0);
}
