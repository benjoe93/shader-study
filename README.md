# shaders

Fragment shader sketches. No build step — three.js comes from a CDN importmap.

## New sketch

```powershell
.\new.ps1 001-uv-colors
```

Copies `_blank/`, then right-click `001-uv-colors\index.html` → **Open with Live Server**.
Serving over http is required; opening the file directly won't work, since the GLSL is
loaded with `fetch`.

## Writing shaders

Edit `shaders/fragment.glsl`. `main.js` rarely needs touching — it just renders a quad
covering the viewport and feeds it these uniforms:

| Uniform | Type | |
|---|---|---|
| `uTime` | `float` | Seconds since load |
| `uResolution` | `vec2` | Canvas size in device pixels, matching `gl_FragCoord` |
| `uMouse` | `vec2` | Pointer position, `0..1`, bottom-left origin |

`vUv` comes through as a `varying` — `0..1` across the quad, so `vUv` and `uMouse` share
an origin.

These are GLSL 1 shaders (three.js `ShaderMaterial` default): use `varying` and
`gl_FragColor`, not `in`/`out`.
