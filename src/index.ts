/* global alert, requestAnimationFrame */
import 'babel-polyfill'
import { initBuffers } from './bufferUtils'
import { drawScene, drawEmptyScene } from './renderUtils'
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

export const initGL = (gl: WebGLRenderingContext) => drawEmptyScene(gl)

type RenderArgs = {
  objData: ObjData,
  program: WebGLProgram,
  texture: WebGLTexture | null
}

type MaybeData = RenderArgs | null

export type GlobalOptions = {
  scale: number
}

export const log = (a: any) => { console.log(a); return a }

export const getRenderFunc = (gl: WebGLRenderingContext, data: MaybeData, opts: GlobalOptions) => {
  if (!data) {
    drawEmptyScene(gl)
    return null
  }

  const { program, objData, texture } = data
  const programInfo = createProgramInfo(gl, program)
  const lengths = dists(objData.min, objData.max)

  const drawArgs = {
    boundingBox: boundingBox(objData.min, objData.max),
    buffers: initBuffers(gl, objData),
    centeringTranslation: centeringTranslation(objData.max, lengths),
    gl,
    normalizingScale: 1 / Math.max(...scale(0.5)(lengths)),
    numFaces: objData.f.length,
    programInfo,
    texture,
  }

  const render = (cubeRotation: number) => (then: number) => (opts: GlobalOptions) => (now: number): Function => {
    const nowSeconds = now * 0.001
    const deltaS = nowSeconds - then

    drawScene(drawArgs, cubeRotation, opts)

    return (opts: GlobalOptions) => requestAnimationFrame(render(cubeRotation + deltaS)(nowSeconds)(opts))
  }
  return (opts: GlobalOptions) => requestAnimationFrame(render(0)(0)(opts))
}

export const render = (gl: WebGLRenderingContext, data: MaybeData, opts: GlobalOptions) => {
  if (!data) {
    drawEmptyScene(gl)
    return
  }
  const { program, objData, texture } = data

  const programInfo = createProgramInfo(gl, program)

  const lengths = dists(objData.min, objData.max)

  const drawArgs = {
    boundingBox: boundingBox(objData.min, objData.max),
    buffers: initBuffers(gl, objData),
    centeringTranslation: centeringTranslation(objData.max, lengths),
    gl,
    normalizingScale: 1 / Math.max(...scale(0.5)(lengths)),
    numFaces: objData.f.length,
    programInfo,
    texture,
  }

  const render = (cubeRotation: number) => (then: number) => (now: number) => {
    const nowSeconds = now * 0.001
    const deltaS = nowSeconds - then

    drawScene(drawArgs, cubeRotation, opts)

    // requestAnimationFrame(render(cubeRotation + deltaS)(nowSeconds))
  }
  requestAnimationFrame(render(0.7)(0))
  // requestAnimationFrame(render(0)(0))
}


/*
  Overføring av objekt data til GPU og WebGL
Legg til funksjonalitet som overfører de innlastede dataene til GPUen med WebGL. Dette betyr at du oppretter array buffre for de dataene som er lastet inn og kopler disse til verteks-shaderen. Hvis en type data, som farger, ikke er inkludert, skal dette tas hensyn til. Her kan du lage forskjellige verteks- shadere basert på hvilke data som er tilgjengelige.
  Start med et enkel type objekt (for eksempel, bare verteks-data uten farge, tekstur, og normaler), for deretter å utvide støtten iterativt.
  UI web applikasjon
Legg til funksjonalitet for enkel manipulasjon av innlastet objekt. Applikasjonen skal for nå utelukkende støtte visning av et objekt og hvis et nytt objekt lastes inn, skal nåværende objekt fjernes. Applikasjonen burde liste en pre-definert liste av objekter som støttes og som brukeren kan velge mellom.
  Videre, burde applikasjonen støtte valg som å endre på farge for objektet og slå av/på modus som tekstur-rendering.
  */
