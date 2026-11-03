import { ConfettiProperties } from '../types'

const SVG_SIZE = 100
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const images = new Map<string, Promise<HTMLImageElement | null>>()

/**
 * Converts an SVG source into a URL that an image can load. Markup (`<svg ...>`) is encoded as a
 * data URI, anything else (URL, path or data URI) is used as it is.
 *
 * @param {string} source - SVG markup or URL
 * @returns {string} URL ready to be set as the `src` of an image
 */
export const getSvgUrl = (source: string): string => {

    const value = source.trim()
    if(!value.startsWith('<')) return value

    const markup = /<svg\b[^>]*\bxmlns\s*=/i.test(value) ? value : value.replace(/<svg\b/i, '<svg xmlns="' + SVG_NAMESPACE + '"')
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup)

}

/**
 * Loads an SVG as an image. Results are cached by source, and `null` is returned when the SVG
 * cannot be loaded.
 *
 * @param {string} source - SVG markup or URL
 * @returns {Promise<HTMLImageElement | null>} Loaded image, or `null` if it failed
 */
export const loadSvg = (source: string): Promise<HTMLImageElement | null> => {

    const cached = images.get(source)
    if(cached) return cached

    const promise = new Promise<HTMLImageElement | null>((resolve) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => resolve(null)
        image.src = getSvgUrl(source)
    })

    images.set(source, promise)
    return promise

}

/**
 * Loads a list of SVGs, ignoring the ones that fail.
 *
 * @param {string[]} sources - SVG markups or URLs
 * @returns {Promise<HTMLImageElement[]>} The images that were loaded successfully
 */
export const loadSvgs = async (sources: string[]): Promise<HTMLImageElement[]> => {
    const loaded = await Promise.all(sources.map(loadSvg))
    return loaded.filter((image): image is HTMLImageElement => image !== null)
}

/**
 * Draws the SVG of the confetti piece, sized by its scale (the longest side is `scale * 100` pixels,
 * keeping the aspect ratio). Like the other shapes it spins and flips as it wobbles (disabled in
 * `quiet` mode). The SVG keeps its own colors, the confetti color is only used for the fade out.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on
 * @param {ConfettiProperties} fetti - Confetti piece that provides the SVG image, position, scale and wobble
 * @returns {void}
 */
const svgShape = (context: CanvasRenderingContext2D, fetti: ConfettiProperties): void => {

    if(!fetti.svg) return

    const naturalWidth = fetti.svg.naturalWidth || SVG_SIZE
    const naturalHeight = fetti.svg.naturalHeight || SVG_SIZE
    const ratio = (fetti.scale * SVG_SIZE) / Math.max(naturalWidth, naturalHeight)
    const width = naturalWidth * ratio
    const height = naturalHeight * ratio

    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1

    context.save()
    context.translate(fetti.position.x, fetti.position.y)
    context.rotate(Math.PI / 10 * fetti.wobble.w)
    context.scale(1, 0.25 + 0.75 * flip)
    if(fetti.opacity) context.globalAlpha = Math.max(0, 1 - fetti.progress)
    context.drawImage(fetti.svg, -width / 2, -height / 2, width, height)
    context.restore()

}

export default svgShape
