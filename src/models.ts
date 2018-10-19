import objs, { ObjData, ObjTexture } from './objs'
import { initTexture2D } from './textureUtils'
import { initShaderProgram } from './shaderUtils'
import { availableShaders, Programs } from './shaders'

export interface ModelData {
  objData: ObjData,
  programs: Programs,
  texture: WebGLTexture | null
}

const mapObject = (o: object, f: Function) =>
  Object.entries(o).reduce((x, [k, v]) => { x[k] = f(v); return x }, {})

export const defaultProgram = "color"

const models = (gl: WebGLRenderingContext) => mapObject(objs, (x: ObjTexture) => {
  try {
    return {
      objData: x.model,
      programs: mapObject(availableShaders(x.model), initShaderProgram(gl)),
      texture: x.texturePath ? initTexture2D(gl)(x.texturePath) : null
    }
  }
  catch (e) {
    console.error(e)
    return {}
  }
}

export default models
