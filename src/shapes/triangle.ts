import { ConfettiProperties } from '../types'

/**
 * Triangle Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const triangleShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {
    
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos)
    let y1 = fetti.position.y + (fetti.random * fetti.tilt.sin)
    let x2 = fetti.wabble.x + (fetti.random * fetti.tilt.cos)
    let y2 = fetti.wabble.y + (fetti.random * fetti.tilt.sin)

    context.beginPath()
    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wabble.w)
    context.scale(Math.abs(x2 - x1) * fetti.scale, Math.abs(y2 - y1) * fetti.scale)
    context.moveTo(Math.cos(0), Math.sin(0))
    context.lineTo(Math.cos((2 * Math.PI) / 3), Math.sin((2 * Math.PI) / 3))
    context.lineTo(Math.cos((4 * Math.PI) / 3), Math.sin((4 * Math.PI) / 3))
    context.closePath()
    context.restore()
    context.fill()

}

export default triangleShape
