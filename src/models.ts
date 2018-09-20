import objs, { ObjData, ObjTexture } from './objs'
import { initTexture2D } from './textureUtils'
import { initShaderProgram } from './shaderUtils'
import { availableShaders, Programs } from './shaders'
import { log } from './index'

export type ModelData = {
  objData: ObjData,
  programs: Programs,
  texture: WebGLTexture | null
}

const mapObject = (o: object, f: Function) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]))

export const defaultProgram = "color"

const models = (gl: WebGLRenderingContext) => mapObject(objs, (x: ObjTexture) => ({
  objData: x.model,
  programs: mapObject(availableShaders(x.model), initShaderProgram(gl)),
  texture: x.texturePath ? log(initTexture2D(gl)(x.texturePath)) : null
}))

export default models
