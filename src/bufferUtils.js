import { boundingBox } from './vector'

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
    position: createArrayBuffer(bufferObj.v),
    color: createArrayBuffer(bufferObj.colors),
    normal: createArrayBuffer(bufferObj.vn),
    textureCoord: createArrayBuffer(bufferObj.vt),
    indices: createElementArrayBuffer(bufferObj.f),
    boundingBox: createArrayBuffer(boundingBox(bufferObj.min, bufferObj.max))
  }
}
