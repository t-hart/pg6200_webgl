export const getGlContext = (canvasId: string) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#' + canvasId)
  return canvas ? canvas.getContext('webgl') : null
}

export const setViewport = (gl: WebGLRenderingContext, width: number, height: number) => gl.viewport(0, 0, width, height)
