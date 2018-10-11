import { mat4 } from 'gl-matrix-ts'
import { ProgramInfo, GlobalOptions } from './index'
import { BufferObj } from './bufferUtils'

export const drawEmptyScene = (gl: WebGLRenderingContext) => {
  gl.clearColor(0, 0, 0, 1)
  gl.clearDepth(1)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

export type DrawArgs = {
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: BufferObj
  texture: WebGLTexture | null,
  centeringTranslation: number[],
  normalizingScale: number,
  numFaces: number,
  boundingBox: number[]
}

export const drawScene = (args: DrawArgs, opts: GlobalOptions, rotation: number) => {
  const { gl, programInfo, buffers, texture, normalizingScale, centeringTranslation, numFaces, boundingBox } = args
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
  // mat4.ortho(projectionMatrix, -2, 2, -2, 2, .1, 100)
  // mat4.rotate(projectionMatrix, projectionMatrix, Math.PI / 4, mat4.getRotation([], opts.camera.viewMatrix))
  // mat4.translate(projectionMatrix, projectionMatrix, mat4.getTranslation([], opts.camera.viewMatrix))

  const modelViewMatrix = mat4.clone(opts.camera.viewMatrix)
  // mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, opts.rotation)

  // normalize, then scale
  // mat4.scale(modelViewMatrix, modelViewMatrix, Array(3).fill(normalizingScale * opts.scale))

  // center
  // mat4.translate(modelViewMatrix, modelViewMatrix, centeringTranslation)

  const bindBuffer = (numComponents: number, buffer: WebGLBuffer | null, attribLocs: number) => {
    if (attribLocs === -1) { return }
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

  // bindBuffer(3, buffers.boundingBox, programInfo.attribLocations.vertexPosition)
  bindBuffer(3, buffers.normal, programInfo.attribLocations.vertexNormal)

  bindBuffer(4, buffers.color, programInfo.attribLocations.vertexColor)

  bindBuffer(2, buffers.textureCoord, programInfo.attribLocations.textureCoord)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  gl.useProgram(programInfo.program)

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)

  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  {
    const vertexCount = numFaces
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}
