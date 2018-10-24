#version 300 es
precision highp float;

in vec4 vShadowPosition;
in vec4 vColor;
in vec3 vLighting;
in vec4 vAmbientColor;

uniform sampler2D uDepthTexture;

out vec4 fragColor;

void main(void) {
  vec3 shadowCoord = vShadowPosition.xyz;
  float acneThreshold = 0.0015;
  shadowCoord.z -= acneThreshold;

  float visibility = 0.0;

  float texelSize = 1.0 / 1024.0;

  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      if (shadowCoord.z < texture(uDepthTexture, shadowCoord.xy + vec2(x, y) * texelSize).r) {
        visibility += 1.0;
      }
    }
  }

  visibility /= 9.0;
  fragColor = vAmbientColor + visibility * vec4(vColor.rgb * vLighting, vColor.a);
}
