import {  ConfettiProperties } from '../types'

/**
 * Rectangle Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const rectangleShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos)
    let x2 = fetti.wabble.x + (fetti.random * fetti.tilt.cos)
    let y2 = fetti.wabble.y + (fetti.random * fetti.tilt.sin)

    context.beginPath()
    context.moveTo(fetti.position.x, fetti.position.y)
    context.lineTo(fetti.wabble.x + 12, fetti.position.y)
    context.lineTo(x2 + 12, y2)
    context.lineTo(x1, fetti.wabble.y)
    context.closePath()
    context.fill()

}

export default rectangleShape