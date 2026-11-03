import { getCanvas, getCanvasSize, getCanvasContext, clearCanvas, setCanvasZIndex, setCanvasWindowSize } from './canvas'
import { randomNumber, convertHexToRGB, isSSR, convertPosition, convertProps } from './utils'
import { ConfettiProperties, ConfettiBatch, ConfettiGlobals, ConfettiProps, RGB } from './types'

import emojiShape from './shapes/emoji'
import ellipseShape from './shapes/ellipse'
import squareShape from './shapes/square'
import starShape from './shapes/star'
import circleShape from './shapes/circle'
import rectangleShape from './shapes/rectangle'
import triangleShape from './shapes/triangle'

const fettis: ConfettiProperties[] = []

let confettiGlobals: ConfettiGlobals = {

    x: 0.5,
    y: 0.7,
    z: Number.MAX_SAFE_INTEGER,

    canvas: 'confettis',

    count: 100,

    gravity: 1,
    ticks: 300,
    speed: 45,
    scale: 0.8,

    overflow: {
        left: false,
        right: false,
        top: true,
        bottom: false,
    },

    decay: 0.92,
    drift: 0,
    angle: 90,
    spread: 70,
    quiet: false,
    disableForReducedMotion: false,
    shapes: [ 'square', 'ellipse' ],
    colors: [ '#33ffdd', '#29c6ff', '#b980ff', '#ff66ff', '#ff6685', '#ffb54d', '#fcff66', '#91ff66' ],
    emojis: [ '🛸', '👽', '✨' ]

}

const canvases = new Set<string>()

let confettiInitialized: boolean = false
let animationFrame: number | null = null
let lastFrameTime: number | null = null

const FRAME_TIME = 1000 / 60
const MAX_STEP = 3

const shapeRenderers: { [shape: string]: (context: CanvasRenderingContext2D, fetti: ConfettiProperties) => void } = {
    square: squareShape,
    ellipse: ellipseShape,
    rectangle: rectangleShape,
    circle: circleShape,
    star: starShape,
    emoji: emojiShape,
    triangle: triangleShape
}

/**
 * Resizes every canvas in use to the current window size. It is registered as the window `resize` listener.
 *
 * @returns {void}
 */
const resizeConfetti = () => { canvases.forEach((id) => setCanvasWindowSize(id)) }

/**
 * Starts the render loop and the window `resize` listener the first time confetti is created.
 * It does nothing on the server or if it was already started.
 *
 * @returns {void}
 */
const initConfetti = () => {
    if (isSSR) return
    if (confettiInitialized) return
    window.addEventListener('resize', resizeConfetti)
    animationFrame = window.requestAnimationFrame(renderConfetti)
    confettiInitialized = true
}

/**
 * Creates a burst of confetti. The props override the global defaults, and the canvas is created
 * if it does not exist yet. It does nothing on the server, or when `disableForReducedMotion` is
 * enabled and the user prefers reduced motion.
 *
 * @param {ConfettiProps} [props] - Options of this burst (count, position, colors, shapes, physics...)
 * @returns {Promise<void>} Resolved when all the confettis of this call are gone or stopped
 */
const createConfetti = (props?: ConfettiProps): Promise<void> => {

    if (isSSR) return Promise.resolve()

    const options = { ...confettiGlobals, ...props } as ConfettiGlobals

    if(options.disableForReducedMotion && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return Promise.resolve()

    return new Promise<void>((resolve) => {

        const batch: ConfettiBatch = { remaining: options.count, resolve: resolve }

        if(!canvases.has(options.canvas)) setCanvasWindowSize(options.canvas)
        canvases.add(options.canvas)

        if(options.z < Number.MAX_SAFE_INTEGER) setCanvasZIndex(options.canvas, options.z)

        const position = convertPosition(options, confettiGlobals)
        const colors = convertProps(options, confettiGlobals).colors.map((color: string) => convertHexToRGB(color) as unknown as RGB)

        for (let i = 0; i < options.count; i++) {
            fettis.push(confettiProperties(options, batch, position, colors))
        }

        if(batch.remaining <= 0) resolve()

        initConfetti()

    })

}

/**
 * Builds the initial state of a single confetti piece, resolving its random properties
 * (color, shape, emoji, launch direction, speed...).
 *
 * @param {ConfettiGlobals} options - Merged global defaults and props of the burst
 * @param {ConfettiBatch} batch - Batch of the burst the piece belongs to
 * @param {{ x: number, y: number }} position - Launch position in CSS pixels
 * @param {RGB[]} colors - Available colors, one of them is picked randomly
 * @returns {ConfettiProperties} The initial properties of the confetti piece
 */
const confettiProperties = (options: ConfettiGlobals, batch: ConfettiBatch, position: { x: number, y: number }, colors: RGB[]): ConfettiProperties => {

    const props = convertProps(options, confettiGlobals)

    const color = colors[Math.floor(randomNumber(0, colors.length))]
    const radius = {
        angle: props.angle * (Math.PI / 180),
        spread: props.spread * (Math.PI / 180)
    }

    return {

        canvas: options.canvas,
        batch: batch,

        random: Math.random() + 2,
        angle2d: -radius.angle + ((0.5 * radius.spread) - (Math.random() * radius.spread)),
        opacity: props.ticks >= 0,
        progress: props.ticks,
        lifetime: props.ticks,

        wobble: {
            w: Math.random() * 10,
            x: 0,
            y: 0,
            speed: Math.min(0.11, Math.random() * 0.1 + 0.05)
        },

        tilt: {
            angle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
            sin: 0,
            cos: 0
        },

        shape: props.shapes[Math.floor(randomNumber(0, props.shapes.length))],
        emoji: props.emojis[Math.floor(randomNumber(0, props.emojis.length))],

        tick: 0,
        gravity: props.gravity * 3,
        speed: (props.speed * 0.5) + (Math.random() * props.speed),
        drift: props.drift,
        decay: props.decay,
        scale: props.scale,
        quiet: props.quiet,

        overflow: props.overflow,

        color: {
            r: color.r,
            g: color.g,
            b: color.b
        },

        position: {
            x: position.x,
            y: position.y
        }

    }

}

/**
 * Advances the physics of a confetti piece (movement, speed decay, tilt and wobble) and
 * updates its progress. In `quiet` mode the tilt and wobble animation is disabled.
 *
 * @param {ConfettiProperties} fetti - Confetti piece to update, it is modified in place
 * @param {number} step - Elapsed time measured in frames of 60 per second since the last update
 * @returns {void}
 */
const updateConfetti = (fetti: ConfettiProperties, step: number): void => {

    fetti.position.x += (Math.cos(fetti.angle2d) * fetti.speed + fetti.drift) * step
    fetti.position.y += (Math.sin(fetti.angle2d) * fetti.speed + fetti.gravity) * step
    fetti.speed *= Math.pow(fetti.decay, step)

    if(fetti.quiet) {

        fetti.tilt.sin = 0
        fetti.tilt.cos = 0
        fetti.random = 1

        fetti.wobble.w = 0
        fetti.wobble.x = fetti.position.x + (10 * fetti.scale)
        fetti.wobble.y = fetti.position.y + (10 * fetti.scale)

    } else {

        fetti.tilt.angle += 0.1 * step
        fetti.tilt.sin = Math.sin(fetti.tilt.angle)
        fetti.tilt.cos = Math.cos(fetti.tilt.angle)

        fetti.random = Math.random() + 2
        fetti.wobble.w += fetti.wobble.speed * step
        fetti.wobble.x = fetti.position.x + ((10 * fetti.scale) * Math.cos(fetti.wobble.w))
        fetti.wobble.y = fetti.position.y + ((10 * fetti.scale) * Math.sin(fetti.wobble.w))

    }

    fetti.progress = fetti.tick / fetti.lifetime
    fetti.tick += step

}

/**
 * Draws a confetti piece on the canvas, using its color (fading out over its lifetime when it has
 * opacity) and the renderer of its shape.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on
 * @param {ConfettiProperties} fetti - Confetti piece to draw
 * @returns {void}
 */
const createConfettiShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    fetti.opacity ?
    (context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - fetti.progress) + ')') :
    (context.fillStyle = 'rgb(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ')')

    shapeRenderers[fetti.shape]?.(context, fetti)

}

/**
 * Marks a confetti piece as finished in its batch, resolving the promise of the call
 * when it was the last one.
 *
 * @param {ConfettiProperties} fetti - Confetti piece that is gone or stopped
 * @returns {void}
 */
const releaseConfetti = (fetti: ConfettiProperties): void => {
    if(--fetti.batch.remaining <= 0) fetti.batch.resolve()
}

/**
 * Render loop callback. It updates every confetti piece, removes the ones that are out of bounds
 * or finished, clears unused canvases, draws the remaining ones and schedules the next frame.
 * The loop is stopped when there is no confetti left.
 *
 * @param {number} time - Timestamp of the frame, provided by `requestAnimationFrame`
 * @returns {void}
 */
const renderConfetti = (time: number): void => {

    const step = lastFrameTime === null ? 1 : Math.min((time - lastFrameTime) / FRAME_TIME, MAX_STEP)
    lastFrameTime = time

    fettis.forEach((fetti) => updateConfetti(fetti, step))

    const sizes = new Map<string, { width: number, height: number }>()
    canvases.forEach((id) => sizes.set(id, getCanvasSize(getCanvas(id))))

    for (let index = fettis.length - 1; index >= 0; index--) {

        const fetti = fettis[index]
        const size = sizes.get(fetti.canvas) as { width: number, height: number }

        const gone = (!fetti.overflow?.left && fetti.position.x < 0) ||
                     (!fetti.overflow?.right && fetti.position.x > size.width) ||
                     (!fetti.overflow?.top && fetti.position.y < 0) ||
                     (!fetti.overflow?.bottom && fetti.position.y > size.height) ||
                     fetti.progress >= 1

        if(gone) {
            fettis.splice(index, 1)
            releaseConfetti(fetti)
        }

    }

    if(fettis.length === 0) {
        stop()
        return
    }

    const used = new Set(fettis.map((fetti) => fetti.canvas))
    canvases.forEach((id) => {
        if(used.has(id)) return
        clearCanvas(id)
        canvases.delete(id)
    })

    const contexts = new Map<string, CanvasRenderingContext2D>()
    canvases.forEach((id) => contexts.set(id, getCanvasContext(id)))

    fettis.forEach((fetti) => createConfettiShape(contexts.get(fetti.canvas) as CanvasRenderingContext2D, fetti))

    animationFrame = window.requestAnimationFrame(renderConfetti)

}

/**
 * Stops the confetti and clears the canvas. When a canvas is given, only its confettis are stopped
 * and the render loop keeps running while other canvases are still in use. The promises of the
 * stopped confettis are resolved. It does nothing on the server.
 *
 * @param {string} [canvas] - Id of the canvas to stop, by default all of them
 * @returns {void}
 */
const stop = (canvas?: string): void => {

    if(isSSR) return

    if(canvas !== undefined) {

        if(!canvases.has(canvas)) return

        for (let index = fettis.length - 1; index >= 0; index--) {
            if(fettis[index].canvas !== canvas) continue
            releaseConfetti(fettis[index])
            fettis.splice(index, 1)
        }

        clearCanvas(canvas)
        canvases.delete(canvas)

        if(canvases.size > 0) return

    }

    if(animationFrame !== null) window.cancelAnimationFrame(animationFrame)

    window.removeEventListener('resize', resizeConfetti)

    fettis.forEach((fetti) => fetti.batch.resolve())
    fettis.length = 0

    canvases.forEach((id) => clearCanvas(id))
    canvases.clear()

    confettiInitialized = false
    animationFrame = null
    lastFrameTime = null

}

export {
    createConfetti,
    stop
}
