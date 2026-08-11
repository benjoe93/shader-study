varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWSPosition;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

float InverseLerp(float v, float min_value, float max_value);
float Remap(float v, float in_min, float in_max, float out_min, float out_max);

void main() {
  vec3 normal = normalize(vNormal);
  vec3 base_color = vec3(0.5);
  vec3 view_dir = normalize(cameraPosition - vWSPosition);

  // ambient light - Global Illuminations
  vec3 ambient_light = vec3(1.0);

  // hemisphere lighting
  vec3 sky_color = vec3(0.0, 0.3, 0.6);
  vec3 ground_color = vec3(0.6, 0.3, 0.1);
  vec3 hemi_color = mix(ground_color, sky_color, Remap(normal.y, -1.0, 1.0, 0.0, 1.0));

  // diffuse light
  vec3 light_dir = normalize(vec3(1.0, 1.0, 1.0));
  vec3 light_color = vec3(1.0, 1.0, 0.9);
  float dp = max(0.0, dot(light_dir, normal));

  // Toon
  // dp *= smoothstep(0.5, 0.505, dp);

  // 3 color toon
  dp *= smoothstep(0.4, 0.41, dp) + smoothstep(0.65, 0.66, dp);

  vec3 diffuse = dp * light_dir;

  // phong specular
  vec3 reflection_vec = normalize(reflect(-light_dir, normal));
  float phong_value = max(0.0, dot(view_dir, reflection_vec));
  phong_value = pow(phong_value, 32.0);
  vec3 specular = vec3(phong_value);
  specular = smoothstep(0.5, 0.505, specular);

  // Fresnel
  float fresnel = 1.0 - max(0.0, dot(view_dir, normal));
  fresnel = pow(fresnel, 2.0);
  fresnel *= step(0.7, fresnel);


  // lighting sum
  vec3 lighting = ambient_light * 0.0
                + hemi_color    * (fresnel + 0.2)
                + diffuse       * 0.8;

  vec3 color = base_color * lighting + specular;
  color = pow(color, vec3(1.0 / 2.2)); // liner -> sRGB

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(vec3(dp), 1.0);

}

float InverseLerp(float v, float min_value, float max_value) {
  return (v - min_value) / (max_value - min_value);
}

float Remap(float v, float in_min, float in_max, float out_min, float out_max) {
  float t = InverseLerp(v, in_min, in_max);
  return mix(out_min, out_max, t);
}