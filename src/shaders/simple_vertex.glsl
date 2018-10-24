attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec4 uColorMult;
uniform vec3 uLightDirection;

varying highp vec4 vColor;
varying highp vec3 vLighting;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor * uColorMult;

    highp vec3 ambientLight = vec3(0.5, 0.5, 0.5);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(uLightDirection);

    highp vec4 transformedNormal = normalize(uNormalMatrix * vec4(aVertexNormal, 1.0));

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
}