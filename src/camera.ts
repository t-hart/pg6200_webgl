import { cameraShaderProgram } from './shaders'
import Quaternion, * as quat from './quaternion'
import Vector, * as vec from './vector'

const VELOCITY = 5
const ROTATION = VELOCITY * .5

const X = vec.rotate([1, 0, 0])
const Y = vec.rotate([0, 1, 0])
const Z = vec.rotate([0, 0, 1])

interface Camera {
  translation: Vector,
  rotation: Quaternion,
  rotationConjugate: Quaternion,
  shaderProgram: WebGLProgram
}

export const create = (gl: WebGLRenderingContext, translation: Vector = [0, 0, -6], rotation: Quaternion = [0, 0, 0, 1]) => ({
  translation,
  rotation,
  rotationConjugate: quat.conjugate(rotation),
  shaderProgram: cameraShaderProgram(gl)
})

const translate = (camera: Camera, axis: Function, delta: number) => ({
  ...camera,
  translation: vec.add(camera.translation)(vec.scale(VELOCITY * delta)(axis(camera.rotation))),
})

const rotate = (axis: Function) => (camera: Camera, rad: number, delta: number) => {
  const newRotation = quat.multiply(quat.fromAxisAngle(axis(camera.rotation))(rad * delta))(camera.rotation)
  return {
    ...camera,
    rotation: newRotation,
    rotationConjugate: quat.conjugate(newRotation)
  }
}


// translation
const neg = (f: Function) => (v: Vector) => vec.negate(f(v))
export const moveForward = (camera: Camera, delta: number) => translate(camera, Z, delta)
export const moveBackward = (camera: Camera, delta: number) => translate(camera, neg(Z), delta)

export const moveRight = (camera: Camera, delta: number) => translate(camera, neg(X), delta)
export const moveLeft = (camera: Camera, delta: number) => translate(camera, X, delta)

export const moveUp = (camera: Camera, delta: number) => translate(camera, neg(Y), delta)
export const moveDown = (camera: Camera, delta: number) => translate(camera, Y, delta)

// rotation
const roll = rotate(Z)
const pitch = rotate(X)
const yaw = rotate(Y)

export const rollLeft = (camera: Camera, delta: number) => roll(camera, ROTATION, delta)
export const rollRight = (camera: Camera, delta: number) => roll(camera, -ROTATION, delta)

export const turnRight = (camera: Camera, delta: number) => yaw(camera, -ROTATION, delta)
export const turnLeft = (camera: Camera, delta: number) => yaw(camera, ROTATION, delta)

export const tiltUp = (camera: Camera, delta: number) => pitch(camera, ROTATION, delta)
export const tiltDown = (camera: Camera, delta: number) => pitch(camera, -ROTATION, delta)

export const rotation = (camera: Camera) => camera.rotationConjugate
export const translation = (camera: Camera) => camera.translation

export default Camera;
