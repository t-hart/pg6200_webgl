import { mat4, vec3, quat } from 'gl-matrix-ts'
import Vector, { negate, scale, add } from './vector'

type Matrix = number[] | Float32Array
type Quaternion = number[] | Float32Array

const VELOCITY = .5
const ROTATION = VELOCITY * .25

const axis = (m: Matrix, x: number, y: number, z: number) => ([m[x], m[y], m[z]])
const X = (m: Matrix) => axis(m, 0, 4, 8)
const Y = (m: Matrix) => axis(m, 1, 5, 9)
const Z = (m: Matrix) => axis(m, 2, 6, 10)

const axis_ = (q: Quaternion, v: Vector) => vec3.transformQuat(vec3.create(), v, q)
const X_ = (c: Camera) => axis_(c.rotation, [1, 0, 0])
const Y_ = (c: Camera) => axis_(c.rotation, [0, 1, 0])
const Z_ = (c: Camera) => axis_(c.rotation, [0, 0, 1])


type Camera = {
  translation: Vector,
  rotation: Quaternion,
  viewMatrix: Matrix
}

export const create = (pos: Vector = [0, 0, -6], rotation: Quaternion = [0, 0, 0, 1]) => ({
  translation: pos,
  rotation: rotation,
  viewMatrix: mat4.fromTranslation(mat4.create(), pos)
})

const translate = (camera: Camera, direction: Function) => ({
  ...camera,
  translation: add(camera.translation)(scale(VELOCITY)(direction(camera.viewMatrix))),
  viewMatrix: mat4.translate(mat4.create(), camera.viewMatrix, scale(VELOCITY)(direction(camera.viewMatrix)))
})

const rotate = (axis: Function, quatR: Function) => (camera: Camera, rad: number) => ({
  ...camera,
  // rotation: quat.multiply(quat.create(), camera.rotation, quatR(rad)),
  viewMatrix: mat4.rotate(mat4.create(), camera.viewMatrix, rad, axis(camera.viewMatrix))
})


// translation
export const moveForward = (camera: Camera) => translate(camera, Z)
export const moveBackward = (camera: Camera) => translate(camera, m => negate(Z(m)))

export const moveRight = (camera: Camera) => translate(camera, m => negate(X(m)))
export const moveLeft = (camera: Camera) => translate(camera, X)

export const moveUp = (camera: Camera) => translate(camera, m => negate(Y(m)))
export const moveDown = (camera: Camera) => translate(camera, Y)

// rotation
const roll = rotate(Z, Z_)
const pitch = rotate(X, X_)
const yaw = rotate(Y, Y_)

export const rollLeft = (camera: Camera) => roll(camera, -ROTATION)
export const rollRight = (camera: Camera) => roll(camera, ROTATION)

export const turnRight = (camera: Camera) => yaw(camera, ROTATION)
export const turnLeft = (camera: Camera) => yaw(camera, -ROTATION)

export const tiltUp = (camera: Camera) => pitch(camera, -ROTATION)
export const tiltDown = (camera: Camera) => pitch(camera, ROTATION)

// export const rotation = (camera: Camera) => camera.rotation
// export const translation = (camera: Camera) => camera.translation
export const rotation = (camera: Camera) => mat4.getRotation(quat.create(), camera.viewMatrix)
export const translation = (camera: Camera) => camera.translation

export default Camera;
