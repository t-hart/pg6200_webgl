#version 300 es
in vec3 aVertexPosition;

uniform mat4 uLightProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main(void) {
  gl_Position = uLightProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}