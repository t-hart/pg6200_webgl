import { mat4 } from 'gl-matrix-ts'
import { LightShader } from './shaders'
import { rotation, translation } from './camera'
import Camera from './camera'
import { Architecture } from './models'
import Vec, * as Vector from './vector'
import ModelOptions from './modelOptions'
import { DrawArgs, render } from './drawArgs'
import * as glUtils from './glUtils'


export default (gl: WebGLRenderingContext, architecture: Architecture, lightShader: LightShader, projectionMatrix: glUtils.Matrix, models: ModelOptions[], cam: Camera, lightDirection: Vec, timeOffset: number) => {

  const lightProjectionMatrix = lightShader.projectionMatrix
  const lightViewMatrix = mat4.lookAt(mat4.create(), Vector.scale(3)(lightDirection), [0, 0, 0], [0, 1, 0])
  // const lightViewMatrix = mat4.lookAt(mat4.create(), [1, 1, 5], [0, 0, 0], [0, 1, 0])
  // const lightViewMatrix = mat4.lookAt(mat4.create(), [2, 8, -12], [0, 0, 0], [0, 1, 0])
  // const lightViewMatrix = mat4.fromRotationTranslation(mat4.create(), rotation(cam), translation(cam))
  // mat4.invert(lightViewMatrix, lightViewMatrix)
  const offset = translation(cam)

  interface ModelRenderData {
    modelMatrix: glUtils.Matrix,
    normalMatrix: glUtils.Matrix,
    color: Vector.t,
    drawArgs: DrawArgs
    modelMatrixForCam: glUtils.Matrix
  }

  const prepareModels = (...models: ModelOptions[]): ModelRenderData[] => models.map(model => {
    const { normalizingScale, centeringTranslation } = model.drawArgs

    const modelMatrixForCam = mat4.fromTranslation(mat4.create(), offset)
    mat4.translate(modelMatrixForCam, modelMatrixForCam, model.position)
    mat4.rotate(modelMatrixForCam, modelMatrixForCam, timeOffset, model.orientation)

    // normalize, then scale
    mat4.scale(modelMatrixForCam, modelMatrixForCam, Array(3).fill(normalizingScale * model.scale))


    // center
    mat4.translate(modelMatrixForCam, modelMatrixForCam, centeringTranslation)
    // const modelMatrix = mat4.create()
    const modelMatrix = mat4.fromQuat(mat4.create(), rotation(cam))
    mat4.translate(modelMatrix, modelMatrix, model.position)
    mat4.rotate(modelMatrix, modelMatrix, timeOffset, model.orientation)

    // normalize, then scale
    mat4.scale(modelMatrix, modelMatrix, Array(3).fill(normalizingScale * model.scale))


    // center
    mat4.translate(modelMatrix, modelMatrix, centeringTranslation)


    const normalMatrix = mat4.create()
    mat4.invert(normalMatrix, modelMatrix)
    mat4.transpose(normalMatrix, normalMatrix)

    // mat4.mul(modelViewMatrix, lightViewMatrix, modelViewMatrix)

    return {
      modelMatrix,
      normalMatrix,
      color: model.color || [0.36, .66, .8, 1],
      drawArgs: model.drawArgs,
      // modelMatrixForCam: mat4.mul(mat4.create(), modelMatrixForCam, modelMatrix)
      modelMatrixForCam
    }
  })

  const drawShadowMap = (...models: ModelRenderData[]) => {
    lightShader.prepareRender()
    // glUtils.bindFramebuffer(gl, null, gl.drawingBufferWidth, gl.drawingBufferHeight)

    models.forEach(model => {
      const { modelMatrix } = model

      const uniforms = {
        modelViewMatrix: mat4.mul(mat4.create(), lightViewMatrix, modelMatrix),
        lightProjectionMatrix,
        // texture: lightShader.shadowDepthTexture
      }

      render(gl, uniforms, lightShader.program, model.drawArgs)
    })

    glUtils.bindFramebuffer(gl, null, gl.drawingBufferWidth, gl.drawingBufferHeight)
  }

  const drawModels = (...models: ModelRenderData[]) => {
    const { shadowDepthTexture } = lightShader

    models.forEach(model => {
      const { modelMatrixForCam, normalMatrix } = model

      const modelViewMatrix = mat4.mul(mat4.create(), mat4.fromQuat(mat4.create(), rotation(cam)), modelMatrixForCam)
      // mat4.translate(modelViewMatrix, modelViewMatrix, offset)

      const lightModelViewMatrix = mat4.create()
      mat4.mul(lightModelViewMatrix, lightViewMatrix, modelViewMatrix)

      const uniforms = {
        // projectionMatrix: lightProjectionMatrix,
        projectionMatrix,
        lightProjectionMatrix,
        modelViewMatrix,
        normalMatrix,
        lightModelViewMatrix,
        texture: shadowDepthTexture,
        colorMult: model.color,
        // lightDirection
      }

      render(gl, uniforms, model.drawArgs.programInfo.program, model.drawArgs)
    })
  }

  const { room, platform, lightSource } = architecture
  const roomModel: ModelOptions = { drawArgs: room, scale: 20, orientation: Vector.zero(), position: Vector.zero(), color: [.3, .3, 0.3, 1] };
  const platformModel: ModelOptions = { drawArgs: platform, scale: 5, orientation: Vector.zero(), position: [0, -1, 0] };
  const light: ModelOptions = { drawArgs: lightSource, scale: .5, orientation: Vector.zero(), position: lightDirection, color: [1, .75, 0, 1] };

  // const shadowModels = prepareModels(...models, platformModel, light)
  const shadowModels = prepareModels(...models, platformModel)
  // const shadowModels = prepareModels(...models, light)
  drawShadowMap(...shadowModels)

  // drawModels([platformModel, light, roomModel, ...models])
  drawModels(...shadowModels, ...prepareModels(roomModel, light))
  // [roomModel, platformModel, ...models].forEach(x => drawObj(x, projectionMatrix, cam, lightDirection, timeOffset))
  // drawLight(light, projectionMatrix, cam, lightDirection);
}
