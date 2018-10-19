import { boundingBox } from './vector'
import { ObjData } from './objs'

interface BufferObject {
  position: WebGLBuffer | null,
  color: WebGLBuffer | null,
  normal: WebGLBuffer | null,
  textureCoord: WebGLBuffer | null,
  indices: WebGLBuffer | null,
  boundingBox: WebGLBuffer | null
}

export const initBuffers = (gl: WebGLRenderingContext, bufferObj: ObjData) => {
  const createBuffer = (bufferType: number) => (arrayConstructor: Uint16ArrayConstructor | Float32ArrayConstructor) => (arr: number[]) => {
    const buffer = gl.createBuffer()
    gl.bindBuffer(bufferType, buffer)
    gl.bufferData(bufferType, new arrayConstructor(arr), gl.STATIC_DRAW)
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

export default BufferObject
