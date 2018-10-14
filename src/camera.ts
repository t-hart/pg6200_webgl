import Quaternion, * as quat from './quaternion'
import Vector, * as vec from './vector'

const VELOCITY = .5
const ROTATION = VELOCITY * .25

const X = vec.rotate([1, 0, 0])
const Y = vec.rotate([0, 1, 0])
const Z = vec.rotate([0, 0, 1])

type Camera = {
  translation: Vector,
  rotation: Quaternion,
  rotationConjugate: Quaternion
}

export const create = (translation: Vector = [0, 0, -6], rotation: Quaternion = [0, 0, 0, 1]) => ({
  translation,
  rotation,
  rotationConjugate: quat.conjugate(rotation)
})

const translate = (camera: Camera, axis: Function) => ({
  ...camera,
  translation: vec.add(camera.translation)(vec.scale(VELOCITY)(axis(camera.rotation))),
})

const rotate = (axis: Function) => (camera: Camera, rad: number) => {
  const newRotation = quat.multiply(quat.fromAxisAngle(axis(camera.rotation))(rad))(camera.rotation)
  return {
    ...camera,
    rotation: newRotation,
    rotationConjugate: quat.conjugate(newRotation)
  }
}


// translation
const neg = (f: Function) => (v: Vector) => vec.negate(f(v))
export const moveForward = (camera: Camera) => translate(camera, Z)
export const moveBackward = (camera: Camera) => translate(camera, neg(Z))

export const moveRight = (camera: Camera) => translate(camera, neg(X))
export const moveLeft = (camera: Camera) => translate(camera, X)

export const moveUp = (camera: Camera) => translate(camera, neg(Y))
export const moveDown = (camera: Camera) => translate(camera, Y)

// rotation
const roll = rotate(Z)
const pitch = rotate(X)
const yaw = rotate(Y)

export const rollLeft = (camera: Camera) => roll(camera, ROTATION)
export const rollRight = (camera: Camera) => roll(camera, -ROTATION)

export const turnRight = (camera: Camera) => yaw(camera, -ROTATION)
export const turnLeft = (camera: Camera) => yaw(camera, ROTATION)

export const tiltUp = (camera: Camera) => pitch(camera, ROTATION)
export const tiltDown = (camera: Camera) => pitch(camera, -ROTATION)

export const rotation = (camera: Camera) => camera.rotationConjugate
export const translation = (camera: Camera) => camera.translation

export default Camera;
