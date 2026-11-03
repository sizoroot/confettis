type Shapes = 'square' | 'rectangle' | 'ellipse' | 'circle' | 'star' | 'emoji' | 'triangle' | 'svg'

export type ConfettiGlobals = {

    x: number
    y: number
    z: number

    canvas: string
    count: number

    gravity: number | number[]
    ticks: number | number[]
    speed: number | number[]
    scale: number | number[]

    overflow: {
        left: boolean
        right: boolean
        top: boolean
        bottom: boolean
    }

    decay: number
    drift: number
    angle: number
    spread: number
    quiet: boolean
    disableForReducedMotion: boolean

    shapes: Shapes[]
    colors: string[]
    emojis: string[]
    svgs: string[]

}

export type ConfettiProps = {

    /** Horizontal position relative to the canvas, 0 is the left edge and 1 the right edge */
    x?: number
    /** Vertical position relative to the canvas, 0 is the upper edge and 1 the lower edge */
    y?: number
    z?: number

    canvas?: string
    count?: number

    gravity?: number | number[]
    ticks?: number | number[]
    speed?: number | number[]
    scale?: number | number[]

    overflow?: {
        left?: boolean
        right?: boolean
        top?: boolean
        bottom?: boolean
    }

    decay?: number
    drift?: number
    angle?: number
    spread?: number
    quiet?: boolean
    disableForReducedMotion?: boolean
    shapes?: Shapes[]
    colors?: string[]
    emojis?: string[]
    /** SVG markup (`<svg ...>`) or URLs used by the `svg` shape */
    svgs?: string[]

}

export type ConfettiBatch = {
    remaining: number
    resolve: () => void
}

export type ConfettiProperties = {

    canvas: string
    batch: ConfettiBatch

    random: number
    angle2d: number
    opacity: boolean
    progress: number
    lifetime: number

    wobble: {
        w: number
        x: number
        y: number
        speed: number
    }
    tilt: {
        angle: number
        sin: number
        cos: number
    }

    shape: string
    emoji: string
    svg?: HTMLImageElement

    tick: number
    gravity: number
    speed: number
    drift: number
    decay: number
    scale: number
    quiet: boolean

    overflow: {
        left: boolean
        right: boolean
        top: boolean
        bottom: boolean
    }

    color: {
        r: number
        g: number
        b: number
    }

    position: {
        x: number
        y: number
    }

}

export type RGB = {
    r: number
    g: number
    b: number
}
