/* global alert, requestAnimationFrame */
import 'babel-polyfill'
import Camera from './camera'
import Vector from './vector'
import { initBuffersTesting } from './bufferUtils'
import { drawScene, drawEmptyScene, DrawArgs } from './renderUtils'
import { ObjData } from './objs'
import { boundingBox, dists, centeringTranslation, scale } from './vector'

export const getGlContext = (canvasId: string) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#' + canvasId)
  return canvas ? canvas.getContext('webgl') : null
}

export type ProgramInfo = {
  program: WebGLProgram | null,
  attribLocations: {
    vertexPosition: number,
    vertexNormal: number,
    textureCoord: number,
    vertexColor: number
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null,
    modelViewMatrix: WebGLUniformLocation | null,
    normalMatrix: WebGLUniformLocation | null,
    uSampler: WebGLUniformLocation | null
  }
}

const createProgramInfo = (gl: WebGLRenderingContext, program: WebGLProgram) => ({
  program: program,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    vertexNormal: gl.getAttribLocation(program, 'aVertexNormal'),
    textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
    vertexColor: gl.getAttribLocation(program, 'aVertexColor')
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
    normalMatrix: gl.getUniformLocation(program, 'uNormalMatrix'),
    uSampler: gl.getUniformLocation(program, 'uSampler')
  }
})

type RenderArgs = {
  objData: ObjData,
  program: WebGLProgram,
  texture: WebGLTexture | null
}

export type Camera = {
  position: Vector,
  rotation: Vector
}

export type GlobalOptions = {
  scale: number,
  rotation: Vector,
  camera: Camera,
}

export const log = (a: any) => { console.log(a); return a }

export const renderBlank = (gl: WebGLRenderingContext) => drawEmptyScene(gl)

export const getDrawArgs = (gl: WebGLRenderingContext, { program, objData, texture }: RenderArgs): DrawArgs => {
  const programInfo = createProgramInfo(gl, program)
  const lengths = dists(objData.min, objData.max)

  return {
    boundingBox: boundingBox(objData.min, objData.max),
    buffers: initBuffersTesting(gl, objData),
    centeringTranslation: centeringTranslation(objData.max, lengths),
    gl,
    normalizingScale: 1 / Math.max(...scale(0.5)(lengths)),
    numFaces: objData.f.length,
    programInfo,
    texture,
  }
}
