export const setupVideo = async (url) => {
  const video = document.createElement('video')
  video.autoplay = true
  video.muted = true
  video.loop = true
  video.src = url
  await video.play()
  return video
}
