import { ConfettiGlobals, RGB } from './types'
import { getCanvasPos } from './canvas'

/**
 * Generate random number between two numbers (min/max)
 */
export const randomNumber = (min: number, max: number) => Math.random() * (max - min) + min

/**
 * Convert hex format to RGB for opacity support (RGBA)
 */
export const convertHexToRGB = (hex: string): RGB | null => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

/**
 * Is SSR is a way to check if the function are running on the server.
 * When rendering on server there is no window.requestAnimationFrame(),
 * and if so we deactivate the lib so that it is not executed.
 */
export const isSSR = (() => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') return true
    return false
})()

/**
 * Checking if the parameter is a number.
 */
export const isNumber = (param: any) => {
    return typeof param === 'number'
}

/**
 * Returns the number or a random item when it is a list of numbers.
 */
const randomItem = (value: number | number[]): number => {
    if (Array.isArray(value)) return value[Math.floor(randomNumber(0, value.length))]
    return value
}

/**
 * Converts the relative position (0 to 1) of the props to the canvas position in pixels.
 */
export const convertPosition = (props: any, globals: ConfettiGlobals): { x: number, y: number } => {
    return getCanvasPos({ id: props?.canvas, x: props?.x ?? globals.x, y: props?.y ?? globals.y })
}

/**
 * Checks if there is a prop and if there isn't then returns a default value.
 */
export const convertProps = (props: any, globals: ConfettiGlobals): any => {

    let colors, shapes, emojis, angle, spread, gravity, speed, ticks, drift, decay, scale, quiet, overflow

    colors = props?.colors ?? globals.colors
    shapes = props?.shapes ?? globals.shapes
    emojis = props?.emojis ?? globals.emojis

    gravity = randomItem(props?.gravity ?? globals.gravity)
    scale = randomItem(props?.scale ?? globals.scale)
    speed = randomItem(props?.speed ?? globals.speed)

    overflow = {
        left: props?.overflow?.left ?? globals.overflow.left,
        right: props?.overflow?.right ?? globals.overflow.right,
        top: props?.overflow?.top ?? globals.overflow.top,
        bottom: props?.overflow?.bottom ?? globals.overflow.bottom
    }

    spread = props?.spread ?? globals.spread
    angle = props?.angle ?? globals.angle
    ticks = randomItem(props?.ticks ?? globals.ticks)
    drift = props?.drift ?? globals.drift
    decay = props?.decay ?? globals.decay
    quiet = props?.quiet ?? globals.quiet

    return {

        colors,
        shapes,
        emojis,

        gravity,
        scale,
        speed,

        angle,
        spread,
        ticks,
        drift,
        decay,
        quiet,

        overflow

    }

}
