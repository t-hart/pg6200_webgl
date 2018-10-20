import { mat4 } from 'gl-matrix-ts'
import * as glUtils from './glUtils'
import { rotation, translation } from './camera'
import Camera from './camera'
import ModelOptions from './modelOptions'

const prepareCanvas = (gl: WebGLRenderingContext) => {
  gl.clearColor(0, 0, 0, 1)
  gl.clearDepth(1)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

export const drawEmptyScene = prepareCanvas


export const drawScene = (opts: ModelOptions, cam: Camera, timeOffset: number) => {
  const { gl, programInfo, buffers, texture, normalizingScale, centeringTranslation, numFaces, boundingBox } = opts.drawArgs
  prepareCanvas(gl)

  const fieldOfView = 45 * Math.PI / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100
  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)
  // mat4.ortho(projectionMatrix, -2, 2, -2, 2, .1, 100)

  const offset = translation(cam)
  const rot = rotation(cam)

  const modelMatrix = mat4.fromTranslation(mat4.create(), offset)
  mat4.rotate(modelMatrix, modelMatrix, timeOffset, opts.rotation)

  // normalize, then scale
  mat4.scale(modelMatrix, modelMatrix, Array(3).fill(normalizingScale * opts.scale))

  // center
  mat4.translate(modelMatrix, modelMatrix, centeringTranslation)

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  const setters = glUtils.attribSetters(gl, programInfo.program)

  const attribs = {
    aVertexNormal: { buffer: buffers.normal, numComponents: 3 },
    aVertexPosition: { buffer: buffers.position, numComponents: 3 },
    aVertexColor: { buffer: buffers.color, numComponents: 4 },
    aTextureCoord: { buffer: buffers.textureCoord, numComponents: 2 }
  }

  glUtils.setAttributes(setters, attribs)

  gl.useProgram(programInfo.program)

  const uniforms = {
    projectionMatrix,
    modelMatrix,
    normalMatrix,
    viewMatrix: mat4.fromQuat(mat4.create(), rot),
    texture,
    colorMult: [1, 0.5, 0.5, 1]
  }

  glUtils.setUniforms(programInfo.uniformFunctions, uniforms)

  {
    const vertexCount = numFaces
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}
