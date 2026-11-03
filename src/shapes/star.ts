import { ConfettiProperties } from '../types'

/**
 * Star Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const starShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    var rotation = (Math.PI / 2) * 3
    var spikes = 5

    const innerRadius = 4 * fetti.scale
    const outerRadius = 8 * fetti.scale
    const step = Math.PI / spikes

    const flip = fetti.scale > 0 ? Math.abs(fetti.wabble.y - fetti.position.y) / (10 * fetti.scale) : 1

    context.beginPath()
    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wabble.w)
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