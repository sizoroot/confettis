import { ConfettiProperties } from '../types'

/**
 * Draws an ellipse that rotates and changes proportion according to its tilt and wobble.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, scale, tilt and wobble
 * @returns {void}
 */
const ellipseShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos)
    let y1 = fetti.position.y + (fetti.random * fetti.tilt.sin)
    let x2 = fetti.wobble.x + (fetti.random * fetti.tilt.cos)
    let y2 = fetti.wobble.y + (fetti.random * fetti.tilt.sin)
    
    context.beginPath()
    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wobble.w)
    context.scale(Math.abs(x2 - x1) * fetti.scale, Math.abs(y2 - y1) * fetti.scale)
    context.arc(0, 0, 1, 0, 2 * Math.PI, true)
    context.restore()
    context.closePath()
    context.fill()
}

export default ellipseShape