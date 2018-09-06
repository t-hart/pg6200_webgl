import { DataPoints } from './types'
import { Vector, scale } from './vector'

export const parse = (obj: string) => fetch(obj)
  .then(res => res.text())
  .then(data => _parse(data))
  .catch(e => console.log('Unable to load obj file:', e))

const _parse = (data: string) => data.split('\n').reduce((acc: DataPoints, x) => {
  const l = x.split(' ')
  const fst = l.slice(1, 4).map(parseFloat)
  const snd = l.slice(4, 8).map(parseFloat)
  switch (l[0]) {
    case 'v':
      const { min, max } = minMax(acc.min, acc.max, fst)
      return { ...acc, vertices: [...acc.vertices, ...fst], colors: [...acc.colors, ...parseColors(snd)], min, max }
    case 'vn':
      return { ...acc, vertexNormals: [...acc.vertexNormals, ...fst] }
    case 'vt':
      return { ...acc, vertexTextures: [...acc.vertexTextures, ...fst] }
    case 'f':
      return { ...acc, faces: [...acc.faces, ...fst.map(x => x - 1)] }
    default:
      return acc
  }
}, {
    vertices: [],
    vertexTextures: [],
    vertexNormals: [],
    faces: [],
    colors: [],
    min: scale(Number.MAX_SAFE_INTEGER)([1, 1, 1]),
    max: scale(Number.MIN_SAFE_INTEGER)([1, 1, 1]),
  })

const minMax = (min: Vector, max: Vector, vals: number[]) => ({
  max: max.map((x, i) => Math.max(x, vals[i])),
  min: min.map((x, i) => Math.min(x, vals[i]))
})

// add alpha if it's missing or return a default color if we get invalid input
const parseColors = (cs: number[]) =>
  cs.length === 4 ? cs
    : cs.length === 3 ? [...cs, 1]
      : [1, 1, 1, 1]
