export interface UniformFunctions {
  projectionMatrix: Function,
  modelViewMatrix: Function,
  normalMatrix: Function,
  texture: Function,
  colorMult: Function,
  lightDirection: Function,
}

interface ProgramInfo {
  program: WebGLProgram | null,
  attribLocations: {
    aVertexPosition: number,
    aVertexNormal: number,
    aTextureCoord: number,
    aVertexColor: number
  },
  uniformFunctions: UniformFunctions
}

const matrixUniform = (gl: WebGLRenderingContext, location: WebGLUniformLocation | null) => (matrix: number[] | Float32Array) =>
  gl.uniformMatrix4fv(location, false, matrix)

const vec3Uniform = (gl: WebGLRenderingContext, location: WebGLUniformLocation | null) => (vec: number[] | Float32Array) => gl.uniform3fv(location, vec)


const vec4Uniform = (gl: WebGLRenderingContext, location: WebGLUniformLocation | null) => (vec: number[] | Float32Array) =>
  gl.uniform4fv(location, vec)

const texture = (gl: WebGLRenderingContext, location: WebGLUniformLocation | null) => (texture: WebGLTexture | null, x: number = 0) => {
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(location, x)
}

export const create = (gl: WebGLRenderingContext, program: WebGLProgram): ProgramInfo => ({
  program: program,
  attribLocations: {
    aVertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    aVertexNormal: gl.getAttribLocation(program, 'aVertexNormal'),
    aTextureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
    aVertexColor: gl.getAttribLocation(program, 'aVertexColor')
  },
  uniformFunctions: {
    projectionMatrix: matrixUniform(gl, gl.getUniformLocation(program, 'uProjectionMatrix')),
    modelViewMatrix: matrixUniform(gl, gl.getUniformLocation(program, 'uModelViewMatrix')),
    normalMatrix: matrixUniform(gl, gl.getUniformLocation(program, 'uNormalMatrix')),
    texture: texture(gl, gl.getUniformLocation(program, 'uSampler')),
    colorMult: vec4Uniform(gl, gl.getUniformLocation(program, 'uColorMult')),
    lightDirection: vec3Uniform(gl, gl.getUniformLocation(program, 'uLightDirection'))
  }
})

export default ProgramInfo
