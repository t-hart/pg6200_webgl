#version 300 es

precision highp float;

out float fragDepth;

void main (void) {
  fragDepth = gl_FragCoord.r;
}
