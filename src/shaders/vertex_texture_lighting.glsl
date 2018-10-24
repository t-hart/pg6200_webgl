#version 300 es
in vec4 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uLightModelViewMatrix;
uniform mat4 uLightProjectionMatrix;

uniform vec3 uLightDirection;

out highp vec2 vTextureCoord;
out highp vec3 vLighting;

const mat4 texUnitConverter = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

out vec4 shadowPos;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    shadowPos = texUnitConverter * uLightProjectionMatrix * uLightModelViewMatrix * aVertexPosition;

    // Apply lighting effect
    highp vec3 ambientLight = vec3(0.5, 0.5, 0.5);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(uLightDirection);

    highp vec4 transformedNormal = normalize(uNormalMatrix * vec4(aVertexNormal, 1.0));

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
}