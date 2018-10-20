import { ObjData } from './objs'
import * as glUtils from './glUtils'
import Vector from './vector'
import { boundingBox, dists, centeringTranslation, scale } from './vector'
import BufferObject, { initBuffers } from './bufferUtils'
import ProgramInfo, * as programInfo from './programInfo'

export interface DrawArgs {
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: BufferObject
  texture: WebGLTexture | null,
  centeringTranslation: Vector,
  normalizingScale: number,
  numFaces: number,
  boundingBox: number[],
  setAttributes: () => void,
  setUniforms: (uniforms: glUtils.Uniforms) => void,
}

interface RenderArgs {
  objData: ObjData,
  program: WebGLProgram,
  texture: WebGLTexture | null
}

export const create = (gl: WebGLRenderingContext, { program, objData, texture }: RenderArgs): DrawArgs => {
  const lengths = dists(objData.min, objData.max)
  const progInfo = programInfo.create(gl, program)
  const buffers = initBuffers(gl, objData)

  const attribs = {
    aVertexNormal: { buffer: buffers.normal, numComponents: 3 },
    aVertexPosition: { buffer: buffers.position, numComponents: 3 },
    aVertexColor: { buffer: buffers.color, numComponents: 4 },
    aTextureCoord: { buffer: buffers.textureCoord, numComponents: 2 }
  }

  return {
    boundingBox: boundingBox(objData.min, objData.max),
    buffers,
    centeringTranslation: centeringTranslation(objData.max, lengths),
    gl,
    normalizingScale: 1 / Math.max(...scale(0.5)(lengths)),
    numFaces: objData.f.length,
    programInfo: progInfo,
    texture,
    setAttributes: () => glUtils.createAttributeSetters(gl, program)(attribs),
    setUniforms: glUtils.setUniforms(progInfo.uniformFunctions)
  }
}

export default DrawArgs
