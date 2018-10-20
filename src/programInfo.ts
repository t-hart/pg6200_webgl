interface ProgramInfo {
  program: WebGLProgram | null,
  attribLocations: {
    vertexPosition: number,
    vertexNormal: number,
    textureCoord: number,
    vertexColor: number
  },
  uniformLocations: {
    uProjectionMatrix: WebGLUniformLocation | null,
    uModelMatrix: WebGLUniformLocation | null,
    uViewMatrix: WebGLUniformLocation | null,
    uNormalMatrix: WebGLUniformLocation | null,
    uSampler: WebGLUniformLocation | null,
    uColorMult: WebGLUniformLocation | null
  },
  uniformFunctions: {
    projectionMatrix: Function,
    modelMatrix: Function,
    viewMatrix: Function,
    normalMatrix: Function,
    sampler: Function,
    colorMult: Function,
  }
}

const matrixUniform = (gl: WebGLRenderingContext, location: WebGLUniformLocation | null) => (matrix: number[] | Float32Array) =>
  gl.uniformMatrix4fv(location, false, matrix)

const vec4Uniform = (gl: WebGLRenderingContext, location: WebGLUniformLocation | null) => (vec: number[] | Float32Array) =>
  gl.uniform4fv(location, vec)

export const create = (gl: WebGLRenderingContext, program: WebGLProgram) => ({
  program: program,
  attribLocations: {
    aVertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    aVertexNormal: gl.getAttribLocation(program, 'aVertexNormal'),
    aTextureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
    aVertexColor: gl.getAttribLocation(program, 'aVertexColor')
  },
  uniformLocations: {
    uProjectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
    uModelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
    uViewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
    uNormalMatrix: gl.getUniformLocation(program, 'uNormalMatrix'),
    uSampler: gl.getUniformLocation(program, 'uSampler'),
    uColorMult: gl.getUniformLocation(program, 'uColorMult')
  },
  uniformFunctions: {
    projectionMatrix: matrixUniform(gl, gl.getUniformLocation(program, 'uProjectionMatrix')),
    modelMatrix: matrixUniform(gl, gl.getUniformLocation(program, 'uModelMatrix')),
    viewMatrix: matrixUniform(gl, gl.getUniformLocation(program, 'uViewMatrix')),
    normalMatrix: matrixUniform(gl, gl.getUniformLocation(program, 'uNormalMatrix')),
    sampler: gl.getUniformLocation(program, 'uSampler'),
    colorMult: vec4Uniform(gl, gl.getUniformLocation(program, 'uColorMult'))
  }
})

export default ProgramInfo
