/* global alert, Image, requestAnimationFrame */
import 'babel-polyfill'
import { mat4 } from 'gl-matrix'
import CubeTexture from './textures/cubetexture.png'
import VsSource from './vsSource.glsl'
import FsSource from './fsSource.glsl'

const initShaderProgram = (gl, vsSource, fsSource) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to init shader program:', gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred while compiling the shaders: ', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const initBuffers = (gl) => {
  const createBuffer = bufferType => ArrayInitialiser => arr => {
    const buffer = gl.createBuffer()
    gl.bindBuffer(bufferType, buffer)
    gl.bufferData(bufferType, new ArrayInitialiser(arr), gl.STATIC_DRAW)
    return buffer
  }

  const createArrayBuffer = createBuffer(gl.ARRAY_BUFFER)(Float32Array)
  const createElementArrayBuffer = createBuffer(gl.ELEMENT_ARRAY_BUFFER)(Uint16Array)

  const positions = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
  ]

  const textureCoordinates = [
    // Front
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Back
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Top
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Bottom
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Right
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Left
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
  ]

  const indices = [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    8, 9, 10, 8, 10, 11, // top
    12, 13, 14, 12, 14, 15, // bottom
    16, 17, 18, 16, 18, 19, // right
    20, 21, 22, 20, 22, 23 // left
  ]

  return {
    position: createArrayBuffer(positions),
    textureCoord: createArrayBuffer(textureCoordinates),
    indices: createElementArrayBuffer(indices)
  }
}

const drawScene = (gl, programInfo, buffers, texture, cubeRotation) => {
  gl.clearColor(0, 0, 0, 1)
  gl.clearDepth(1)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = 45 * Math.PI / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100
  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()

  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6])
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1])
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0])

  gl.useProgram(programInfo.program)

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)

  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

  const bindBuffer = (numComponents, buffer, attribLocs) => {
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(
      attribLocs,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(attribLocs)
  }

  bindBuffer(3, buffers.position, programInfo.attribLocations.vertexPosition)

  bindBuffer(2, buffers.textureCoord, programInfo.attribLocations.textureCoord)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  {
    const vertexCount = 36
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}

const loadTexture = (gl, url) => {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)

  const image = new Image()
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

    const isPowerOf2 = value => (value & (value - 1)) === 0

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      gl.texParamateri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParamateri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParamateri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }
  image.src = url
  return texture
}

const main = () => {
  const canvas = document.querySelector('#glCanvas')
  const gl = canvas.getContext('webgl')
  const shaderProgram = initShaderProgram(gl, VsSource, FsSource)

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
    }
  }

  if (!gl) {
    alert('Unable to init webgl')
    return
  }

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const buffers = initBuffers(gl)
  const texture = loadTexture(gl, CubeTexture)

  const render = cubeRotation => then => now => {
    const nowSeconds = now * 0.001
    const deltaTime = nowSeconds - then
    drawScene(gl, programInfo, buffers, texture, cubeRotation)

    requestAnimationFrame(render(cubeRotation + deltaTime)(nowSeconds))
  }
  requestAnimationFrame(render(0)(0))
}

main()
