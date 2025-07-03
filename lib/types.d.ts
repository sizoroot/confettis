/*
 *
 *  🎉 Confettis v0.3.8
 *  https://github.com/sizoroot/confettis
 *
 *  (c) 2025 Lucas O. S.
 *  Confettis may be freely distributed under the MIT license.
 *
*/

type ConfettiProps = {
    x?: number;
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
    shapes?: string[];
    colors?: string[];
    emojis?: string[];
};

/**
 * Create confetti
 *
 * @return {void}
 */
declare const createConfetti: (props?: ConfettiProps) => void;
/**
 * Reset confetti
 *
 * @return {void}
 */
declare const reset: () => void;

export { createConfetti as create, reset };
