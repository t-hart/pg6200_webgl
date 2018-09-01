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
import { parseObj } from './objParser.js'
import bunny from './obj_files/bunny.obj'
// import './ui/Index.re'

const main = async () => {
  const canvas = document.querySelector('#glCanvas')
  const gl = canvas.getContext('webgl')
  initShaderProgram(gl, VertexShader, FragmentShader)
    .then(async (shaderProgram) => {
      const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
          textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
          normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
          uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
        }
      }

      if (!gl) {
        throw Error('Unable to init webgl')
      }

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const bunnyParsed = await parseObj(bunny)
      console.log(bunnyParsed)

      const buffers = initBuffers(gl, bunnyParsed)
      const texture = initTexture(gl)
      const video = await setupVideo(Video)

      console.log(buffers)
      const render = cubeRotation => then => now => {
        const nowSeconds = now * 0.001
        const deltaTime = nowSeconds - then

        updateTexture(gl, texture, video)
        drawScene(gl, programInfo, buffers, texture, cubeRotation)

        requestAnimationFrame(render(cubeRotation + deltaTime)(nowSeconds))
      }
      requestAnimationFrame(render(0)(0))
    })
    .catch(alert)
}

main()
