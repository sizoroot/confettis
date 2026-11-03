// Pixel ratio used on each canvas, to get the size in CSS pixels
const pixelRatios = new WeakMap<HTMLCanvasElement, number>()

/**
 * Gets the device pixel ratio of the screen, capped at 2 to keep rendering performance acceptable
 * on high density displays.
 *
 * @returns {number} The pixel ratio, a value between 1 and 2
 */
const getPixelRatio = (): number => Math.min(window.devicePixelRatio || 1, 2)

/**
 * Sets the size of a canvas in CSS pixels. The internal resolution of the canvas is scaled by the
 * current pixel ratio, which is stored so the CSS size can be recovered later.
 *
 * @param {HTMLCanvasElement} canvas - Canvas element to resize
 * @param {number} width - New width in CSS pixels
 * @param {number} height - New height in CSS pixels
 * @returns {void}
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
 * Gets the size of a canvas in CSS pixels, regardless of its internal resolution.
 *
 * @param {HTMLCanvasElement} canvas - Canvas element to measure
 * @returns {{ width: number, height: number, ratio: number }} Width and height in CSS pixels, and the pixel ratio applied to the canvas (1 if it was never sized by this library)
 */
const getCanvasSize = (canvas: HTMLCanvasElement): { width: number, height: number, ratio: number } => {
    const ratio = pixelRatios.get(canvas) ?? 1
    return { width: canvas.width / ratio, height: canvas.height / ratio, ratio: ratio }
}

/**
 * Creates a fixed, full window canvas that ignores pointer events and appends it to the document body.
 *
 * @param {string} [id="confettis"] - Id assigned to the new canvas element
 * @returns {HTMLCanvasElement} The newly created canvas element
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
 * Sets the CSS z-index of an existing canvas. It does nothing if the canvas does not exist.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @param {number} [z=Number.MAX_SAFE_INTEGER] - Z-index value to apply
 * @returns {void}
 */
const setCanvasZIndex = (id: string = "confettis", z: number = Number.MAX_SAFE_INTEGER): void => {
    const canvas = document.getElementById(id)
    if(canvas) canvas.style.zIndex = `${z}`
}

/**
 * Gets the canvas with the given id, creating it if it does not exist yet.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {HTMLCanvasElement} The existing or newly created canvas element
 */
const getCanvas = (id: string = "confettis"): HTMLCanvasElement => {
    let canvas = document.getElementById(id) as unknown as HTMLCanvasElement
    if(!canvas) canvas = createCanvas(id)
    return canvas
}

/**
 * Sets a custom size for a canvas, creating the canvas if it does not exist yet.
 *
 * @param {number} width - New width in CSS pixels
 * @param {number} height - New height in CSS pixels
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {void}
 */
const setCanvasSize = (width: number, height: number, id: string = "confettis"): void => {
    setCanvasPixelSize(getCanvas(id), width, height)
}

/**
 * Resizes a canvas to match the visible area of the window, creating the canvas if it does not exist yet.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {void}
 */
const setCanvasWindowSize = (id: string = "confettis"): void => {
    setCanvasPixelSize(getCanvas(id), document.documentElement.clientWidth, document.documentElement.clientHeight)
}

/**
 * Resizes a canvas to the size of its bounding client rect, creating the canvas if it does not exist yet.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {void}
 */
const setCanvasRectSize = (id: string = "confettis"): void => {
    const canvas = getCanvas(id)
    const rect = canvas.getBoundingClientRect()
    setCanvasPixelSize(canvas, rect.width, rect.height)
}

/**
 * Gets the 2D context of a canvas ready to draw in CSS pixels. The pixel ratio transform is applied
 * and the previous content of the canvas is cleared.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {CanvasRenderingContext2D} The cleared 2D rendering context
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
 * Clears all the content of a canvas. It does nothing if the canvas or its context do not exist.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {void}
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
 * Converts a relative position (0 to 1) into a position in CSS pixels inside a canvas.
 * The result is clamped to the canvas bounds, and the canvas is created if it does not exist yet.
 *
 * @param {Object} [data] - Position data
 * @param {string} [data.id="confettis"] - Id of the canvas element
 * @param {number} [data.x=0.5] - Relative horizontal position, 0 is the left edge and 1 the right edge
 * @param {number} [data.y=0.5] - Relative vertical position, 0 is the upper edge and 1 the lower edge
 * @returns {{ x: number, y: number }} Position in CSS pixels
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
