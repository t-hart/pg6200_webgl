attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uModelMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}