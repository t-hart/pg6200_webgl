// @ts-ignore
import bunny from './obj_files/bunny'
// @ts-ignore
import bunnyHi from './obj_files/bunny_10k'
// @ts-ignore
import cubeTexture from './textures/cubetexture.png'
// @ts-ignore
import chessTexture from './textures/chess.png'
// @ts-ignore
import brain from './obj_files/brain'
// @ts-ignore
import sphere from './obj_files/sphere'
// @ts-ignore
import circularPlane from './obj_files/circular_plane'
// @ts-ignore
import platforms from './obj_files/platforms'

export interface ObjData {
  v: number[],
  vt: number[],
  vn: number[],
  f: number[],
  colors: number[],
  min: number[],
  max: number[]
}

export interface ObjTexture {
  model: ObjData,
  texturePath?: string
}

const floor = {
  v: [
    // Bottom Left (0)
    -30.0, 0.0, 30.0,
    // Bottom Right (1)
    30.0, 0.0, 30.0,
    // Top Right (2)
    30.0, 0.0, -30.0,
    // Top Left (3)
    -30.0, 0.0, -30.0
  ],
  f: [
    // Front face
    0, 1, 2, 0, 2, 3
  ],
  colors: [
    .6, .6, .6, 1.0,
    .6, .6, .6, 1.0,
    .6, .6, .6, 1.0,
    .6, .6, .6, 1.0,
  ],
  vt: [

    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ],
  vn: [

    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

  ],
  min: [-30, 0, -30],
  max: [30, 0, 30]

}

const cube = {
  v: [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
  ],
  vt: [
    // Front
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Back
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Top
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Bottom
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Right
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Left
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
  ],
  vn: [
    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
  ],
  f: [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    8, 9, 10, 8, 10, 11, // top
    12, 13, 14, 12, 14, 15, // bottom
    16, 17, 18, 16, 18, 19, // right
    20, 21, 22, 20, 22, 23 // left
  ],
  colors: [
    [1.0, 0.0, 0.0, 1.0],    // Front face: red
    [1.0, 1.0, 1.0, 1.0],    // Back face: white
    [0.0, 1.0, 0.0, 1.0],    // Top face: green
    [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
    [1.0, 0.0, 1.0, 1.0],    // Left face: purple
    // @ts-ignore: flatmap is just fine, and typing x is a bit overzealous.
  ].flatMap(x => [].concat(...Array(4).fill(x))),
  min: [-1, -1, -1],
  max: [1, 1, 1],
}

export const textures = {
  fireFox: cubeTexture,
  chess: chessTexture
}

export default {
  bunny: { model: bunny },
  'bunny (hi)': { model: bunnyHi },
  cube: { model: cube, texturePath: cubeTexture },
  brain: { model: brain },
  sphere: { model: sphere },
  'plane (circular)': { model: circularPlane },
  platforms: { model: platforms },
  floor: { model: floor }
}
