import { ShaderSet } from './shaders'

export const initShaderProgram = (gl: WebGLRenderingContext, shaders: ShaderSet) => {
  return Promise.all([loadShader(gl, gl.VERTEX_SHADER, shaders.vertex), loadShader(gl, gl.FRAGMENT_SHADER, shaders.fragment)])
    .then(([vertexShader, fragmentShader]) => {
      const shaderProgram = gl.createProgram()
      gl.attachShader(shaderProgram, vertexShader)
      gl.attachShader(shaderProgram, fragmentShader)
      gl.linkProgram(shaderProgram)

      if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        return shaderProgram
      } else {
        throw Error(`Unable to init shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
      }
    })
}

const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  return gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    ? Promise.resolve(shader)
    : Promise.reject(Error(`An error occurred while compiling the shaders: ${gl.getShaderInfoLog(shader)}`))
}
