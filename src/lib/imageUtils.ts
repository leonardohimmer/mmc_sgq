export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the rotated box size of an image
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the react-easy-crop webpage
 */
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<string> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return ''
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // Create a temporary canvas to hold the original cropped image data
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = pixelCrop.width
    tempCanvas.height = pixelCrop.height
    const tempCtx = tempCanvas.getContext('2d')
    if (tempCtx) {
        tempCtx.putImageData(data, 0, 0)
    }

    // Determine final dimensions (limit max width/height to 1000px to optimize size)
    const maxDimension = 1000
    let finalWidth = pixelCrop.width
    let finalHeight = pixelCrop.height

    if (finalWidth > maxDimension || finalHeight > maxDimension) {
        if (finalWidth > finalHeight) {
            finalHeight = Math.round((finalHeight * maxDimension) / finalWidth)
            finalWidth = maxDimension
        } else {
            finalWidth = Math.round((finalWidth * maxDimension) / finalHeight)
            finalHeight = maxDimension
        }
    }

    // Set main canvas size to the optimized size
    canvas.width = finalWidth
    canvas.height = finalHeight

    // Clear and draw from tempCanvas (this performs the resize smoothly)
    ctx.clearRect(0, 0, finalWidth, finalHeight)
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, finalWidth, finalHeight)

    // As Base64 string in JPEG format with 80% quality (great compression & quality)
    return canvas.toDataURL('image/jpeg', 0.8)
}
