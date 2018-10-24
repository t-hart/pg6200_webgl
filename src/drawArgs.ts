import { ObjData } from './objs'
import BufferObj from './bufferUtils'
import * as glUtils from './glUtils'
import Vector from './vector'
import { boundingBox, dists, centeringTranslation, scale } from './vector'
import { initBuffers } from './bufferUtils'
import ProgramInfo, * as programInfo from './programInfo'

export interface DrawArgs {
  readonly texture: WebGLTexture | null,
  readonly centeringTranslation: Vector,
  readonly normalizingScale: number,
  readonly boundingBox: number[],
  readonly render: (uniforms: glUtils.Uniforms, program: WebGLProgram) => void,
  readonly programInfo: ProgramInfo,
  readonly objData: ObjData,
  readonly attribs: object,
  readonly buffers: BufferObj
}

interface RenderArgs {
  objData: ObjData,
  program: WebGLProgram,
  texture: WebGLTexture | null
}

export const render = (gl: WebGLRenderingContext, uniforms: glUtils.Uniforms, program: WebGLProgram, drawArgs: DrawArgs) => {
  const { attribs, buffers, objData } = drawArgs
  gl.useProgram(program)
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  glUtils.createAttributeSetters(gl, program)(attribs)
  glUtils.setUniforms(programInfo.uniformFunctions(gl, program))(uniforms)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  const vertexCount = objData.f.length
  const type = gl.UNSIGNED_SHORT
  const offset = 0
  gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
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
    centeringTranslation: centeringTranslation(objData.max, lengths),
    // @ts-ignore
    normalizingScale: 1 / Math.max(...scale(0.5)(lengths)),
    texture,
    objData,
    attribs,
    buffers,
    programInfo: progInfo,
    render: (uniforms: glUtils.Uniforms, program: WebGLProgram) => {
      gl.useProgram(program)
      glUtils.createAttributeSetters(gl, program)(attribs)
      glUtils.setUniforms(progInfo.uniformFunctions)(uniforms)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

      const vertexCount = objData.f.length
      const type = gl.UNSIGNED_SHORT
      const offset = 0
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
    }
  }
}

export default DrawArgs
