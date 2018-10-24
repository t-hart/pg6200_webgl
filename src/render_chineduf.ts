import { mat4 } from 'gl-matrix-ts'
import { rotation, translation } from './camera'
import Camera from './camera'
import { Architecture } from './models'
import Vec, * as Vector from './vector'
import ModelOptions from './modelOptions'
import { render } from './drawArgs'
import { lightShader } from './shaders'

type Matrix = number[] | Float32Array

const makeDepthTexture = (gl: WebGLRenderingContext, width = 1024, height = 1024) => {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  //cdf
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT_24_8, null)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

  // webGL fundamentals
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const renderBuffer = gl.createRenderbuffer()
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer)
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)

  // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.TEXTURE_2D, texture, 0)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer)

  gl.bindTexture(gl.TEXTURE_2D, null)
  gl.bindRenderbuffer(gl.RENDERBUFFER, null)

  return texture
}

export default (gl: WebGLRenderingContext, architecture: Architecture, projectionMatrix: Matrix, models: ModelOptions[], cam: Camera, lightDirection: Vec, timeOffset: number) => {
  const lightShaderProgram = lightShader(gl)
  gl.useProgram(lightShaderProgram)

  const shadowDepthTextureSize = 1024
  const shadowFramebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFramebuffer)
  gl.viewport(0, 0, shadowDepthTextureSize, shadowDepthTextureSize)
  const shadowDepthTexture = makeDepthTexture(gl, shadowDepthTextureSize)

  // const lightProjectionMatrix = mat4.ortho(mat4.create(), -40, 40, -40, 40, -40.0, 800)
  const lightProjectionMatrix = mat4.ortho(mat4.create(), -2, 2, -2, 2, .1, 100)
  // const lightViewMatrix = mat4.lookAt(mat4.create(), Vector.negate(lightDirection), [0, 0, 0], [0, 1, 0])
  const lightViewMatrix = mat4.lookAt(mat4.create(), [0, -2, -3], [0, 0, 0], [0, 1, 0])
  // const lightViewMatrix = mat4.fromRotationTranslation(mat4.create(), rotation(cam), translation(cam))
  // mat4.invert(lightViewMatrix, lightViewMatrix)

  const shadowProjectionMatrix = gl.getUniformLocation(lightShaderProgram, 'uProjectionMatrix')
  const shadowModelViewMatrix = gl.getUniformLocation(lightShaderProgram, 'uModelViewMatrix')

  gl.uniformMatrix4fv(shadowProjectionMatrix, false, lightProjectionMatrix)
  gl.uniformMatrix4fv(shadowModelViewMatrix, false, lightViewMatrix)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  gl.useProgram(cam.shaderProgram)

  const samplerUniform = gl.getUniformLocation(cam.shaderProgram, 'depthColorTexture')

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture)
  gl.uniform1i(samplerUniform, 0)

  // const uMVMatrix = gl.getUniformLocation(cam.shaderProgram, 'uModelViewMatrix')
  // const uProjectionMatrix = gl.getUniformLocation(cam.shaderProgram, 'uProjectionMatrix')
  const uLightMatrix = gl.getUniformLocation(cam.shaderProgram, 'uLightModelViewMatrix')
  const uLightProjectionMatrix = gl.getUniformLocation(cam.shaderProgram, 'uLightProjectionMatrix')
  const uColor = gl.getUniformLocation(cam.shaderProgram, 'uColor')

  gl.uniformMatrix4fv(uLightMatrix, false, lightViewMatrix)
  gl.uniformMatrix4fv(uLightProjectionMatrix, false, lightProjectionMatrix)
  // gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix)
  // gl.uniformMatrix4fv(uProjectionMatrix, false, mat4.perspective(mat4.create(), Math.PI / 3, 1, 0.01, 900))

  const drawShadowMap = (models: ModelOptions[]) => {
    // gl.bindBuffer(gl.ARRAY_BUFFER, dragonPositionBuffer)
    // already bound, right?
    gl.useProgram(lightShaderProgram)

    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFramebuffer)
    gl.viewport(0, 0, shadowDepthTextureSize, shadowDepthTextureSize)
    gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture)

    gl.clearColor(0, 0, 0, 1)
    gl.clearDepth(1.0)
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // gl.clear(gl.COLOR_BUFFER_BIT)

    const offset = translation(cam)
    models.forEach(model => {
      const { normalizingScale, centeringTranslation } = model.drawArgs

      const modelViewMatrix = mat4.fromTranslation(mat4.create(), offset)
      mat4.translate(modelViewMatrix, modelViewMatrix, model.position)
      mat4.rotate(modelViewMatrix, modelViewMatrix, timeOffset, model.orientation)

      // normalize, then scale
      mat4.scale(modelViewMatrix, modelViewMatrix, Array(3).fill(normalizingScale * model.scale))

      // center
      mat4.translate(modelViewMatrix, modelViewMatrix, centeringTranslation)

      // const normalMatrix = mat4.create()
      // mat4.invert(normalMatrix, modelViewMatrix)
      // mat4.transpose(normalMatrix, normalMatrix)

      mat4.mul(modelViewMatrix, lightViewMatrix, modelViewMatrix)

      gl.uniformMatrix4fv(shadowModelViewMatrix, false, modelViewMatrix)
      // mat4.mul(modelViewMatrix, mat4.fromQuat(mat4.create(), rotation(cam)), modelViewMatrix)

      const uniforms = {
        projectionMatrix,
        modelViewMatrix,
        // normalMatrix,
        // colorMult: model.color || [1, 1, 1, 1],
        // lightDirection
      }

      render(gl, uniforms, lightShaderProgram, model.drawArgs)
    })
  }

  const drawModels = (models: ModelOptions[]) => {
    const offset = translation(cam)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    // gl.bindTexture()
    gl.useProgram(cam.shaderProgram)
    gl.clearColor(.98, .98, .98, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture)
    gl.uniform1i(samplerUniform, 0)

    models.forEach(model => {
      const { normalizingScale, centeringTranslation } = model.drawArgs

      const modelViewMatrix = mat4.fromTranslation(mat4.create(), offset)
      mat4.translate(modelViewMatrix, modelViewMatrix, model.position)
      mat4.rotate(modelViewMatrix, modelViewMatrix, timeOffset, model.orientation)

      // this is the mul with from quat further down
      // gl.uniformMatrix4fv(uMVMatrix, false, mat4.mul(modelViewMatrix, camViewMatrix, modelViewMatrix))

      // normalize, then scale
      mat4.scale(modelViewMatrix, modelViewMatrix, Array(3).fill(normalizingScale * model.scale))

      // center
      mat4.translate(modelViewMatrix, modelViewMatrix, centeringTranslation)

      const normalMatrix = mat4.create()
      mat4.invert(normalMatrix, modelViewMatrix)
      mat4.transpose(normalMatrix, normalMatrix)

      // mat4.mul(modelViewMatrix, lightViewMatrix, modelViewMatrix)

      mat4.mul(modelViewMatrix, mat4.fromQuat(mat4.create(), rotation(cam)), modelViewMatrix)

      const lightModelViewMatrix = mat4.create()
      mat4.mul(lightModelViewMatrix, lightViewMatrix, modelViewMatrix)
      gl.uniformMatrix4fv(uLightMatrix, false, lightModelViewMatrix)
      // gl.uniformMatrix4fv(uMVMatrix, false, modelViewMatrix)

      gl.uniform4fv(uColor, model.color || [.6, .6, .6, 1])

      const uniforms = {
        // projectionMatrix: lightProjectionMatrix,
        projectionMatrix,
        modelViewMatrix,
        normalMatrix,
        texture: shadowDepthTexture,
        // colorMult: model.color || [0.36, .66, .8, 1],
        // lightDirection
      }

      render(gl, uniforms, cam.shaderProgram, model.drawArgs)
    })
  }

  const { room, platform, lightSource } = architecture
  const roomModel: ModelOptions = { drawArgs: room, scale: 20, orientation: Vector.zero(), position: Vector.zero(), color: [.20, .65, 0.2, 1] };
  const platformModel: ModelOptions = { drawArgs: platform, scale: 5, orientation: Vector.zero(), position: [0, -1, 0] };
  const light: ModelOptions = { drawArgs: lightSource, scale: .5, orientation: Vector.zero(), position: lightDirection, color: [1, .75, 0, 1] };

  drawShadowMap([...models, platformModel])

  drawModels([platformModel, light, roomModel, ...models])
  // [roomModel, platformModel, ...models].forEach(x => drawObj(x, projectionMatrix, cam, lightDirection, timeOffset))
  // drawLight(light, projectionMatrix, cam, lightDirection);
}
