import { ConfettiProperties } from '../types'

/**
 * Draws a five pointed star that spins and flips as it wobbles.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, scale and wobble
 * @returns {void}
 */
const starShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    let rotation = (Math.PI / 2) * 3
    let spikes = 5

    const innerRadius = 4 * fetti.scale
    const outerRadius = 8 * fetti.scale
    const step = Math.PI / spikes

    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1

    context.beginPath()
    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wobble.w)
    context.scale(1, 0.25 + 0.75 * flip)

    while (spikes--) {

        context.lineTo(Math.cos(rotation) * outerRadius, Math.sin(rotation) * outerRadius)
        rotation += step

        context.lineTo(Math.cos(rotation) * innerRadius, Math.sin(rotation) * innerRadius)
        rotation += step

    }

    context.closePath()
    context.restore()
    context.fill()
}

export default starShape