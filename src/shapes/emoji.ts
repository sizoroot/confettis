import { ConfettiProperties } from '../types'

/**
 * Draws the emoji of the confetti piece as text, sized by its scale. Like the other shapes it
 * spins and flips as it wobbles (disabled in `quiet` mode).
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides the emoji, position, scale and wobble
 * @returns {void}
 */
const emojiShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1

    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wobble.w)
    context.scale(1, 0.25 + 0.75 * flip)
    context.font = (fetti.scale * 100) + 'px serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(fetti.emoji, 0, 0)
    context.restore()

}

export default emojiShape
