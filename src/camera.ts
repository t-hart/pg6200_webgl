import { mat4, vec3 } from 'gl-matrix-ts'
import Vector, { negate } from './vector'

const V = .1

const X = [V, 0, 0]
const Y = [0, V, 0]
const Z = [0, 0, V]

const ROTATION = V * 0.1

type Matrix = number[] | Float32Array

type Camera = {
  viewMatrix: Matrix
}

export const create = () => ({
  viewMatrix: mat4.create()
})

const move = (camera: Camera, direction: Vector) => ({
  ...camera,
  viewMatrix: mat4.translate(camera.viewMatrix, camera.viewMatrix, direction)
})

const rotate = (camera: Camera, f: Function, x: number) => ({
  ...camera,
  viewMatrix: f(camera.viewMatrix, camera.viewMatrix, x)
})

// transation
export const moveForward = (camera: Camera) => move(camera, Z)
export const moveBackward = (camera: Camera) => move(camera, negate(Z))

export const moveRight = (camera: Camera) => move(camera, negate(X))
export const moveLeft = (camera: Camera) => move(camera, X)

export const moveUp = (camera: Camera) => move(camera, negate(Y))
export const moveDown = (camera: Camera) => move(camera, Y)

export const setPosition = (camera: Camera, position: Vector) => {
  const translation = vec3.subtract(vec3.create(), position, mat4.getTranslation(camera.viewMatrix, camera.viewMatrix))

  mat4.translate(camera.viewMatrix, camera.viewMatrix, translation)
}

// rotation
const roll = (camera: Camera, x: number) => rotate(camera, mat4.rotateZ, x)
const pitch = (camera: Camera, x: number) => rotate(camera, mat4.rotateX, x)
const yaw = (camera: Camera, x: number) => rotate(camera, mat4.rotateY, x)

export const rollLeft = (camera: Camera) => roll(camera, -ROTATION)
export const rollRight = (camera: Camera) => roll(camera, ROTATION)

export const turnRight = (camera: Camera) => yaw(camera, ROTATION)
export const turnLeft = (camera: Camera) => yaw(camera, -ROTATION)

export const flipBack = (camera: Camera) => pitch(camera, ROTATION)
export const flipForward = (camera: Camera) => pitch(camera, -ROTATION)

// targeting
export const lookAt = (camera: Camera, target: Vector) => {
  const pos = mat4.getTranslation(vec3.create(), camera.viewMatrix)
  mat4.lookAt(camera.viewMatrix, pos, target, Y)
}

// export const perspective = (camera: Camera, fov, aspect, zNear, zFar) => {
//   const projectionMatrix = mat4.clone(camera.viewMatrix)
//   mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar)
//   // mat4.ortho(projectionMatrix, -2, 2, -2, 2, .1, 100)
//   mat4.rotate(projectionMatrix, projectionMatrix, rotation, mat4.getRotation([], opts.camera.viewMatrix))
//   mat4.translate(projectionMatrix, projectionMatrix, mat4.getTranslation([], opts.camera.viewMatrix))
// }

export default Camera;
