import { mat4 } from 'gl-matrix-ts'
import { rotation, translation } from './camera'
import Camera from './camera'
import { Architecture } from './models'
import Vec, * as Vector from './vector'
import ModelOptions from './modelOptions'

import cdfRender from './render_chineduf'

type Matrix = number[] | Float32Array

const prepareCanvas = (gl: WebGLRenderingContext) => {
  gl.clearColor(0, 0, 0, 1)
  gl.clearDepth(1)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

export const drawEmptyScene = prepareCanvas

const drawLight = (model: ModelOptions, projectionMatrix: Matrix, cam: Camera, lightDirection: Vec) => {
  const { texture, normalizingScale, centeringTranslation, render } = model.drawArgs

  const offset = translation(cam)

  const modelViewMatrix = mat4.fromTranslation(mat4.create(), offset)
  mat4.translate(modelViewMatrix, modelViewMatrix, model.position)
  // mat4.lookAt(modelViewMatrix, modelViewMatrix, [0, 0, 0], model.orientation)

  // normalize, then scale
  mat4.scale(modelViewMatrix, modelViewMatrix, Array(3).fill(normalizingScale * model.scale))

  // center
  mat4.translate(modelViewMatrix, modelViewMatrix, centeringTranslation)

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  mat4.mul(modelViewMatrix, mat4.fromQuat(mat4.create(), rotation(cam)), modelViewMatrix)

  const uniforms = {
    projectionMatrix,
    modelViewMatrix,
    normalMatrix,
    texture,
    colorMult: model.color || [1, 1, 1, 1],
    lightDirection
  }

  render(uniforms, model.drawArgs.programInfo.program)
}

const drawObj = (model: ModelOptions, projectionMatrix: Matrix, cam: Camera, lightDirection: Vec, timeOffset: number) => {
  const { texture, normalizingScale, centeringTranslation, render } = model.drawArgs

  const offset = translation(cam)

  const modelViewMatrix = mat4.fromTranslation(mat4.create(), offset)
  mat4.translate(modelViewMatrix, modelViewMatrix, model.position)
  mat4.rotate(modelViewMatrix, modelViewMatrix, timeOffset, model.orientation)

  // normalize, then scale
  mat4.scale(modelViewMatrix, modelViewMatrix, Array(3).fill(normalizingScale * model.scale))

  // center
  mat4.translate(modelViewMatrix, modelViewMatrix, centeringTranslation)

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  mat4.mul(modelViewMatrix, mat4.fromQuat(mat4.create(), rotation(cam)), modelViewMatrix)

  const uniforms = {
    projectionMatrix,
    modelViewMatrix,
    normalMatrix,
    texture,
    colorMult: model.color || [1, 1, 1, 1],
    lightDirection
  }

  render(uniforms, model.drawArgs.programInfo.program)
}

export const drawScene = (gl: WebGLRenderingContext, architecture: Architecture, models: ModelOptions[], cam: Camera, aspect: number, lightDirection: Vec, timeOffset: number) => {
  prepareCanvas(gl)

  // get light direction. render everything orthographically to an fbo. This is the depth texture.
  // when rendering normally, use this depth texture to find out what's in shadow and what is not

  // the room should be exempt from the shading and depth testing.
  // i.e.: render models and depth test. Render models with shadows. Render room.

  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 512, 512, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null)


  const fieldOfView = 45 * Math.PI / 180
  const zNear = 0.1
  const zFar = 100
  const projectionMatrix = mat4.perspective(mat4.create(), fieldOfView, aspect, zNear, zFar)
  // const projectionMatrix = mat4.ortho(mat4.create(), -2, 2, -2, 2, .1, 100)

  const { room, platform, lightSource } = architecture
  const roomModel: ModelOptions = { drawArgs: room, scale: 20, orientation: Vector.zero(), position: Vector.zero() };
  const platformModel: ModelOptions = { drawArgs: platform, scale: 8, orientation: Vector.zero(), position: [0, -1, 0] };
  const light: ModelOptions = { drawArgs: lightSource, scale: .5, orientation: Vector.zero(), position: lightDirection, color: [1, .75, 0, 1] };

  // [roomModel, platformModel, ...models].forEach(x => drawObj(x, projectionMatrix, cam, lightDirection, timeOffset))
  // drawLight(light, projectionMatrix, cam, lightDirection);

  cdfRender(gl, architecture, projectionMatrix, models, cam, lightDirection, timeOffset)
}
