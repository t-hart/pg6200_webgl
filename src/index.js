/* global alert, requestAnimationFrame */
import 'babel-polyfill'
import Video from './videos/Firefox.mp4'
import VertexShader from './shaders/vertex.glsl'
import FragmentShader from './shaders/fragment.glsl'
import { initShaderProgram } from './shaderUtils.js'
import { initBuffers } from './bufferUtils.js'
import { initTexture, updateTexture } from './textureUtils.js'
import { drawScene } from './renderUtils.js'
import { setupVideo } from './videoUtils.js'
import { bunny, cube } from './objs.ts'

export const renderTo = async (canvasId) => {
  const canvas = document.querySelector('#' + canvasId)
  const gl = canvas.getContext('webgl')
  initShaderProgram(gl, VertexShader, FragmentShader)
    .then(async (shaderProgram) => {
      if (!gl) {
        throw Error('Unable to init webgl')
      }

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

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const dataPoints = await cube()
      console.log(dataPoints)

      const buffers = initBuffers(gl, dataPoints)
      const texture = initTexture(gl)

      console.log(buffers)
      const render = cubeRotation => then => now => {
        const nowSeconds = now * 0.001
        const deltaS = nowSeconds - then

        drawScene(gl, programInfo, buffers, texture, cubeRotation)

        // requestAnimationFrame(render(cubeRotation + deltaS)(nowSeconds))
      }
      requestAnimationFrame(render(0)(0))
    })
    .catch(alert)
}

/*
  Overføring av objekt data til GPU og WebGL
Legg til funksjonalitet som overfører de innlastede dataene til GPUen med WebGL. Dette betyr at du oppretter array buffre for de dataene som er lastet inn og kopler disse til verteks-shaderen. Hvis en type data, som farger, ikke er inkludert, skal dette tas hensyn til. Her kan du lage forskjellige verteks- shadere basert på hvilke data som er tilgjengelige.
  Start med et enkel type objekt (for eksempel, bare verteks-data uten farge, tekstur, og normaler), for deretter å utvide støtten iterativt.
  UI web applikasjon
Legg til funksjonalitet for enkel manipulasjon av innlastet objekt. Applikasjonen skal for nå utelukkende støtte visning av et objekt og hvis et nytt objekt lastes inn, skal nåværende objekt fjernes. Applikasjonen burde liste en pre-definert liste av objekter som støttes og som brukeren kan velge mellom.
  Videre, burde applikasjonen støtte valg som å endre på farge for objektet og slå av/på modus som tekstur-rendering.
  */
