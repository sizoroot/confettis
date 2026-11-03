// Pixel ratio used on each canvas, to get the size in CSS pixels
const pixelRatios = new WeakMap<HTMLCanvasElement, number>()

/**
 * Get the pixel ratio of the screen, limited to 2 to keep the performance
 *
 * @return {number} number
 */
const getPixelRatio = (): number => Math.min(window.devicePixelRatio || 1, 2)

/**
 * Set canvas size in CSS pixels, the canvas resolution uses the pixel ratio of the screen
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} width `number`
 * @param {number} height `number`
 * @return {void} void
 */
const setCanvasPixelSize = (canvas: HTMLCanvasElement, width: number, height: number): void => {

    const ratio = getPixelRatio()

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)

    pixelRatios.set(canvas, ratio)

}

/**
 * Get canvas size in CSS pixels
 *
 * @param {HTMLCanvasElement} canvas
 * @return {{ width: number, height: number, ratio: number }} size
 */
const getCanvasSize = (canvas: HTMLCanvasElement): { width: number, height: number, ratio: number } => {
    const ratio = pixelRatios.get(canvas) ?? 1
    return { width: canvas.width / ratio, height: canvas.height / ratio, ratio: ratio }
}

/**
 * Create new canvas element
 *
 * @return {HTMLCanvasElement} HTMLCanvasElement
 */
const createCanvas = (id: string = "confettis"): HTMLCanvasElement => {

    const canvas = document.createElement("canvas")

    setCanvasPixelSize(canvas, document.documentElement.clientWidth, document.documentElement.clientHeight)

    canvas.id = id

    canvas.style.zIndex = `${Number.MAX_SAFE_INTEGER}`
    canvas.style.position = 'fixed'
    canvas.style.top = '0px'
    canvas.style.left = '0px'
    canvas.style.pointerEvents = 'none'

    document.body.appendChild(canvas)

    return canvas

}

/**
 * Set canvas z-index
 *
 * @param {string} id `string` Default "confettis"
 * @param {string} z `string` Default Number.MAX_SAFE_INTEGER (2147483647)
 * @return {HTMLCanvasElement}  HTMLCanvasElement
 */
const setCanvasZIndex = (id: string = "confettis", z: number = Number.MAX_SAFE_INTEGER): void => {
    const canvas = document.getElementById(id)
    if(canvas) canvas.style.zIndex = `${z}`
}

/**
 * Get canvas confetti
 *
 * @param {string} id `string` Default "confettis"
 * @return {HTMLCanvasElement}  HTMLCanvasElement
 */
const getCanvas = (id: string = "confettis"): HTMLCanvasElement => {
    let canvas = document.getElementById(id) as unknown as HTMLCanvasElement
    if(!canvas) canvas = createCanvas(id)
    return canvas
}

/**
 * Set canvas custom size
 *
 * @param {number} width `number`
 * @param {number} height `number`
 * @return {void} void
 */
const setCanvasSize = (width: number, height: number, id: string = "confettis"): void => {
    setCanvasPixelSize(getCanvas(id), width, height)
}

/**
 * Set canvas window size
 *
 * @return {void} void
 */
const setCanvasWindowSize = (id: string = "confettis"): void => {
    setCanvasPixelSize(getCanvas(id), document.documentElement.clientWidth, document.documentElement.clientHeight)
}

/**
 * Set canvas rect size
 *
 * @return {void} void
 */
const setCanvasRectSize = (id: string = "confettis"): void => {
    const canvas = getCanvas(id)
    const rect = canvas.getBoundingClientRect()
    setCanvasPixelSize(canvas, rect.width, rect.height)
}

/**
 * Get the context of the canvas ready to draw in CSS pixels, with the canvas cleared
 *
 * @param {string} id `string` Default "confettis"
 * @return {CanvasRenderingContext2D} CanvasRenderingContext2D
 */
const getCanvasContext = (id: string = "confettis"): CanvasRenderingContext2D => {

    const canvas = getCanvas(id)
    const { width, height, ratio } = getCanvasSize(canvas)
    const context = canvas.getContext("2d") as CanvasRenderingContext2D

    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    return context

}

/**
 * Clear canvas, it does nothing if the canvas does not exist
 *
 * @param {string} id `string` Default "confettis"
 * @return {void} void
 */
const clearCanvas = (id: string = "confettis"): void => {

    const canvas = document.getElementById(id) as HTMLCanvasElement | null
    if(!canvas) return

    const context = canvas.getContext("2d")
    if(!context) return

    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)

}

/**
 * Get canvas positions
 *
 * @return {void} void
 */
const getCanvasPos = (data?: { id?: string, x?: number, y?: number }): { x: number, y: number } => {

    const id = data?.id || 'confettis'
    const x = data?.x ?? 0.5
    const y = data?.y ?? 0.5

    const canvas = getCanvas(id)

    const { width: canvasWidth, height: canvasHeight } = getCanvasSize(canvas)

    const canvasX = Math.max(0, Math.min(x * canvasWidth, canvasWidth))
    const canvasY = Math.max(0, Math.min(y * canvasHeight, canvasHeight))

    return {
        x: canvasX,
        y: canvasY
    }

}

export {

    createCanvas,

    getCanvas,
    getCanvasPos,
    getCanvasSize,
    getCanvasContext,
    clearCanvas,

    setCanvasSize,
    setCanvasWindowSize,
    setCanvasRectSize,
    setCanvasZIndex

}
