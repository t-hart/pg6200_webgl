/* global alert, requestAnimationFrame */
import 'babel-polyfill'
import { initShaderProgram } from './shaderUtils'
import { initBuffers } from './bufferUtils'
import { initTexture } from './textureUtils'
import { drawScene, drawEmptyScene } from './renderUtils'
import { ModelData } from './objs'
import { boundingBox, dists, centeringTranslation, scale } from './vector'
import { ShaderSet } from './shaders'

export const getGlContext = (canvasId: string) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#' + canvasId)
  return canvas ? canvas.getContext('webgl') : null
}

export type ProgramInfo = {
  program: WebGLProgram | null,
  attribLocations: {
    vertexPosition: number,
    vertexNormal?: number,
    textureCoord?: number,
    vertexColor: number
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null,
    modelViewMatrix: WebGLUniformLocation | null,
    normalMatrix?: WebGLUniformLocation | null,
    uSampler?: WebGLUniformLocation | null
  }
}


export const initGL = (gl: WebGLRenderingContext) => drawEmptyScene(gl)

export const render = (gl: WebGLRenderingContext, model: ModelData | undefined, shaders: ShaderSet | undefined) =>
  !model || !shaders
    ? drawEmptyScene(gl)
    : initShaderProgram(gl, shaders)
      .then(shaderProgram => {

        const programInfo = {
          program: shaderProgram,
          attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
          },
          uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
          }
        }

        const bb = boundingBox(model.min, model.max)
        const lengths = dists(model.min, model.max)
        const t = centeringTranslation(model.max, lengths)
        // const o = offset(model.max, lengths)
        const s = 1 / Math.max(...scale(0.5)(lengths))

        const buffers = initBuffers(gl, model)
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
// simple program info
      // const programInfo = {
      //   program: shaderProgram,
      //   attribLocations: {
      //     vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      //     vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
      //   },
      //   uniformLocations: {
      //     projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      //     modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
      //   }
      // }
