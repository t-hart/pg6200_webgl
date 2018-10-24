import DrawArgs from './drawArgs'
import Vector from './vector'

interface ModelOptions {
  scale: number,
  orientation: Vector,
  color?: Vector,
  position: Vector,
  drawArgs: DrawArgs
}

export default ModelOptions
