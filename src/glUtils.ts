import { UniformFunctions } from './programInfo'
import { range, objectFromValues } from './utils'

export const getGlContext = (canvasId: string) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#' + canvasId)
  return canvas ? canvas.getContext('webgl') : null
}

export const setViewport = (gl: WebGLRenderingContext, width: number, height: number) => gl.viewport(0, 0, width, height)

interface AttribData {
  numComponents: number,
  normalize?: boolean,
  stride?: number,
  offset?: number,
  buffer: WebGLBuffer,
  type?: number,
  size: number
}

export const attribSetters = (gl: WebGLRenderingContext, program: WebGLProgram) => {
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
    .map(x => [x.name, createAttribSetter(gl.getAttribLocation(program, x.name))])
  return objectFromValues(...keyVals)
}

export const setAttributes = (setters: object) => (attribs: object) => {
  Object.entries(attribs).forEach(([k, v]) => {
    const setter = setters[k] || (() => { })
    setter(v)
  })
}

export const createAttributeSetters = (gl: WebGLRenderingContext, program: WebGLProgram) =>
  setAttributes(attribSetters(gl, program))

type Matrix = number[] | Float32Array
export interface Uniforms {
  projectionMatrix: Matrix,
  modelMatrix: Matrix,
  normalMatrix: Matrix,
  viewMatrix: Matrix,
  texture: WebGLTexture | null,
  colorMult: number[] | Float32Array
}

export const setUniforms = (setters: UniformFunctions) => (uniforms: Uniforms) => {
  Object.entries(uniforms).forEach(([k, v]) => {
    setters[k](v)
  })
}
