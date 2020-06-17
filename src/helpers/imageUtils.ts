import color from 'color'

export const getTransparentImage = (
  img: HTMLImageElement,
  transparentKey: string[],
) => {
  if (!transparentKey.length) return
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width = img.width
  const height = img.height
  if (ctx) {
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height)

    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, width, height)
    const pixelData = imageData.data

    const transparentKeys = new Set(
      transparentKey.map((c) => {
        const cl = new color(c)
        return `${cl.red()},${cl.green()},${cl.blue()}`
      }),
    )

    console.log(transparentKeys)

    for (let i = 0; i < pixelData.length; i += 4) {
      const color = `${pixelData[i]},${pixelData[i + 1]},${pixelData[i + 2]}`
      if (transparentKeys.has(color)) {
        pixelData[i + 3] = 0
      }
    }
    ctx.clearRect(0, 0, width, height)
    ctx.putImageData(imageData, 0, 0)

    const dataURL = canvas.toDataURL('image/png')
    return dataURL
  }
  throw new Error('not support canvas 2dcontext')
}

export const getTransparentImageHash = (arg: {
  src: string
  transparentColor?: string[]
}) => {
  return (
    arg.src +
    (arg.transparentColor?.length ? '::' + arg.transparentColor.join(',') : '')
  )
}
