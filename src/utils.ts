import { ConfettiGlobals, RGB } from './types'
import { getCanvasPos } from './canvas'

/**
 * Generates a random floating point number within a range.
 *
 * @param {number} min - Lower bound of the range (inclusive)
 * @param {number} max - Upper bound of the range (exclusive)
 * @returns {number} Random number between `min` and `max`
 */
export const randomNumber = (min: number, max: number) => Math.random() * (max - min) + min

/**
 * Converts a hex color into its RGB channels, so an opacity can be applied later (RGBA).
 *
 * @param {string} hex - Six digit hex color, with or without the leading `#` (e.g. `#33ffdd`)
 * @returns {RGB | null} Object with the `r`, `g` and `b` channels (0 to 255), or `null` if the format is invalid
 */
export const convertHexToRGB = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

/**
 * Flag that indicates whether the code is running on the server (SSR).
 * When rendering on the server there is no `window.requestAnimationFrame()`, so the library
 * is deactivated to avoid executing browser only code.
 *
 * @type {boolean} `true` when `window` or `requestAnimationFrame` are not available
 */
export const isSSR = (() => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') return true
    return false
})()

/**
 * Checks whether a value is of type number.
 *
 * @param {any} param - Value to check
 * @returns {boolean} `true` if the value is a number, `false` otherwise
 */
export const isNumber = (param: any) => {
    return typeof param === 'number'
}

/**
 * Resolves a value that can be either a single number or a list of numbers.
 *
 * @param {number | number[]} value - A number, or a list to pick a random item from
 * @returns {number} The number itself, or a random item of the list
 */
const randomItem = (value: number | number[]): number => {
    if (Array.isArray(value)) return value[Math.floor(randomNumber(0, value.length))]
    return value
}

/**
 * Converts the relative position (0 to 1) of the props into a canvas position in pixels.
 * Each coordinate falls back to the global value when it is not set in the props.
 *
 * @param {any} props - Confetti props, it may include `canvas`, `x` and `y`
 * @param {ConfettiGlobals} globals - Global defaults used when a prop is missing
 * @returns {{ x: number, y: number }} Position in CSS pixels inside the canvas
 */
export const convertPosition = (props: any, globals: ConfettiGlobals): { x: number, y: number } => {
    return getCanvasPos({ id: props?.canvas, x: props?.x ?? globals.x, y: props?.y ?? globals.y })
}

/**
 * Resolves the final value of every confetti property. Each one falls back to the global default
 * when it is not set in the props, and properties that accept a list (`gravity`, `scale`, `speed`
 * and `ticks`) are resolved to a single random item.
 *
 * @param {any} props - Confetti props that override the globals
 * @param {ConfettiGlobals} globals - Global defaults used when a prop is missing
 * @returns {any} Object with the resolved properties, ready to create a confetti piece
 */
export const convertProps = (props: any, globals: ConfettiGlobals): any => {

    let colors, shapes, emojis, svgs, angle, spread, gravity, speed, ticks, drift, decay, scale, quiet, overflow

    colors = props?.colors ?? globals.colors
    shapes = props?.shapes ?? globals.shapes
    emojis = props?.emojis ?? globals.emojis
    svgs = props?.svgs ?? globals.svgs

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
        svgs,

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
