varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    // highp vec4 texelColor = vec4(1.0, 1.0, 1.0, 1.0);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}