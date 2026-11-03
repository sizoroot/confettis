import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { convertPosition, convertProps } from '../src/utils'
import { getCanvas, getCanvasPos, setCanvasZIndex } from '../src/canvas'
import { ConfettiGlobals } from '../src/types'

const globals: ConfettiGlobals = {

    x: 0.5,
    y: 0.7,
    z: 1,

    canvas: 'confettis',
    count: 100,

    gravity: 1,
    ticks: 300,
    speed: 45,
    scale: 0.8,

    overflow: { left: true, right: true, top: true, bottom: true },

    decay: 0.92,
    drift: 5,
    angle: 90,
    spread: 70,
    quiet: true,

    shapes: [ 'square' ],
    colors: [ '#ffffff' ],
    emojis: [ '✨' ],
    svgs: []

}

beforeEach(() => {
    Object.defineProperty(document.documentElement, 'clientWidth', { value: 1000, configurable: true })
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true })
})

afterEach(() => {
    document.body.innerHTML = ''
})

describe('getCanvasPos', () => {

    it('uses the center by default', () => {
        expect(getCanvasPos()).toEqual({ x: 500, y: 400 })
    })

    it('keeps 0 as a position', () => {
        expect(getCanvasPos({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 })
    })

    it('uses the size in CSS pixels on high density screens', () => {
        vi.stubGlobal('devicePixelRatio', 2)
        expect(getCanvasPos()).toEqual({ x: 500, y: 400 })
        vi.unstubAllGlobals()
    })

})

describe('setCanvasZIndex', () => {

    it('sets the z-index of an existing canvas', () => {
        const canvas = getCanvas('custom')
        setCanvasZIndex('custom', 10)
        expect(canvas.style.zIndex).toBe('10')
    })

    it('does nothing when the canvas does not exist', () => {
        expect(() => setCanvasZIndex('missing', 10)).not.toThrow()
    })

})

describe('convertPosition', () => {

    it('uses the globals when a prop is not defined', () => {
        expect(convertPosition({}, globals)).toEqual({ x: 500, y: 560 })
        expect(convertPosition(undefined, globals)).toEqual({ x: 500, y: 560 })
    })

    it('converts the relative position to pixels', () => {
        expect(convertPosition({ x: 0.25, y: 0.5 }, globals)).toEqual({ x: 250, y: 400 })
    })

    it('keeps 0 as a position', () => {
        expect(convertPosition({ x: 0, y: 0 }, globals)).toEqual({ x: 0, y: 0 })
    })

    it('keeps 0 as a position with a custom canvas', () => {
        expect(convertPosition({ canvas: 'custom', x: 0, y: 0 }, globals)).toEqual({ x: 0, y: 0 })
    })

})

describe('convertProps', () => {

    it('uses the globals when there are no props', () => {
        const result = convertProps(undefined, globals)
        expect(result.drift).toBe(5)
        expect(result.quiet).toBe(true)
        expect(result.overflow).toEqual(globals.overflow)
    })

    it('uses the globals when a prop is not defined', () => {
        const result = convertProps({}, globals)
        expect(result.angle).toBe(90)
        expect(result.gravity).toBe(1)
    })

    it('keeps 0 as a value', () => {

        const result = convertProps({ gravity: 0, scale: 0, speed: 0, angle: 0, spread: 0, ticks: 0, drift: 0, decay: 0 }, globals)

        expect(result.gravity).toBe(0)
        expect(result.scale).toBe(0)
        expect(result.speed).toBe(0)
        expect(result.angle).toBe(0)
        expect(result.spread).toBe(0)
        expect(result.ticks).toBe(0)
        expect(result.drift).toBe(0)
        expect(result.decay).toBe(0)

    })

    it('keeps false as a value', () => {
        const result = convertProps({ quiet: false, overflow: { top: false } }, globals)
        expect(result.quiet).toBe(false)
        expect(result.overflow).toEqual({ left: true, right: true, top: false, bottom: true })
    })

    it('picks a random item when the value is a list', () => {
        for (let i = 0; i < 20; i++) {
            const result = convertProps({ gravity: [ 0, 2 ], scale: [ 0, 3 ], speed: [ 0, 4 ] }, globals)
            expect([ 0, 2 ]).toContain(result.gravity)
            expect([ 0, 3 ]).toContain(result.scale)
            expect([ 0, 4 ]).toContain(result.speed)
        }
    })

})
