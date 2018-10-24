import { initShaderProgram } from './shaderUtils'
import * as glUtils from './glUtils'
import { ObjData } from './objs'
// @ts-ignore
import ColorFragment from './shaders/simple_fragment.glsl'
// @ts-ignore
import ColorVertex from './shaders/simple_vertex.glsl'
// @ts-ignore
import LightingFragment from './shaders/fragment_texture_lighting.glsl'
// @ts-ignore
import LightingVertex from './shaders/vertex_texture_lighting.glsl'
// @ts-ignore
import TextureFragment from './shaders/fragment_texture.glsl'
// @ts-ignore
import TextureVertex from './shaders/vertex_texture.glsl'
// @ts-ignore
import LightVertex from './shaders/light_vertex.glsl'
// @ts-ignore
import LightFragment from './shaders/light_fragment.glsl'
// @ts-ignore
import CamVertex from './shaders/cam_vertex.glsl'
// @ts-ignore
import CamFragment from './shaders/cam_fragment.glsl'

export interface ShaderSet {
  vertex: string,
  fragment: string
}

export interface Programs {
  color: WebGLProgram,
  texture?: WebGLProgram,
  lighting?: WebGLProgram
}

const shaders = {
  color: {
    vertex: ColorVertex,
    fragment: ColorFragment
  },
  light: {
    vertex: LightVertex,
    fragment: LightFragment
  },
  cam: {
    vertex: CamVertex,
    fragment: CamFragment
  }
}

const shadersExtended = {
  ...shaders,
  texture: {
    vertex: TextureVertex,
    fragment: TextureFragment
  },
  lighting: {
    vertex: LightingVertex,
    fragment: LightingFragment
  },
}

export const cameraShaderProgram = (gl: WebGLRenderingContext) => initShaderProgram(gl)(shaders.cam)

export const lightShader = (gl: WebGLRenderingContext) => initShaderProgram(gl)(shaders.light)

export const lightShaderProgram = (gl: WebGLRenderingContext) => {

  const makeDepthTexture = (width = 1024, height = 1024) => {
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

  gl.useProgram(lightShaderProgram)

  const shadowDepthTextureSize = 1024
  const shadowFramebuffer = gl.createFramebuffer()

  glUtils.bindFramebuffer(gl, shadowFramebuffer, shadowDepthTextureSize, shadowDepthTextureSize)

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
}

export const availableShaders = (model: ObjData) => model.vt.length ? shadersExtended : shaders

export default shaders
