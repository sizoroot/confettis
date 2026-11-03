import { ConfettiProperties } from '../types'

/**
 * Draws a circle that spins and flips as it wobbles.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, scale and wobble
 * @returns {void}
 */
const circleShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {
    
    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1

    context.beginPath()
    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wobble.w)
    context.scale(1, 0.25 + 0.75 * flip)
    context.arc(0, 0, fetti.scale * 10, 0, 2 * Math.PI)
    context.restore()
    context.closePath()
    context.fill()
}

export default circleShape