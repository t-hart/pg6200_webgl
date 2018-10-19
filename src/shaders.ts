import { ObjData } from './objs'
// @ts-ignore
import ColorFragment from './shaders/simple_fragment.glsl'
// @ts-ignore
import ColorVertex from './shaders/simple_vertex.glsl'
// @ts-ignore
import LightingFragment from './shaders/fragment_texture_lighting.glsl'
// @ts-ignore
import LightingVertex from './shaders/vertex_texture_lighting.glsl'
// @ts-ignore
import TextureFragment from './shaders/fragment_texture.glsl'
// @ts-ignore
import TextureVertex from './shaders/vertex_texture.glsl'

export interface ShaderSet {
  vertex: string,
  fragment: string
}

export interface Programs {
  color: WebGLProgram,
  texture?: WebGLProgram,
  lighting?: WebGLProgram
}

const shaders = {
  color: {
    vertex: ColorVertex,
    fragment: ColorFragment
  },
  texture: {
    vertex: TextureVertex,
    fragment: TextureFragment
  },
  lighting: {
    vertex: LightingVertex,
    fragment: LightingFragment
  }
}

export const availableShaders = (model: ObjData) => model.vt.length ? shaders : { color: shaders.color }

export default shaders
