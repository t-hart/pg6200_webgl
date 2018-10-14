import { mat4, vec3, quat } from 'gl-matrix-ts'
import Vector, { negate, scale, add } from './vector'

type Matrix = number[] | Float32Array
type Quaternion = number[] | Float32Array

const VELOCITY = .5
const ROTATION = VELOCITY * .25

const rotateVec = (v: Vector) => (q: Quaternion) => vec3.transformQuat(vec3.create(), v, q)
const X = rotateVec([-1, 0, 0])
const Y = rotateVec([0, -1, 0])
const Z = rotateVec([0, 0, -1])

type Camera = {
  translation: Vector,
  rotation: Quaternion,
  viewMatrix: Matrix
}

export const create = (pos: Vector = [0, 0, -6], rotation: Quaternion = [0, 0, 0, 1]) => ({
  translation: pos,
  rotation: rotation,
})

const translate = (camera: Camera, axis: Function) => ({
  ...camera,
  translation: add(camera.translation)(scale(VELOCITY)(axis(camera.rotation))),
})

const rotate = (axis: Function) => (camera: Camera, rad: number) => ({
  ...camera,
  rotation: quat.multiply(quat.create(), quat.setAxisAngle(quat.create(), axis(camera.rotation), rad), camera.rotation),
})


// translation
const neg = (f: Function) => (v: Vector) => negate(f(v))
export const moveForward = (camera: Camera) => translate(camera, neg(Z))
export const moveBackward = (camera: Camera) => translate(camera, Z)

export const moveRight = (camera: Camera) => translate(camera, X)
export const moveLeft = (camera: Camera) => translate(camera, neg(X))

export const moveUp = (camera: Camera) => translate(camera, Y)
export const moveDown = (camera: Camera) => translate(camera, neg(Y))

// rotation
const roll = rotate(Z)
const pitch = rotate(X)
const yaw = rotate(Y)

export const rollLeft = (camera: Camera) => roll(camera, -ROTATION)
export const rollRight = (camera: Camera) => roll(camera, ROTATION)

export const turnRight = (camera: Camera) => yaw(camera, ROTATION)
export const turnLeft = (camera: Camera) => yaw(camera, -ROTATION)

export const tiltUp = (camera: Camera) => pitch(camera, -ROTATION)
export const tiltDown = (camera: Camera) => pitch(camera, ROTATION)

// export const rotation = (camera: Camera) => camera.rotation
// export const rotation = (camera: Camera) => mat4.getRotation(quat.create(), camera.viewMatrix)
export const rotation = (camera: Camera) => {
  // const matRotation = mat4.getRotation(quat.create(), camera.viewMatrix)
  const con = quat.conjugate(quat.create(), camera.rotation)
  // console.assert(quat.equals(con, matRotation), 'Rotations do not match', con, matRotation)
  return con
}
export const translation = (camera: Camera) => camera.translation

export default Camera;
