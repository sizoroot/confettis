import { ConfettiProperties } from '../types'

/**
 * Draws a square that flutters according to its tilt and wobble.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, tilt and wobble
 * @returns {void}
 */
const squareShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos)
    let x2 = fetti.wobble.x + (fetti.random * fetti.tilt.cos)
    let y2 = fetti.wobble.y + (fetti.random * fetti.tilt.sin)

    context.beginPath()
    context.moveTo(fetti.position.x, fetti.position.y)
    context.lineTo(fetti.wobble.x, fetti.position.y)
    context.lineTo(x2, y2)
    context.lineTo(x1, fetti.wobble.y)
    context.closePath()
    context.fill()

}

export default squareShape