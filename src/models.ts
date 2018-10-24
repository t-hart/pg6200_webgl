import objs, { ObjData, ObjTexture, textures } from './objs'
import DrawArgs, * as drawArgs from './drawArgs'
import { initTexture2D } from './textureUtils'
import { initShaderProgram } from './shaderUtils'
import { availableShaders, Programs } from './shaders'

export interface ModelData {
  objData: ObjData,
  programs: Programs,
  texture: WebGLTexture | null
}

export interface Architecture {
  lightSource: DrawArgs
  room: DrawArgs,
  platform: DrawArgs
}

const mapObject = (o: object, f: Function) =>
  Object.entries(o).reduce((x, [k, v]) => ({ ...x, [k]: f(v) }), {})

// export const defaultProgram = "color"
export const defaultProgram = "cam"

export const architecture = (gl: WebGLRenderingContext) => {
  const make = (obj: ObjTexture, program: string, texturePath?: string) => {
    const programs = mapObject(availableShaders(obj.model), initShaderProgram(gl))
    const texture = initTexture2D(gl)(texturePath || obj.texturePath)
    return drawArgs.create(gl, { program: programs[program], objData: obj.model, texture })
  }

  return {
    lightSource: make(objs.sphere, 'color'),
    room: make(objs.cube, 'cam', textures.chess),
    platform: make(objs.floor, 'cam')
  }
}

export default (gl: WebGLRenderingContext) => mapObject(objs, (x: ObjTexture) => {
  try {
    const programs = mapObject(availableShaders(x.model), initShaderProgram(gl))
    const texture = x.texturePath ? initTexture2D(gl)(x.texturePath) : null
    return mapObject(programs, (program: WebGLProgram) => drawArgs.create(gl, { program, objData: x.model, texture }))
  }
  catch (e) {
    // alert(e)
    console.error(e)
    return {}
  }
})
