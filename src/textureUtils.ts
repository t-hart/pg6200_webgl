// export const initTexture = (gl: WebGLRenderingContext) => {
//   const texture = gl.createTexture()
//   gl.bindTexture(gl.TEXTURE_2D, texture)

//   const level = 0
//   const internalFormat = gl.RGBA
//   const width = 1
//   const height = 1
//   const border = 0
//   const srcFormat = gl.RGBA
//   const srcType = gl.UNSIGNED_BYTE
//   const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
//   gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)

//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

//   return texture
// }

export const initTexture2D = (gl: WebGLRenderingContext) => (imageUrl: string) => {
  console.log('init texture')
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  const image = new Image()

  const level = 0
  const internalFormat = gl.RGBA
  const width = 1
  const height = 1
  const border = 0
  const srcFormat = gl.RGBA
  const srcType = gl.UNSIGNED_BYTE
  const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)

  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

    const isPowerOf2 = (num: number) => (num & (num - 1)) === 0

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }
  image.src = imageUrl

  return texture
}

// export const updateTexture = (gl: WebGLRenderingContext, texture: WebGLTexture, video: ImageBitmap | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => {
//   const level = 0
//   const internalFormat = gl.RGBA
//   const srcFormat = gl.RGBA
//   const srcType = gl.UNSIGNED_BYTE
//   gl.bindTexture(gl.TEXTURE_2D, texture)
//   gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, video)
// }
