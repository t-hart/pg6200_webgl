import { ObjData } from './objs'
import Vector from './vector'
import { boundingBox, dists, centeringTranslation, scale } from './vector'
import BufferObject, { initBuffers } from './bufferUtils'
import ProgramInfo, * as programInfo from './programInfo'

type DrawArgs = {
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: BufferObject
  texture: WebGLTexture | null,
  centeringTranslation: Vector,
  normalizingScale: number,
  numFaces: number,
  boundingBox: number[]
}

type RenderArgs = {
  objData: ObjData,
  program: WebGLProgram,
  texture: WebGLTexture | null
}

export const create = (gl: WebGLRenderingContext, { program, objData, texture }: RenderArgs): DrawArgs => {
  const lengths = dists(objData.min, objData.max)

  return {
    boundingBox: boundingBox(objData.min, objData.max),
    buffers: initBuffers(gl, objData),
    centeringTranslation: centeringTranslation(objData.max, lengths),
    gl,
    normalizingScale: 1 / Math.max(...scale(0.5)(lengths)),
    numFaces: objData.f.length,
    programInfo: programInfo.create(gl, program),
    texture,
  }
}

export default DrawArgs
