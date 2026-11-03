/*
 *
 *  🎉 Confettis v0.5.0
 *  https://github.com/sizoroot/confettis
 *
 *  (c) 2026 Lucas O. S.
 *  Confettis may be freely distributed under the MIT license.
 *
*/

type Shapes = 'square' | 'rectangle' | 'ellipse' | 'circle' | 'star' | 'emoji' | 'triangle' | 'svg';
type ConfettiProps = {
    /** Horizontal position relative to the canvas, 0 is the left edge and 1 the right edge */
    x?: number;
    /** Vertical position relative to the canvas, 0 is the upper edge and 1 the lower edge */
    y?: number;
    z?: number;
    canvas?: string;
    count?: number;
    gravity?: number | number[];
    ticks?: number | number[];
    speed?: number | number[];
    scale?: number | number[];
    overflow?: {
        left?: boolean;
        right?: boolean;
        top?: boolean;
        bottom?: boolean;
    };
    decay?: number;
    drift?: number;
    angle?: number;
    spread?: number;
    quiet?: boolean;
    disableForReducedMotion?: boolean;
    shapes?: Shapes[];
    colors?: string[];
    emojis?: string[];
    /** SVG markup (`<svg ...>`) or URLs used by the `svg` shape */
    svgs?: string[];
};

/**
 * Creates a burst of confetti. The props override the global defaults, and the canvas is created
 * if it does not exist yet. It does nothing on the server, or when `disableForReducedMotion` is
 * enabled and the user prefers reduced motion.
 *
 * @param {ConfettiProps} [props] - Options of this burst (count, position, colors, shapes, physics...)
 * @returns {Promise<void>} Resolved when all the confettis of this call are gone or stopped
 */
declare const createConfetti: (props?: ConfettiProps) => Promise<void>;
/**
 * Stops the confetti and clears the canvas. When a canvas is given, only its confettis are stopped
 * and the render loop keeps running while other canvases are still in use. The promises of the
 * stopped confettis are resolved. It does nothing on the server.
 *
 * @param {string} [canvas] - Id of the canvas to stop, by default all of them
 * @returns {void}
 */
declare const stop: (canvas?: string) => void;

export { createConfetti as create, stop };
