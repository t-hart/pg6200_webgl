#version 300 es
precision highp float;

in vec4 shadowPos;

uniform sampler2D depthColorTexture;
uniform vec4 uColor;

out vec4 fragColor;

float decodeFloat(vec4 color) {
  const vec4 bitshift = vec4(
    1.0 / (256.0 * 256.0 * 256.0),
    1.0 / (256.0 * 256.0),
    1.0 / 256.0,
    1
  );
  return dot(color, bitshift);
}

void main(void) {
  vec3 fragmentDepth = shadowPos.xyz;
  float shadowAcneRemover = 0.007;
  fragmentDepth.z -= shadowAcneRemover;

  float texelSize = 1.0 / 1024.0;
  float amountInLight = 0.0;

  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      float texelDepth = decodeFloat(texture(depthColorTexture, fragmentDepth.xy + vec2(x, y) * texelSize));
      if (fragmentDepth.z < texelDepth) {
        amountInLight += 1.0;
      }
    }
  }

  amountInLight /= 9.0;
  fragColor = amountInLight * uColor;
}
