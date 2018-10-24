import { initShaderProgram } from './shaderUtils'
import { UniformFunctions, uniformFunctions } from './programInfo'
import { mat4 } from 'gl-matrix-ts'
import * as textureUtils from './textureUtils'
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


export interface LightShader {
  program: WebGLProgram,
  shadowDepthTexture: WebGLTexture,
  projectionMatrix: glUtils.Matrix,
  uniformSetters: UniformFunctions,
  shadowFrameBuffer: WebGLFramebuffer,
  prepareRender: Function
}

export const lightShader = (gl: WebGLRenderingContext) => {
  const program = initShaderProgram(gl)(shaders.light)
  if (program === null) { throw Error("Light program was null. This should never happen") }

  gl.useProgram(program)

  const width = 512
  const height = 512
  const shadowFramebuffer = gl.createFramebuffer()

  glUtils.bindFramebuffer(gl, shadowFramebuffer, width, height)

  const shadowDepthTexture = textureUtils.depthTexture(gl, width, height)

  // const projectionMatrix = mat4.ortho(mat4.create(), -40, 40, -40, 40, -40.0, 800)
  const projectionMatrix = mat4.ortho(mat4.create(), -8, 8, -8, 8, .1, 100)
  // const projectionMatrix = mat4.ortho(mat4.create(), -2, 2, -2, 2, .1, 100)

  const shadowProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix')
  // const shadowModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix')

  gl.uniformMatrix4fv(shadowProjectionMatrix, false, projectionMatrix)
  // gl.uniformMatrix4fv(shadowModelViewMatrix, false, lightViewMatrix)

  glUtils.bindFramebuffer(gl, null, gl.drawingBufferWidth, gl.drawingBufferHeight)

  return {
    program,
    shadowDepthTexture,
    projectionMatrix,
    uniformFunctions: uniformFunctions(gl, program),
    shadowFramebuffer,
    prepareRender: () => {
      gl.useProgram(program)
      glUtils.bindFramebuffer(gl, shadowFramebuffer, width, height)
      // gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture)

      gl.clearColor(0, 0, 0, 1)
      gl.clearDepth(1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }
}

export const availableShaders = (model: ObjData) => model.vt.length ? shadersExtended : shaders

export default shaders
