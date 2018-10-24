#version 300 es

precision highp float;

out vec4 fragColor;

vec4 encodeFloat (float depth) {
  const vec4 bitshift = vec4(
    256 * 256 * 256,
    256 * 256,
    256,
    1.0
  );
  const vec4 bitMask = vec4(
    0,
    1.0 / 256.0,
    1.0 / 256.0,
    1.0 / 256.0
  );
  vec4 comp = fract(depth * bitshift);
  return comp - (comp.xxyz * bitMask);
}

void main (void) {
  fragColor = encodeFloat(gl_FragCoord.z);
}
