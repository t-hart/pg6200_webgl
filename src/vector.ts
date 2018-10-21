import { vec3 } from 'gl-matrix-ts'

type Vector = number[] | Float32Array

export const zip = (...xs: any[][]) => xs.reduce((acc, x) => x.length < acc.length ? x : acc).map((_, i) => xs.map(x => x[i]))

export const boundingBox = (a: Vector, b: Vector) => {
  const [xs, ys, zs] = zip(a, b)
  return xs.flatMap(x => ys.flatMap(y => zs.flatMap(z => [x, y, z])))
}

export const zero = () => vec3.create()

export const dists = (a: Vector, b: Vector) => zip(a, b).map(([a, b]) => Math.abs(a - b))

export const centeringTranslation = (max: Vector, lengths: Vector) => scale(-1)(offset(max, lengths))

export const offset = (max: Vector, lengths: Vector) => subtract(max)(scale(.5)(lengths))

export const scale = (s: number) => (v: Vector) => vec3.scale(vec3.create(), v, s)

export const subtract = (a: Vector) => (b: Vector) => vec3.subtract(vec3.create(), a, b)

export const add = (a: Vector) => (b: Vector) => vec3.add(vec3.create(), a, b)

export const negate = (v: Vector) => vec3.negate(vec3.create(), v)

export const rotate = (v: Vector) => (q: number[] | Float32Array) => vec3.transformQuat(vec3.create(), v, q)

export default Vector;
