import objs, { ObjData, ObjTexture } from './objs'
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
  room: DrawArgs,
  platform: DrawArgs
}

const mapObject = (o: object, f: Function) =>
  Object.entries(o).reduce((x, [k, v]) => ({ ...x, [k]: f(v) }), {})

export const defaultProgram = "color"

export const architecture = (gl: WebGLRenderingContext) => {
  const make = (obj: ObjTexture, program: string) => {
    const programs = mapObject(availableShaders(obj.model), initShaderProgram(gl))
    const texture = initTexture2D(gl)(obj.texturePath)
    return drawArgs.create(gl, { program: programs[program], objData: obj.model, texture })
  }

  return {
    room: make(objs.cube, 'lighting'),
    platform: make(objs.plane, 'color')
  }
}

export default (gl: WebGLRenderingContext) => mapObject(objs, (x: ObjTexture) => {
  try {
    const programs = mapObject(availableShaders(x.model), initShaderProgram(gl))
    const texture = x.texturePath ? initTexture2D(gl)(x.texturePath) : null
    return mapObject(programs, (program: WebGLProgram) => drawArgs.create(gl, { program, objData: x.model, texture }))
  }
  catch (e) {
    console.error(e)
    return {}
  }
})
