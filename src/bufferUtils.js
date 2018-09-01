export const initBuffers = (gl, bufferObj) => {
  const createBuffer = bufferType => ArrayInitialiser => arr => {
    const buffer = gl.createBuffer()
    gl.bindBuffer(bufferType, buffer)
    gl.bufferData(bufferType, new ArrayInitialiser(arr), gl.STATIC_DRAW)
    return buffer
  }

  const createArrayBuffer = createBuffer(gl.ARRAY_BUFFER)(Float32Array)
  const createElementArrayBuffer = createBuffer(gl.ELEMENT_ARRAY_BUFFER)(Uint16Array)

  return {
    position: createArrayBuffer(bufferObj.vertices),
    normal: createArrayBuffer(bufferObj.vertexNormals),
    textureCoord: createArrayBuffer(bufferObj.vertexTextures),
    indices: createElementArrayBuffer(bufferObj.faces)
  }
}

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

const vertexNormals = [
  // Front
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,

  // Back
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,
  0.0, 0.0, -1.0,

  // Top
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,

  // Bottom
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, -1.0, 0.0,

  // Right
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,

  // Left
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0,
  -1.0, 0.0, 0.0
]
