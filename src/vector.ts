type Vector = number[]

export const zip = (...xs: any[][]) => xs.reduce((acc, x) => x.length < acc.length ? x : acc).map((_, i) => xs.map(x => x[i]))

export const boundingBox = (a: Vector, b: Vector) => {
  const [xs, ys, zs] = zip(a, b)
  return xs.flatMap(x => ys.flatMap(y => zs.flatMap(z => [x, y, z])))
}

export const dists = (a: Vector, b: Vector) => zip(a, b).map(([a, b]) => Math.abs(a - b))

export const centeringTranslation = (max: Vector, lengths: Vector) => scale(-1)(offset(max, lengths))

export const offset = (max: Vector, lengths: Vector) => subtract(max)(scale(.5)(lengths))

export const scale = (s: number) => (v: Vector) => v.map(x => s * x)

export const subtract = (a: Vector) => (b: Vector) => a.map((x, i) => x - b[i])

export default Vector;
