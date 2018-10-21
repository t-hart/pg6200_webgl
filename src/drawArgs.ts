import { ObjData } from './objs'
import * as glUtils from './glUtils'
import Vector from './vector'
import { boundingBox, dists, centeringTranslation, scale } from './vector'
import { initBuffers } from './bufferUtils'
import * as programInfo from './programInfo'

export interface DrawArgs {
  readonly texture: WebGLTexture | null,
  readonly centeringTranslation: Vector,
  readonly normalizingScale: number,
  readonly boundingBox: number[],
  readonly render: (uniforms: glUtils.Uniforms) => void,
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
    centeringTranslation: centeringTranslation(objData.max, lengths),
    normalizingScale: 1 / Math.max(...scale(0.5)(lengths)),
    texture,
    render: (uniforms: glUtils.Uniforms) => {
      gl.useProgram(progInfo.program)
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
