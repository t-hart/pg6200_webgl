import { mat4, vec3, quat } from 'gl-matrix-ts'
import Vector, { negate, scale, add } from './vector'

type Matrix = number[] | Float32Array
type Quaternion = number[] | Float32Array

const VELOCITY = .5
const ROTATION = VELOCITY * .25

const axisFromMatrix = (x: number, y: number, z: number) => (m: Matrix) => ([m[x], m[y], m[z]])
const XM = axisFromMatrix(0, 4, 8)
const YM = axisFromMatrix(1, 5, 9)
const ZM = axisFromMatrix(2, 6, 10)

const rotateVec = (v: Vector) => (q: Quaternion) => vec3.transformQuat(vec3.create(), v, q)
const X = rotateVec([-1, 0, 0])
const Y = rotateVec([0, -1, 0])
const Z = rotateVec([0, 0, -1])

type Camera = {
  translation: Vector,
  translationM: Vector,
  rotation: Quaternion,
  viewMatrix: Matrix
}

export const create = (pos: Vector = [0, 0, -6], rotation: Quaternion = [0, 0, 0, 1]) => ({
  translation: pos,
  translationM: pos,
  rotation: rotation,
  viewMatrix: mat4.fromTranslation(mat4.create(), pos)
})

const translate = (camera: Camera, axis: Function, axisM: Function) => ({
  ...camera,
  translation: add(camera.translation)(scale(VELOCITY)(axis(camera.rotation))),
  translationM: add(camera.translationM)(scale(VELOCITY)(axisM(camera.viewMatrix))),
  viewMatrix: mat4.translate(mat4.create(), camera.viewMatrix, scale(VELOCITY)(axisM(camera.viewMatrix)))
})

const rotate = (axis: Function, axisM: Function) => (camera: Camera, rad: number) => ({
  ...camera,
  rotation: quat.multiply(quat.create(), quat.setAxisAngle(quat.create(), axis(camera.rotation), rad), camera.rotation),
  viewMatrix: mat4.rotate(mat4.create(), camera.viewMatrix, rad, axisM(camera.viewMatrix))
})


// translation
const neg = (f: Function) => (v: Vector) => negate(f(v))
export const moveForward = (camera: Camera) => translate(camera, neg(Z), ZM)
export const moveBackward = (camera: Camera) => translate(camera, Z, neg(ZM))

export const moveRight = (camera: Camera) => translate(camera, X, neg(XM))
export const moveLeft = (camera: Camera) => translate(camera, neg(X), XM)

export const moveUp = (camera: Camera) => translate(camera, Y, neg(YM))
export const moveDown = (camera: Camera) => translate(camera, neg(Y), YM)

// rotation
const roll = rotate(Z, ZM)
const pitch = rotate(X, XM)
const yaw = rotate(Y, YM)

export const rollLeft = (camera: Camera) => roll(camera, -ROTATION)
export const rollRight = (camera: Camera) => roll(camera, ROTATION)

export const turnRight = (camera: Camera) => yaw(camera, ROTATION)
export const turnLeft = (camera: Camera) => yaw(camera, -ROTATION)

export const tiltUp = (camera: Camera) => pitch(camera, -ROTATION)
export const tiltDown = (camera: Camera) => pitch(camera, ROTATION)

// export const rotation = (camera: Camera) => camera.rotation
// export const translationM = (camera: Camera) => camera.translationM
export const rotation = (camera: Camera) => mat4.getRotation(quat.create(), camera.viewMatrix)
export const translation = (camera: Camera) => camera.translation

export default Camera;
