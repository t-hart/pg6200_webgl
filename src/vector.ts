import { vec3 } from 'gl-matrix-ts'

export type t = number[] | Float32Array

export const zip = (...xs: any[][]) => xs.reduce((acc, x) => x.length < acc.length ? x : acc).map((_, i) => xs.map(x => x[i]))

export const boundingBox = (a: t, b: t) => {
  // @ts-ignore
  const [xs, ys, zs] = zip(a, b)
  // @ts-ignore
  return xs.flatMap(x => ys.flatMap(y => zs.flatMap(z => [x, y, z])))
}

export const zero = () => vec3.create()

// @ts-ignore
export const dists = (a: t, b: t) => zip(a, b).map(([a, b]) => Math.abs(a - b))

export const centeringTranslation = (max: t, lengths: t) => scale(-1)(offset(max, lengths))

export const offset = (max: t, lengths: t) => subtract(max)(scale(.5)(lengths))

export const scale = (s: number) => (v: t) => vec3.scale(vec3.create(), v, s)

export const subtract = (a: t) => (b: t) => vec3.subtract(vec3.create(), a, b)

export const add = (a: t) => (b: t) => vec3.add(vec3.create(), a, b)

export const negate = (v: t) => vec3.negate(vec3.create(), v)

export const rotate = (v: t) => (q: number[] | Float32Array) => vec3.transformQuat(vec3.create(), v, q)

export default t;
