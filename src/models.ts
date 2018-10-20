import objs, { ObjData, ObjTexture } from './objs'
import * as drawArgs from './drawArgs'
import { initTexture2D } from './textureUtils'
import { initShaderProgram } from './shaderUtils'
import { availableShaders, Programs } from './shaders'

export interface ModelData {
  objData: ObjData,
  programs: Programs,
  texture: WebGLTexture | null
}

const mapObject = (o: object, f: Function) =>
  Object.entries(o).reduce((x, [k, v]) => ({ ...x, [k]: f(v) }), {})

const flatMapObject = (o: object, f: (a: any) => b: any) => mapObject(o, f)

export const defaultProgram = "color"

const models = (gl: WebGLRenderingContext) => mapObject(objs, (x: ObjTexture) => {
  try {
    const programs = mapObject(availableShaders(x.model), initShaderProgram(gl))
    const texture = x.texturePath ? initTexture2D(gl)(x.texturePath) : null
    return mapObject(programs, (program: WebGLProgram) => drawArgs.create(gl, { program, objData: x.model, texture }))
  }
  catch (e) {
    console.error(e)
    return {}
  }
}

export default models
