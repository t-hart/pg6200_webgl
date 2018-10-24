#version 300 es
precision highp float;

in vec4 shadowPos;
in highp vec2 vTextureCoord;
in highp vec3 vLighting;

uniform sampler2D uSampler;
uniform sampler2D uDepthTexture;

float decodeFloat(vec4 color) {
  const vec4 bitshift = vec4(
                             1.0 / (256.0 * 256.0 * 256.0),
                             1.0 / (256.0 * 256.0),
                             1.0 / 256.0,
                             1
                             );
  return dot(color, bitshift);
}

out vec4 fragColor;

void main(void) {
    highp vec4 texelColor = texture(uSampler, vTextureCoord);

    vec3 fragmentDepth = shadowPos.xyz;
    float shadowAcneRemover = 0.007;
    fragmentDepth.z -= shadowAcneRemover;

    float texelSize = 1.0 / 1024.0;
    float amountInLight = 0.0;

    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        float texelDepth = decodeFloat(texture(uDepthTexture, fragmentDepth.xy + vec2(x, y) * texelSize));
        if (fragmentDepth.z < texelDepth) {
          amountInLight += 1.0;
        }
      }
    }

    amountInLight /= 9.0;
    fragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}