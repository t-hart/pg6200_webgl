#version 300 es
in vec3 aVertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}