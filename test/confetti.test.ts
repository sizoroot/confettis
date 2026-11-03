import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createConfetti, stop } from '../src/confetti'

let nextFrame: FrameRequestCallback | null = null
let styles: string[] = []
let events: string[] = []
let canvasEvents: { [id: string]: string[] } = {}
let time = 0

const FRAME = 1000 / 60

const frame = (interval: number = FRAME): number => {
    const callback = nextFrame
    nextFrame = null
    styles = []
    events = []
    canvasEvents = {}
    time += interval
    if (callback) callback(time)
    return styles.length
}

// Runs frames until the animation stops, returns the confettis drawn on each one
const runUntilIdle = (interval: number = FRAME, max: number = 200): number[] => {
    const counts: number[] = []
    while (nextFrame && counts.length < max) counts.push(frame(interval))
    return counts
}

beforeEach(() => {

    time = 0

    Object.defineProperty(document.documentElement, 'clientWidth', { value: 1000, configurable: true })
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true })

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
        nextFrame = callback
        return 1
    })

    vi.stubGlobal('cancelAnimationFrame', () => { nextFrame = null })

    // Every fillStyle assignment is a confetti drawn
    const createContext = (id: string) => new Proxy({}, {
        get: (target, key) => (...args: unknown[]) => {
            events.push(String(key))
            canvasEvents[id] = [ ...(canvasEvents[id] ?? []), `${String(key)}(${args.join(',')})` ]
        },
        set: (target, key, value) => {
            if (key === 'fillStyle') {
                styles.push(value)
                events.push('fillStyle')
                canvasEvents[id] = [ ...(canvasEvents[id] ?? []), 'fillStyle' ]
            }
            return true
        }
    })

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (this: HTMLCanvasElement) {
        return createContext(this.id) as unknown as CanvasRenderingContext2D
    } as any)

})

afterEach(() => {
    stop()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe('removing confettis', () => {

    it('draws all confettis while they are alive', () => {
        createConfetti({ count: 100, ticks: 10 })
        expect(frame()).toBe(100)
        expect(frame()).toBe(100)
    })

    it('removes all the confettis that expire in the same frame', () => {

        createConfetti({ count: 100, ticks: 3 })

        const counts = runUntilIdle()

        // None is left behind, all are drawn until they expire together
        expect(counts.length).toBeGreaterThan(3)
        counts.filter(count => count > 0).forEach(count => expect(count).toBe(100))
        expect(nextFrame).toBeNull()

    })

    it('does not remove other confettis when one leaves the screen by two sides', () => {

        // Bottom-right corner, they leave by the right and the bottom side
        createConfetti({ count: 20, x: 1, y: 1, angle: 315, spread: 1, speed: 100 })
        createConfetti({ count: 50, x: 0.5, y: 0.3, speed: 1, ticks: 100 })

        frame()

        expect(frame()).toBe(50)

    })

})

describe('ticks as a list', () => {

    const alpha = (style: string): number => parseFloat(style.split(',')[3])

    it('fades out only the confettis with a positive lifetime', () => {

        // 3 ticks fade out and expire, -1 never fades out nor expires
        createConfetti({ count: 200, ticks: [ 3, -1 ] })

        for (let i = 0; i < 3; i++) {
            frame()
            styles.filter(style => style.startsWith('rgba')).forEach(style => {
                expect(alpha(style)).toBeGreaterThanOrEqual(0)
                expect(alpha(style)).toBeLessThanOrEqual(1)
            })
        }

        // After the expiration only the ones without lifetime are left
        for (let i = 0; i < 4; i++) frame()

        expect(styles.length).toBeGreaterThan(0)
        expect(styles.length).toBeLessThan(200)
        styles.forEach(style => expect(style.startsWith('rgb(')).toBe(true))

    })

})

describe('resize listener', () => {

    it('is added only once when confettis are created after stopping', () => {

        const add = vi.spyOn(window, 'addEventListener')
        const remove = vi.spyOn(window, 'removeEventListener')

        const active = (): number => {
            const added = add.mock.calls.filter(call => call[0] === 'resize').length
            const removed = remove.mock.calls.filter(call => call[0] === 'resize').length
            return added - removed
        }

        createConfetti()
        stop()
        createConfetti()

        expect(active()).toBe(1)

        stop()

        expect(active()).toBe(0)

    })

    it('resizes the canvas with the window', () => {

        createConfetti()

        Object.defineProperty(document.documentElement, 'clientWidth', { value: 500, configurable: true })
        window.dispatchEvent(new Event('resize'))

        expect(document.getElementById('confettis')?.getAttribute('width')).toBe('500')

        stop()
        window.dispatchEvent(new Event('resize'))

    })

    it('uses the current window size when creating confettis after resizing a stopped canvas', () => {

        createConfetti()
        stop()

        Object.defineProperty(document.documentElement, 'clientWidth', { value: 500, configurable: true })
        Object.defineProperty(document.documentElement, 'clientHeight', { value: 400, configurable: true })
        window.dispatchEvent(new Event('resize'))

        createConfetti()

        const canvas = document.getElementById('confettis') as HTMLCanvasElement
        expect(canvas.width).toBe(500)
        expect(canvas.height).toBe(400)

    })

})

describe('animation loop', () => {

    it('keeps running while there are confettis', () => {
        createConfetti({ count: 10, ticks: 10 })
        frame()
        expect(nextFrame).not.toBeNull()
    })

    it('stops when there are no confettis left and clears the canvas', () => {

        createConfetti({ count: 10, ticks: 3 })

        runUntilIdle()

        expect(nextFrame).toBeNull()
        expect(events[events.length - 1]).toBe('clearRect')

    })

    it('starts again when new confettis are created', () => {

        createConfetti({ count: 10, ticks: 3 })
        runUntilIdle()

        createConfetti({ count: 10, ticks: 3 })

        expect(nextFrame).not.toBeNull()
        expect(frame()).toBe(10)

    })

})

describe('delta time', () => {

    const frames = (interval: number): number => {
        createConfetti({ count: 10, ticks: 30 })
        return runUntilIdle(interval).length
    }

    it('lasts the same time whatever the refresh rate is', () => {

        const at60 = frames(1000 / 60)
        stop()
        const at120 = frames(1000 / 120)
        stop()
        const at30 = frames(1000 / 30)

        expect(at120).toBeGreaterThanOrEqual(at60 * 2 - 2)
        expect(at120).toBeLessThanOrEqual(at60 * 2 + 2)
        expect(at30).toBeGreaterThanOrEqual(at60 / 2 - 2)
        expect(at30).toBeLessThanOrEqual(at60 / 2 + 2)

    })

    it('limits the step after a long pause', () => {

        // 30 ticks with a maximum step of 3 can not take less than 10 frames
        createConfetti({ count: 10, ticks: 30 })

        expect(runUntilIdle(10000).length).toBeGreaterThanOrEqual(10)

    })

})

describe('several canvases', () => {

    it('clears and releases each canvas when its confettis are gone', () => {

        createConfetti({ canvas: 'a', count: 10, ticks: 3 })
        createConfetti({ canvas: 'b', count: 10, ticks: 60 })

        // Run until the confettis of the canvas a expire
        let frames = 0
        while (nextFrame && frames++ < 20) {
            frame()
            if (!canvasEvents['a']?.includes('fillStyle')) break
        }

        expect(frames).toBeLessThan(20)
        expect(canvasEvents['a']?.some(event => event.startsWith('clearRect'))).toBe(true)
        expect(nextFrame).not.toBeNull()

        // The canvas b keeps animating and the a is not touched anymore
        expect(frame()).toBe(10)
        expect(canvasEvents['a']).toBeUndefined()

    })

    it('draws the confettis of each call in its own canvas', () => {

        createConfetti({ canvas: 'a', count: 10, ticks: 60 })
        createConfetti({ canvas: 'b', count: 5, ticks: 60 })

        frame()

        expect(canvasEvents['a']?.filter(event => event === 'fillStyle').length).toBe(10)
        expect(canvasEvents['b']?.filter(event => event === 'fillStyle').length).toBe(5)

    })

    it('keeps the z-index of each canvas', () => {

        createConfetti({ canvas: 'a', z: 5 })
        createConfetti({ canvas: 'b', z: 7 })

        expect(document.getElementById('a')?.style.zIndex).toBe('5')
        expect(document.getElementById('b')?.style.zIndex).toBe('7')

    })

    it('resizes all the canvases with the window', () => {

        createConfetti({ canvas: 'a' })
        createConfetti({ canvas: 'b' })

        Object.defineProperty(document.documentElement, 'clientWidth', { value: 300, configurable: true })
        window.dispatchEvent(new Event('resize'))

        expect(document.getElementById('a')?.getAttribute('width')).toBe('300')
        expect(document.getElementById('b')?.getAttribute('width')).toBe('300')

    })

})

describe('high density screens', () => {

    it('uses the pixel ratio of the screen for the resolution of the canvas', () => {

        vi.stubGlobal('devicePixelRatio', 2)

        createConfetti({ count: 10, ticks: 60 })
        frame()

        const canvas = document.getElementById('confettis') as HTMLCanvasElement

        expect(canvas.width).toBe(2000)
        expect(canvas.height).toBe(1600)
        expect(canvas.style.width).toBe('1000px')
        expect(canvas.style.height).toBe('800px')
        expect(canvasEvents['confettis']).toContain('setTransform(2,0,0,2,0,0)')

    })

    it('limits the pixel ratio', () => {

        vi.stubGlobal('devicePixelRatio', 3)

        createConfetti()

        expect((document.getElementById('confettis') as HTMLCanvasElement).width).toBe(2000)

    })

    it('does not remove the confettis that are inside the screen', () => {

        vi.stubGlobal('devicePixelRatio', 2)

        createConfetti({ count: 50, ticks: 60, speed: 1 })

        expect(frame()).toBe(50)
        expect(frame()).toBe(50)

    })

})

describe('promise', () => {

    const track = (promise: Promise<void>): { done: boolean } => {
        const state = { done: false }
        promise.then(() => { state.done = true })
        return state
    }

    it('is resolved when the confettis of the call are gone', async () => {

        const state = track(createConfetti({ count: 10, ticks: 3 }))

        frame()
        await Promise.resolve()
        expect(state.done).toBe(false)

        runUntilIdle()
        await Promise.resolve()
        expect(state.done).toBe(true)

    })

    it('does not wait for the confettis of other calls', async () => {

        const short = track(createConfetti({ count: 10, ticks: 3 }))
        const long = track(createConfetti({ count: 10, ticks: 60 }))

        for (let i = 0; i < 6; i++) frame()
        await Promise.resolve()

        expect(short.done).toBe(true)
        expect(long.done).toBe(false)

    })

    it('is resolved when stopped', async () => {

        const state = track(createConfetti({ count: 10, ticks: 60 }))

        stop()
        await Promise.resolve()

        expect(state.done).toBe(true)

    })

    it('is resolved when there are no confettis to create', async () => {
        const state = track(createConfetti({ count: 0 }))
        await Promise.resolve()
        expect(state.done).toBe(true)
    })

})

describe('stop a canvas', () => {

    it('stops only the confettis of that canvas', async () => {

        createConfetti({ canvas: 'a', count: 10, ticks: 60 })
        createConfetti({ canvas: 'b', count: 5, ticks: 60 })

        stop('a')

        expect(frame()).toBe(5)
        expect(canvasEvents['a']).toBeUndefined()
        expect(nextFrame).not.toBeNull()

    })

    it('resolves the promise of the stopped canvas only', async () => {

        let doneA = false
        let doneB = false

        createConfetti({ canvas: 'a', count: 10, ticks: 60 }).then(() => { doneA = true })
        createConfetti({ canvas: 'b', count: 10, ticks: 60 }).then(() => { doneB = true })

        stop('a')
        await Promise.resolve()

        expect(doneA).toBe(true)
        expect(doneB).toBe(false)

    })

    it('stops the animation when it was the last canvas', () => {

        createConfetti({ canvas: 'a', count: 10, ticks: 60 })

        stop('a')

        expect(nextFrame).toBeNull()

    })

    it('does nothing when the canvas has no confettis', () => {

        createConfetti({ canvas: 'a', count: 10, ticks: 60 })

        stop('missing')

        expect(frame()).toBe(10)

    })

})

describe('reduced motion', () => {

    const preferReducedMotion = (matches: boolean) => {
        vi.stubGlobal('matchMedia', (query: string) => ({ matches: matches && query === '(prefers-reduced-motion: reduce)' }))
    }

    it('creates confettis by default', () => {
        preferReducedMotion(true)
        createConfetti({ count: 10 })
        expect(nextFrame).not.toBeNull()
    })

    it('does nothing when the user prefers reduced motion', async () => {

        preferReducedMotion(true)

        await createConfetti({ count: 10, disableForReducedMotion: true })

        expect(nextFrame).toBeNull()

    })

    it('creates confettis when the user does not prefer reduced motion', () => {
        preferReducedMotion(false)
        createConfetti({ count: 10, disableForReducedMotion: true })
        expect(nextFrame).not.toBeNull()
    })

})
