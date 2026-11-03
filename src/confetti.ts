import { getCanvas, getCanvasSize, getCanvasContext, clearCanvas, setCanvasZIndex, setCanvasWindowSize } from './canvas'
import { randomNumber, convertHexToRGB, isSSR, convertPosition, convertProps } from './utils'
import { ConfettiProperties, ConfettiGlobals, ConfettiProps, RGB } from './types'

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

const resizeConfetti = () => { canvases.forEach((id) => setCanvasWindowSize(id)) }

const initConfetti = () => {
    if (isSSR) return
    if (confettiInitialized) return
    window.addEventListener('resize', resizeConfetti)
    animationFrame = window.requestAnimationFrame(renderConfetti)
    confettiInitialized = true
}

/**
 * Create confetti
 *
 * @return {void}
 */
const createConfetti = (props?: ConfettiProps): void => {

    if (isSSR) return

    const options = { ...confettiGlobals, ...props } as ConfettiGlobals

    if(!canvases.has(options.canvas)) setCanvasWindowSize(options.canvas)
    canvases.add(options.canvas)

    if(options.z < Number.MAX_SAFE_INTEGER) setCanvasZIndex(options.canvas, options.z)

    const position = convertPosition(options, confettiGlobals)
    const colors = convertProps(options, confettiGlobals).colors.map((color: string) => convertHexToRGB(color) as unknown as RGB)

    for (let i = 0; i < options.count; i++) {
        fettis.push(confettiProperties(options, position, colors))
    }

    initConfetti()

}

/**
 * Confetti properties
 *
 * @return {ConfettiProperties}
 */
const confettiProperties = (options: ConfettiGlobals, position: { x: number, y: number }, colors: RGB[]): ConfettiProperties => {

    const props = convertProps(options, confettiGlobals)

    const color = colors[Math.floor(randomNumber(0, colors.length))]
    const radius = {
        angle: props.angle * (Math.PI / 180),
        spread: props.spread * (Math.PI / 180)
    }

    return {

        canvas: options.canvas,

        random: Math.random() + 2,
        angle2d: -radius.angle + ((0.5 * radius.spread) - (Math.random() * radius.spread)),
        opacity: props.ticks >= 0,
        progress: props.ticks,
        lifetime: props.ticks,

        wabble: {
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
 * Update confetti
 *
 * @param {ConfettiProperties} fetti
 * @param {number} step Frames of 60 per second since the last update
 * @return {void}
 */
const updateConfetti = (fetti: ConfettiProperties, step: number): void => {

    fetti.position.x += (Math.cos(fetti.angle2d) * fetti.speed + fetti.drift) * step
    fetti.position.y += (Math.sin(fetti.angle2d) * fetti.speed + fetti.gravity) * step
    fetti.speed *= Math.pow(fetti.decay, step)

    if(fetti.quiet) {

        fetti.tilt.sin = 0
        fetti.tilt.cos = 0
        fetti.random = 1

        fetti.wabble.w = 0
        fetti.wabble.x = fetti.position.x + (10 * fetti.scale)
        fetti.wabble.y = fetti.position.y + (10 * fetti.scale)

    } else {

        fetti.tilt.angle += 0.1 * step
        fetti.tilt.sin = Math.sin(fetti.tilt.angle)
        fetti.tilt.cos = Math.cos(fetti.tilt.angle)

        fetti.random = Math.random() + 2
        fetti.wabble.w += fetti.wabble.speed * step
        fetti.wabble.x = fetti.position.x + ((10 * fetti.scale) * Math.cos(fetti.wabble.w))
        fetti.wabble.y = fetti.position.y + ((10 * fetti.scale) * Math.sin(fetti.wabble.w))

    }

    fetti.progress = fetti.tick / fetti.lifetime
    fetti.tick += step

}

/**
 *  Create confetti shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const createConfettiShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    fetti.opacity ?
    (context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - fetti.progress) + ')') :
    (context.fillStyle = 'rgb(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ')')

    shapeRenderers[fetti.shape]?.(context, fetti)

}

/**
 * Render confetti
 *
 * @return {void}
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

        if(gone) fettis.splice(index, 1)

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
 * Stop confettis
 *
 * @return {void}
 */
const stop = (): void => {

    if(isSSR) return

    if(animationFrame !== null) window.cancelAnimationFrame(animationFrame)

    window.removeEventListener('resize', resizeConfetti)

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
