import { mat4, vec3, quat } from 'gl-matrix-ts'
import Vector, { negate, scale } from './vector'

type Matrix = number[] | Float32Array

const VELOCITY = .3
const ROTATION = VELOCITY * .5

const axis = (m: Matrix, x: number, y: number, z: number) => ([m[x], m[y], m[z]])
const X = (m: Matrix) => axis(m, 0, 4, 8)
const Y = (m: Matrix) => axis(m, 1, 5, 9)
const Z = (m: Matrix) => axis(m, 2, 6, 10)

type Camera = {
  viewMatrix: Matrix
}

export const create = (pos: Vector = [0, 0, -6]) => ({
  viewMatrix: mat4.fromTranslation(mat4.create(), pos)
})

const operate = (camera: Camera, axis: Vector, f: Function) => ({
  ...camera,
  viewMatrix: f(mat4.create(), camera.viewMatrix, axis)
})

const translate = (camera: Camera, direction: Function) =>
  operate(camera, scale(VELOCITY)(direction(camera.viewMatrix)), mat4.translate)

const rotate = (axis: Function) => (camera: Camera, rad: number) => {
  // const viewMatrix = mat4.clone(camera.viewMatrix)
  // const up = Y(camera.viewMatrix)
  // const forward = Z(camera.viewMatrix)
  const q = quat.setAxisAngle(quat.create(), axis(camera.viewMatrix), rad)
  const currentRot = mat4.getRotation(quat.create(), camera.viewMatrix)
  const viewMatrix = mat4.fromRotationTranslation(mat4.create(), quat.mul(quat.create(), currentRot, q), mat4.getTranslation(vec3.create(), camera.viewMatrix))
  // const viewMatrix = mat4.targetTo(mat4.create(), camera.viewMatrix)
  // const translation = mat4.getTranslation(vec3.create(), viewMatrix)
  // mat4.translate(viewMatrix, viewMatrix, translation)
  // const newViewMatrix = mat4.fromTranslation(mat4.create(), [0, 0, 0])

  // const originT = mat4.getTranslation(vec3.create(), viewMatrix)

  // mat4.rotate(viewMatrix, viewMatrix, rad, axis(viewMatrix))

  // const rotatedOrigin = mat4.getTranslation(vec3.create(), viewMatrix)

  // mat4.translate(viewMatrix, viewMatrix, negate(translation))

  // const reTrans = mat4.getTranslation(vec3.create(), viewMatrix)
  // const equals = (v: Vector, u: Vector) => v.every((_, i) => Math.abs(v[i] - u[i]) < 0.0001)

  // console.assert(equals(translation, reTrans), "Could not translate back correctly:", translation, reTrans)
  // console.assert(equals(originT, rotatedOrigin), "Position moved after rotating")

  return ({
    ...camera,
    viewMatrix: viewMatrix
  })
}

// translation
export const moveForward = (camera: Camera) => translate(camera, Z)
export const moveBackward = (camera: Camera) => translate(camera, m => negate(Z(m)))

export const moveRight = (camera: Camera) => translate(camera, m => negate(X(m)))
export const moveLeft = (camera: Camera) => translate(camera, X)

export const moveUp = (camera: Camera) => translate(camera, m => negate(Y(m)))
export const moveDown = (camera: Camera) => translate(camera, Y)

// rotation
const roll = rotate(Z)
const pitch = rotate(X)
const yaw = rotate(Y)

export const rollLeft = (camera: Camera) => roll(camera, -ROTATION)
export const rollRight = (camera: Camera) => roll(camera, ROTATION)

export const turnRight = (camera: Camera) => yaw(camera, ROTATION)
export const turnLeft = (camera: Camera) => yaw(camera, -ROTATION)

export const tiltUp = (camera: Camera) => pitch(camera, ROTATION)
export const tiltDown = (camera: Camera) => pitch(camera, -ROTATION)

export default Camera;
