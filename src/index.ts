/* global alert, requestAnimationFrame */
import 'babel-polyfill'
// import VertexShader from './shaders/vertex.glsl'
// import FragmentShader from './shaders/fragment.glsl'
import SimpleFragmentShader from './shaders/simple_fragment.glsl'
import SimpleVertexShader from './shaders/simple_vertex.glsl'
import { initShaderProgram } from './shaderUtils'
import { initBuffers } from './bufferUtils'
import { initTexture } from './textureUtils'
import { drawScene } from './renderUtils'
import models, { ModelData } from './objs'
import { boundingBox, dists, centeringTranslation, scale } from './vector'

export const getGlContext = (canvasId: string) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#' + canvasId)
  return canvas ? canvas.getContext('webgl') : null
}

type ProgramInfo = {
  program: WebGLShader,
  attribLocations: {
    vertexPosition: any,
    vertexNormal: any,
    textureCoord: any,
    vertexColor: any
  },
  uniformLocations: {
    projectionMatrix: any,
    modelViewMatrix: any,
    normalMatrix: any,
    uSampler: any
  }
}

let renderFunc = (_rotation: number) => (_then: number) => (_now: number) => { }

let getProgramInfo = (gl: WebGLRenderingContext) => async (vertexShader: string, fragmentShader: string) => initShaderProgram(gl, vertexShader, fragmentShader)

export const setModel = (gl: WebGLRenderingContext) => (model: ModelData) => getProgramInfo(gl)(SimpleVertexShader, SimpleFragmentShader).then(
  programInfo => render__(gl)(programInfo)(model)
)

export const render__ = (gl: WebGLRenderingContext) => (programInfo: ProgramInfo) => (model: ModelData) => {
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)


  const bb = boundingBox(model.min, model.max)
  const lengths = dists(model.min, model.max)
  const t = centeringTranslation(model.max, lengths)
  const s = 1 / Math.max(...scale(0.5)(lengths))

  const buffers = initBuffers(gl, model)
  const texture = initTexture(gl)

  renderFunc = (cubeRotation: number) => (then: number) => (now: number) => {
    const nowSeconds = now * 0.001
    const deltaS = nowSeconds - then

    drawScene(gl, programInfo, buffers, texture, cubeRotation, t, s, model.f.length, bb)
    // requestAnimationFrame(renderFunc(cubeRotation + deltaS)(nowSeconds))
  }
  requestAnimationFrame(renderFunc(0.7)(0))
}

export const render = (gl: WebGLRenderingContext) => (model: ModelData) =>
  initShaderProgram(gl, SimpleVertexShader, SimpleFragmentShader)
    .then(shaderProgram => {
      console.log("calling render")
      const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
        }
      }

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // const dataPoints = models.get('bunny (hi res)')
      const dataPoints = models['bunny (hi res)']


      const bb = boundingBox(dataPoints.min, dataPoints.max)
      const lengths = dists(dataPoints.min, dataPoints.max)
      const t = centeringTranslation(dataPoints.max, lengths)
      // const o = offset(dataPoints.max, lengths)
      const s = 1 / Math.max(...scale(0.5)(lengths))

      const buffers = initBuffers(gl, dataPoints)
      const texture = initTexture(gl)

      const render = (cubeRotation: number) => (then: number) => (now: number) => {
        const nowSeconds = now * 0.001
        const deltaS = nowSeconds - then

        drawScene(gl, programInfo, buffers, texture, cubeRotation, t, s, model.f.length, bb)

        // requestAnimationFrame(render(cubeRotation + deltaS)(nowSeconds))
      }
      requestAnimationFrame(render(0.7)(0))
      // requestAnimationFrame(render(0)(0))
    })
    .catch(alert)



/*
  Overføring av objekt data til GPU og WebGL
Legg til funksjonalitet som overfører de innlastede dataene til GPUen med WebGL. Dette betyr at du oppretter array buffre for de dataene som er lastet inn og kopler disse til verteks-shaderen. Hvis en type data, som farger, ikke er inkludert, skal dette tas hensyn til. Her kan du lage forskjellige verteks- shadere basert på hvilke data som er tilgjengelige.
  Start med et enkel type objekt (for eksempel, bare verteks-data uten farge, tekstur, og normaler), for deretter å utvide støtten iterativt.
  UI web applikasjon
Legg til funksjonalitet for enkel manipulasjon av innlastet objekt. Applikasjonen skal for nå utelukkende støtte visning av et objekt og hvis et nytt objekt lastes inn, skal nåværende objekt fjernes. Applikasjonen burde liste en pre-definert liste av objekter som støttes og som brukeren kan velge mellom.
  Videre, burde applikasjonen støtte valg som å endre på farge for objektet og slå av/på modus som tekstur-rendering.
  */
// fancy program info
      // const programInfo = {
      //   program: shaderProgram,
      //   attribLocations: {
      //     vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      //     vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      //     textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      //     vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
      //   },
      //   uniformLocations: {
      //     projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      //     modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      //     normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      //     uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
      //   }
      // }
