import { mat4 } from 'gl-matrix-ts'
import { rotation, translation } from './camera'
import DrawArgs from './drawArgs'
import Camera from './camera'
import * as Vector from './vector'
import ModelOptions from './modelOptions'

const prepareCanvas = (gl: WebGLRenderingContext) => {
  gl.clearColor(0, 0, 0, 1)
  gl.clearDepth(1)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

export const drawEmptyScene = prepareCanvas

const drawObj = (model: ModelOptions, projectionMatrix: number[] | Float32Array, viewMatrix: number[] | Float32Array, cam: Camera, timeOffset: number) => {
  const { texture, normalizingScale, centeringTranslation, render } = model.drawArgs

  const offset = translation(cam)

  const modelMatrix = mat4.fromTranslation(mat4.create(), offset)
  mat4.rotate(modelMatrix, modelMatrix, timeOffset, model.rotation)

  // normalize, then scale
  mat4.scale(modelMatrix, modelMatrix, Array(3).fill(normalizingScale * model.scale))

  // center
  mat4.translate(modelMatrix, modelMatrix, centeringTranslation)

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  const uniforms = {
    projectionMatrix,
    modelMatrix,
    normalMatrix,
    viewMatrix,
    texture,
    // colorMult: [1, 0.5, 0.5, 1]
    // colorMult: [0.5, 0.5, 1, 1]
    colorMult: [0.5, 1, 0.5, 1]
  }

  render(uniforms)
}

export const drawScene = (gl: WebGLRenderingContext, room: DrawArgs, models: ModelOptions[], cam: Camera, aspect: number, timeOffset: number) => {
  prepareCanvas(gl)

  const viewMatrix = mat4.fromQuat(mat4.create(), rotation(cam))

  const fieldOfView = 45 * Math.PI / 180
  const zNear = 0.1
  const zFar = 100
  const projectionMatrix = mat4.perspective(mat4.create(), fieldOfView, aspect, zNear, zFar)
  // const projectionMatrix = mat4.ortho(mat4.create(), -2, 2, -2, 2, .1, 100)

  const roomModel: ModelOptions = { drawArgs: room, scale: 10, rotation: Vector.zero() };
  [roomModel, ...models].forEach(x => drawObj(x, projectionMatrix, viewMatrix, cam, timeOffset))
}
