import { mat4 } from 'gl-matrix'

export const drawScene = (gl, programInfo, buffers, texture, cubeRotation) => {
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
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.75, [0.3, 0.7, 0.5])
  mat4.scale(modelViewMatrix, modelViewMatrix, [10, 10, 10])

  // const normalMatrix = mat4.create()
  // mat4.invert(normalMatrix, modelViewMatrix)
  // mat4.transpose(normalMatrix, normalMatrix)

  // gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)

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

  // bindBuffer(3, buffers.normal, programInfo.attribLocations.vertexNormal)

  bindBuffer(4, buffers.color, programInfo.attribLocations.vertexColor)

  // bindBuffer(2, buffers.textureCoord, programInfo.attribLocations.textureCoord)

  // gl.activeTexture(gl.TEXTURE0)
  // gl.bindTexture(gl.TEXTURE_2D, texture)
  // gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  gl.useProgram(programInfo.program)

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)

  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

  {
    const vertexCount = 1359 / 3
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.POINTS, vertexCount, type, offset)
    // gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}
