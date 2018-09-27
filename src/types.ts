import Vector from './vector'

export interface DataPoints {
  vertices: number[],
  vertexTextures: number[],
  vertexNormals: number[],
  faces: number[],
  colors: number[],
  max: Vector,
  min: Vector
}
