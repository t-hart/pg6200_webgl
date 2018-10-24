#version 300 es
in vec3 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uLightModelViewMatrix;
uniform mat4 uLightProjectionMatrix;

const mat4 texUnitConverter = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

out vec4 shadowPos;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

  shadowPos = texUnitConverter * uLightProjectionMatrix * uLightModelViewMatrix * vec4(aVertexPosition, 1.0);
}
