#version 300 es
in vec4 aVertexPosition;

in vec3 aVertexNormal;
in vec4 aVertexColor;

uniform mat4 uNormalMatrix;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uLightModelViewMatrix;
uniform mat4 uLightProjectionMatrix;

uniform vec4 uColorMult;
uniform vec3 uLightDirection;

out highp vec3 vLighting;
out highp vec4 vAmbientColor;
out highp vec4 vColor;

const mat4 shadowBiasMatrix = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

out vec4 vShadowPosition;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

  vShadowPosition = shadowBiasMatrix * uLightProjectionMatrix * uLightModelViewMatrix * aVertexPosition;

  vColor = aVertexColor * uColorMult;

  highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
  vAmbientColor = vec4(ambientLight.rgb * vColor.rgb, vColor.a);

  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(uLightDirection);

  highp vec4 transformedNormal = normalize(uNormalMatrix * vec4(aVertexNormal, 1.0));

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = directionalLightColor * directional;
  // vLighting = ambientLight + (directionalLightColor * directional);
}
