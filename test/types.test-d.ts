import { describe, it, expectTypeOf } from 'vitest'
import { ConfettiProps } from '../src/types'

describe('shapes', () => {

    it('accepts all the shapes', () => {
        expectTypeOf<{ shapes: [ 'square', 'rectangle', 'ellipse', 'circle', 'star', 'emoji', 'triangle', 'svg' ] }>().toExtend<ConfettiProps>()
    })

    it('does not accept unknown shapes', () => {
        expectTypeOf<{ shapes: [ 'hexagon' ] }>().not.toExtend<ConfettiProps>()
    })

})
