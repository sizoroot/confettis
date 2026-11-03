import { ConfettiProperties } from '../types'

/**
 * Circle Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const circleShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {
    
    const flip = fetti.scale > 0 ? Math.abs(fetti.wabble.y - fetti.position.y) / (10 * fetti.scale) : 1

    context.beginPath()
    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wabble.w)
    context.scale(1, 0.25 + 0.75 * flip)
    context.arc(0, 0, fetti.scale * 10, 0, 2 * Math.PI)
    context.restore()
    context.closePath()
    context.fill()
}

export default circleShape