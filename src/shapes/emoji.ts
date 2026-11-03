import { ConfettiProperties } from '../types'

/**
 * Draws the emoji of the confetti piece as text, sized by its scale.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides the emoji, position and scale
 * @returns {void}
 */
const emojiShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {
    context.beginPath()
    context.font = (fetti.scale * 100) + 'px serif'
    context.fillText(fetti.emoji, fetti.position.x, fetti.position.y)
    context.restore()
    context.closePath()
    context.fill()
}

export default emojiShape