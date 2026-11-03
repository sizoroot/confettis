import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createConfetti, stop } from '../src/confetti'
import { getSvgUrl, loadSvgs } from '../src/shapes/svg'

const MARKUP = '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="5"/></svg>'

let nextFrame: FrameRequestCallback | null = null
let drawn: unknown[][] = []

// Loads every source except the ones containing "broken"
class FakeImage {
    naturalWidth = 20
    naturalHeight = 10
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    set src(value: string) {
        queueMicrotask(() => value.includes('broken') ? this.onerror?.() : this.onload?.())
    }
}

beforeEach(() => {

    Object.defineProperty(document.documentElement, 'clientWidth', { value: 1000, configurable: true })
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true })

    drawn = []

    vi.stubGlobal('Image', FakeImage)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
        nextFrame = callback
        return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => { nextFrame = null })

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((() => new Proxy({}, {
        get: (target, key) => (...args: unknown[]) => { if (key === 'drawImage') drawn.push(args) },
        set: () => true
    })) as any)

})

afterEach(() => {
    stop()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe('getSvgUrl', () => {

    it('encodes the markup as a data URI and adds the namespace', () => {
        const url = getSvgUrl(MARKUP)
        expect(url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true)
        expect(decodeURIComponent(url)).toContain('<svg xmlns="http://www.w3.org/2000/svg" viewBox')
    })

    it('keeps an existing namespace', () => {
        const markup = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
        expect(decodeURIComponent(getSvgUrl(markup))).toContain(markup)
    })

    it('uses URLs as they are', () => {
        expect(getSvgUrl(' /images/logo.svg ')).toBe('/images/logo.svg')
    })

})

describe('loadSvgs', () => {

    it('ignores the SVGs that fail to load', async () => {
        const images = await loadSvgs([ MARKUP, '/broken.svg' ])
        expect(images).toHaveLength(1)
    })

})

describe('svg shape', () => {

    it('draws the SVGs once they are loaded', async () => {

        const done = createConfetti({ count: 10, shapes: [ 'svg' ], svgs: [ MARKUP ], ticks: 2 })

        // Nothing is created until the SVGs are loaded
        expect(nextFrame).toBeNull()
        await Promise.resolve()
        await Promise.resolve()
        await Promise.resolve()
        expect(nextFrame).not.toBeNull()

        nextFrame!(16)
        expect(drawn).toHaveLength(10)

        // Longest side is scale * 100, keeping the aspect ratio
        const [ , , , width, height ] = drawn[0] as number[]
        expect(width).toBeCloseTo(80)
        expect(height).toBeCloseTo(40)

        stop()
        await done

    })

    it('does not wait for SVGs when the shape is not used', () => {
        createConfetti({ count: 1, shapes: [ 'square' ], svgs: [ MARKUP ] })
        expect(nextFrame).not.toBeNull()
    })

    it('does not draw anything when no SVG could be loaded', async () => {

        createConfetti({ count: 5, shapes: [ 'svg' ], svgs: [ '/broken.svg' ] })
        await new Promise((resolve) => setTimeout(resolve, 0))

        nextFrame!(16)
        expect(drawn).toHaveLength(0)

    })

})
