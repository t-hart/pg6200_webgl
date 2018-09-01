/* global fetch */
export const parseObj = (obj) => fetch(obj)
  .then(res => res.text())
  .then(data => parse(data))
  .catch(e => console.log('Unable to load obj file:', e))

const buffers = () => ({
  vertices: [],
  vertexTextures: [],
  vertexNormals: [],
  faces: [],
  colors: []
})

const parse = data => data.split('\n').reduce((acc, x) => {
  const l = x.split(' ')
  const fst = l.slice(1, 4).map(parseFloat)
  const snd = l.slice(4, 7).map(parseFloat)
  switch (l[0]) {
    case 'v':
      return { ...acc, vertices: [ ...acc.vertices, ...fst ], colors: [ ...acc.colors, ...snd ] }
    case 'vn':
      return { ...acc, vertexNormals: [ ...acc.vertexNormals, ...fst ] }
    case 'vt':
      return { ...acc, vertexTextures: [ ...acc.vertexTextures, ...fst ] }
    case 'f':
      return { ...acc, faces: [ ...acc.faces, ...fst ] }
    default:
      return acc
  }
}, buffers())
