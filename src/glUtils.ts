import { UniformFunctions } from './programInfo'
import Vector from './vector'
import { range, objectFromValues } from './utils'

export const getGlContext = (canvasId: string) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#' + canvasId)
  return canvas ? canvas.getContext('webgl2') : null
}

export const setViewport = (gl: WebGLRenderingContext, width: number, height: number) => gl.viewport(0, 0, width, height)

export const getAspect = (gl: WebGLRenderingContext) => gl.canvas.clientWidth / gl.canvas.clientHeight

interface AttribData {
  numComponents: number,
  normalize?: boolean,
  stride?: number,
  offset?: number,
  buffer: WebGLBuffer,
  type?: number,
  size: number
}

const attribSetters = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const createAttribSetter = (index: number) => (b: AttribData) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer)
    gl.enableVertexAttribArray(index)
    gl.vertexAttribPointer(
      index,
      b.numComponents || b.size,
      b.type || gl.FLOAT,
      b.normalize || false,
      b.stride || 0,
      b.offset || 0
    )
  }

  const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  const keyVals = range(numAttribs)
    .map(i => gl.getActiveAttrib(program, i))
    .filter(x => x)
    // @ts-ignore -- we've already filtered out null values
    .map(x => [x.name, createAttribSetter(gl.getAttribLocation(program, x.name))])
  return objectFromValues(...keyVals)
}

const setAttributes = (setters: object) => (attribs: object) => {
  Object.entries(attribs).forEach(([k, v]) => {
    // @ts-ignore
    const setter = setters[k] || (() => { })
    setter(v)
  })
}

export const createAttributeSetters = (gl: WebGLRenderingContext, program: WebGLProgram) =>
  setAttributes(attribSetters(gl, program))

export type Matrix = number[] | Float32Array

export interface Uniforms {
  projectionMatrix?: Matrix,
  modelViewMatrix?: Matrix,
  normalMatrix?: Matrix,
  texture?: WebGLTexture | null,
  colorMult?: Vector,
  lightDirection?: Vector,
  lightProjectionMatrix?: Matrix,
  lightModelViewMatrix?: Matrix
}

export const setUniforms = (setters: UniformFunctions) => (uniforms: Uniforms) => {
  Object.entries(uniforms).forEach(([k, v]) => {
    // @ts-ignore
    setters[k](v)
  })
}

export const createTexture = (gl: WebGLRenderingContext, width: number = 256, height: number = 256) => {
  const targetTexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, targetTexture)

  const level = 0
  const internalFormat = gl.RGBA
  const border = 0
  const format = gl.RGBA
  const type = gl.UNSIGNED_BYTE
  const data = null
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
}

export const bindFramebuffer = (gl: WebGLRenderingContext, target: WebGLFramebuffer | null, width: number, height: number) => {
  gl.bindFramebuffer(gl.FRAMEBUFFER, target)
  gl.viewport(0, 0, width, height)
}
