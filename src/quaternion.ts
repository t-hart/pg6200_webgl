import { quat } from 'gl-matrix-ts'

type Quaternion = number[] | Float32Array

export const conjugate = (q: Quaternion) => quat.conjugate(quat.create(), q)

export const multiply = (a: Quaternion) => (b: Quaternion) => quat.multiply(quat.create(), a, b)

export const fromAxisAngle = (axis: number[] | Float32Array) => (rad: number) => quat.setAxisAngle(quat.create(), axis, rad)

export default Quaternion
