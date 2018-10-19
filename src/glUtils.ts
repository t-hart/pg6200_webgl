import { range, objectFromValues } from './utils'

export const getGlContext = (canvasId: string) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#' + canvasId)
  return canvas ? canvas.getContext('webgl') : null
}

export const setViewport = (gl: WebGLRenderingContext, width: number, height: number) => gl.viewport(0, 0, width, height)

interface B {
  numComponents: number,
  normalize?: boolean,
  stride?: number,
  offset?: number,
  name: string,
  buffer: WebGLBuffer,
  type?: number,
  size: number
}

export const attribSetters = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const createAttribSetter = (index: number) => (b: B) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer)
    gl.enableVertexAttribArray(index)
    gl.vertexAttribPointer(
      index,
      b.numComponents || b.size,
      b.type || gl.FLOAT,
      b.normalize || false,
      b.stride || 0,
      b.offset || 0
    )
  }

  const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  const keyVals = range(numAttribs)
    .map(i => gl.getActiveAttrib(program, i))
    .filter(x => x)
    .map(x => [x.name, createAttribSetter(gl.getAttribLocation(program, x.name))])

  return objectFromValues(keyVals)
}

// function createAttributeSetters(gl, program) {
//   var attribSetters = {
//   };

//   function createAttribSetter(index) {
//     return function(b) {
//       gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
//       gl.enableVertexAttribArray(index);
//       gl.vertexAttribPointer(
//         index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
//     };
//   }

//   var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
//   for (var ii = 0; ii < numAttribs; ++ii) {
//     var attribInfo = gl.getActiveAttrib(program, ii);
//     if (!attribInfo) {
//       break;
//     }
//     var index = gl.getAttribLocation(program, attribInfo.name);
//     attribSetters[attribInfo.name] = createAttribSetter(index);
//   }

//   return attribSetters;
// }
