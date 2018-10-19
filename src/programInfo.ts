interface ProgramInfo {
  program: WebGLProgram | null,
  attribLocations: {
    vertexPosition: number,
    vertexNormal: number,
    textureCoord: number,
    vertexColor: number
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null,
    modelMatrix: WebGLUniformLocation | null,
    viewMatrix: WebGLUniformLocation | null,
    normalMatrix: WebGLUniformLocation | null,
    uSampler: WebGLUniformLocation | null,
    colorMult: WebGLUniformLocation | null
  }
}

export const create = (gl: WebGLRenderingContext, program: WebGLProgram) => ({
  program: program,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    vertexNormal: gl.getAttribLocation(program, 'aVertexNormal'),
    textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
    vertexColor: gl.getAttribLocation(program, 'aVertexColor')
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
    modelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
    viewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
    normalMatrix: gl.getUniformLocation(program, 'uNormalMatrix'),
    uSampler: gl.getUniformLocation(program, 'uSampler'),
    colorMult: gl.getUniformLocation(program, 'uColorMult')
  }
})

export default ProgramInfo
