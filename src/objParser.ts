import { DataPoints } from './types'

export const parse = (obj: string) => fetch(obj)
  .then(res => res.text())
  .then(data => _parse(data))
  .catch(e => console.log('Unable to load obj file:', e))

const _parse = (data: string) => data.split('\n').reduce((acc: DataPoints, x) => {
  const l = x.split(' ')
  const fst = l.slice(1, 4).map(parseFloat)
  const snd = l.slice(4, 7).map(parseFloat)
  switch (l[0]) {
    case 'v':
      return { ...acc, vertices: [...acc.vertices, ...fst], colors: [...acc.colors, ...snd] }
    case 'vn':
      return { ...acc, vertexNormals: [...acc.vertexNormals, ...fst] }
    case 'vt':
      return { ...acc, vertexTextures: [...acc.vertexTextures, ...fst] }
    case 'f':
      return { ...acc, faces: [...acc.faces, ...fst] }
    default:
      return acc
  }
}, {
    vertices: [],
    vertexTextures: [],
    vertexNormals: [],
    faces: [],
    colors: []
  })
