/*
 *
 *  🎉 Confettis v0.5.0
 *  https://github.com/sizoroot/confettis
 *
 *  (c) 2026 Lucas O. S.
 *  Confettis may be freely distributed under the MIT license.
 *
*/

// Pixel ratio used on each canvas, to get the size in CSS pixels
const pixelRatios = new WeakMap();
/**
 * Gets the device pixel ratio of the screen, capped at 2 to keep rendering performance acceptable
 * on high density displays.
 *
 * @returns {number} The pixel ratio, a value between 1 and 2
 */
const getPixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
/**
 * Sets the size of a canvas in CSS pixels. The internal resolution of the canvas is scaled by the
 * current pixel ratio, which is stored so the CSS size can be recovered later.
 *
 * @param {HTMLCanvasElement} canvas - Canvas element to resize
 * @param {number} width - New width in CSS pixels
 * @param {number} height - New height in CSS pixels
 * @returns {void}
 */
const setCanvasPixelSize = (canvas, width, height) => {
    const ratio = getPixelRatio();
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    pixelRatios.set(canvas, ratio);
};
/**
 * Gets the size of a canvas in CSS pixels, regardless of its internal resolution.
 *
 * @param {HTMLCanvasElement} canvas - Canvas element to measure
 * @returns {{ width: number, height: number, ratio: number }} Width and height in CSS pixels, and the pixel ratio applied to the canvas (1 if it was never sized by this library)
 */
const getCanvasSize = (canvas) => {
    var _a;
    const ratio = (_a = pixelRatios.get(canvas)) !== null && _a !== void 0 ? _a : 1;
    return { width: canvas.width / ratio, height: canvas.height / ratio, ratio: ratio };
};
/**
 * Creates a fixed, full window canvas that ignores pointer events and appends it to the document body.
 *
 * @param {string} [id="confettis"] - Id assigned to the new canvas element
 * @returns {HTMLCanvasElement} The newly created canvas element
 */
const createCanvas = (id = "confettis") => {
    const canvas = document.createElement("canvas");
    setCanvasPixelSize(canvas, document.documentElement.clientWidth, document.documentElement.clientHeight);
    canvas.id = id;
    canvas.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    return canvas;
};
/**
 * Sets the CSS z-index of an existing canvas. It does nothing if the canvas does not exist.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @param {number} [z=Number.MAX_SAFE_INTEGER] - Z-index value to apply
 * @returns {void}
 */
const setCanvasZIndex = (id = "confettis", z = Number.MAX_SAFE_INTEGER) => {
    const canvas = document.getElementById(id);
    if (canvas)
        canvas.style.zIndex = `${z}`;
};
/**
 * Gets the canvas with the given id, creating it if it does not exist yet.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {HTMLCanvasElement} The existing or newly created canvas element
 */
const getCanvas = (id = "confettis") => {
    let canvas = document.getElementById(id);
    if (!canvas)
        canvas = createCanvas(id);
    return canvas;
};
/**
 * Resizes a canvas to match the visible area of the window, creating the canvas if it does not exist yet.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {void}
 */
const setCanvasWindowSize = (id = "confettis") => {
    setCanvasPixelSize(getCanvas(id), document.documentElement.clientWidth, document.documentElement.clientHeight);
};
/**
 * Gets the 2D context of a canvas ready to draw in CSS pixels. The pixel ratio transform is applied
 * and the previous content of the canvas is cleared.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {CanvasRenderingContext2D} The cleared 2D rendering context
 */
const getCanvasContext = (id = "confettis") => {
    const canvas = getCanvas(id);
    const { width, height, ratio } = getCanvasSize(canvas);
    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    return context;
};
/**
 * Clears all the content of a canvas. It does nothing if the canvas or its context do not exist.
 *
 * @param {string} [id="confettis"] - Id of the canvas element
 * @returns {void}
 */
const clearCanvas = (id = "confettis") => {
    const canvas = document.getElementById(id);
    if (!canvas)
        return;
    const context = canvas.getContext("2d");
    if (!context)
        return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
};
/**
 * Converts a relative position (0 to 1) into a position in CSS pixels inside a canvas.
 * The result is clamped to the canvas bounds, and the canvas is created if it does not exist yet.
 *
 * @param {Object} [data] - Position data
 * @param {string} [data.id="confettis"] - Id of the canvas element
 * @param {number} [data.x=0.5] - Relative horizontal position, 0 is the left edge and 1 the right edge
 * @param {number} [data.y=0.5] - Relative vertical position, 0 is the upper edge and 1 the lower edge
 * @returns {{ x: number, y: number }} Position in CSS pixels
 */
const getCanvasPos = (data) => {
    var _a, _b;
    const id = (data === null || data === void 0 ? void 0 : data.id) || 'confettis';
    const x = (_a = data === null || data === void 0 ? void 0 : data.x) !== null && _a !== void 0 ? _a : 0.5;
    const y = (_b = data === null || data === void 0 ? void 0 : data.y) !== null && _b !== void 0 ? _b : 0.5;
    const canvas = getCanvas(id);
    const { width: canvasWidth, height: canvasHeight } = getCanvasSize(canvas);
    const canvasX = Math.max(0, Math.min(x * canvasWidth, canvasWidth));
    const canvasY = Math.max(0, Math.min(y * canvasHeight, canvasHeight));
    return {
        x: canvasX,
        y: canvasY
    };
};

/**
 * Generates a random floating point number within a range.
 *
 * @param {number} min - Lower bound of the range (inclusive)
 * @param {number} max - Upper bound of the range (exclusive)
 * @returns {number} Random number between `min` and `max`
 */
const randomNumber = (min, max) => Math.random() * (max - min) + min;
/**
 * Converts a hex color into its RGB channels, so an opacity can be applied later (RGBA).
 *
 * @param {string} hex - Six digit hex color, with or without the leading `#` (e.g. `#33ffdd`)
 * @returns {RGB | null} Object with the `r`, `g` and `b` channels (0 to 255), or `null` if the format is invalid
 */
const convertHexToRGB = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
/**
 * Flag that indicates whether the code is running on the server (SSR).
 * When rendering on the server there is no `window.requestAnimationFrame()`, so the library
 * is deactivated to avoid executing browser only code.
 *
 * @type {boolean} `true` when `window` or `requestAnimationFrame` are not available
 */
const isSSR = (() => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined')
        return true;
    return false;
})();
/**
 * Resolves a value that can be either a single number or a list of numbers.
 *
 * @param {number | number[]} value - A number, or a list to pick a random item from
 * @returns {number} The number itself, or a random item of the list
 */
const randomItem = (value) => {
    if (Array.isArray(value))
        return value[Math.floor(randomNumber(0, value.length))];
    return value;
};
/**
 * Converts the relative position (0 to 1) of the props into a canvas position in pixels.
 * Each coordinate falls back to the global value when it is not set in the props.
 *
 * @param {any} props - Confetti props, it may include `canvas`, `x` and `y`
 * @param {ConfettiGlobals} globals - Global defaults used when a prop is missing
 * @returns {{ x: number, y: number }} Position in CSS pixels inside the canvas
 */
const convertPosition = (props, globals) => {
    var _a, _b;
    return getCanvasPos({ id: props === null || props === void 0 ? void 0 : props.canvas, x: (_a = props === null || props === void 0 ? void 0 : props.x) !== null && _a !== void 0 ? _a : globals.x, y: (_b = props === null || props === void 0 ? void 0 : props.y) !== null && _b !== void 0 ? _b : globals.y });
};
/**
 * Resolves the final value of every confetti property. Each one falls back to the global default
 * when it is not set in the props, and properties that accept a list (`gravity`, `scale`, `speed`
 * and `ticks`) are resolved to a single random item.
 *
 * @param {any} props - Confetti props that override the globals
 * @param {ConfettiGlobals} globals - Global defaults used when a prop is missing
 * @returns {any} Object with the resolved properties, ready to create a confetti piece
 */
const convertProps = (props, globals) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    let colors, shapes, emojis, svgs, angle, spread, gravity, speed, ticks, drift, decay, scale, quiet, overflow;
    colors = (_a = props === null || props === void 0 ? void 0 : props.colors) !== null && _a !== void 0 ? _a : globals.colors;
    shapes = (_b = props === null || props === void 0 ? void 0 : props.shapes) !== null && _b !== void 0 ? _b : globals.shapes;
    emojis = (_c = props === null || props === void 0 ? void 0 : props.emojis) !== null && _c !== void 0 ? _c : globals.emojis;
    svgs = (_d = props === null || props === void 0 ? void 0 : props.svgs) !== null && _d !== void 0 ? _d : globals.svgs;
    gravity = randomItem((_e = props === null || props === void 0 ? void 0 : props.gravity) !== null && _e !== void 0 ? _e : globals.gravity);
    scale = randomItem((_f = props === null || props === void 0 ? void 0 : props.scale) !== null && _f !== void 0 ? _f : globals.scale);
    speed = randomItem((_g = props === null || props === void 0 ? void 0 : props.speed) !== null && _g !== void 0 ? _g : globals.speed);
    overflow = {
        left: (_j = (_h = props === null || props === void 0 ? void 0 : props.overflow) === null || _h === void 0 ? void 0 : _h.left) !== null && _j !== void 0 ? _j : globals.overflow.left,
        right: (_l = (_k = props === null || props === void 0 ? void 0 : props.overflow) === null || _k === void 0 ? void 0 : _k.right) !== null && _l !== void 0 ? _l : globals.overflow.right,
        top: (_o = (_m = props === null || props === void 0 ? void 0 : props.overflow) === null || _m === void 0 ? void 0 : _m.top) !== null && _o !== void 0 ? _o : globals.overflow.top,
        bottom: (_q = (_p = props === null || props === void 0 ? void 0 : props.overflow) === null || _p === void 0 ? void 0 : _p.bottom) !== null && _q !== void 0 ? _q : globals.overflow.bottom
    };
    spread = (_r = props === null || props === void 0 ? void 0 : props.spread) !== null && _r !== void 0 ? _r : globals.spread;
    angle = (_s = props === null || props === void 0 ? void 0 : props.angle) !== null && _s !== void 0 ? _s : globals.angle;
    ticks = randomItem((_t = props === null || props === void 0 ? void 0 : props.ticks) !== null && _t !== void 0 ? _t : globals.ticks);
    drift = (_u = props === null || props === void 0 ? void 0 : props.drift) !== null && _u !== void 0 ? _u : globals.drift;
    decay = (_v = props === null || props === void 0 ? void 0 : props.decay) !== null && _v !== void 0 ? _v : globals.decay;
    quiet = (_w = props === null || props === void 0 ? void 0 : props.quiet) !== null && _w !== void 0 ? _w : globals.quiet;
    return {
        colors,
        shapes,
        emojis,
        svgs,
        gravity,
        scale,
        speed,
        angle,
        spread,
        ticks,
        drift,
        decay,
        quiet,
        overflow
    };
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const SVG_SIZE = 100;
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const images = new Map();
/**
 * Converts an SVG source into a URL that an image can load. Markup (`<svg ...>`) is encoded as a
 * data URI, anything else (URL, path or data URI) is used as it is.
 *
 * @param {string} source - SVG markup or URL
 * @returns {string} URL ready to be set as the `src` of an image
 */
const getSvgUrl = (source) => {
    const value = source.trim();
    if (!value.startsWith('<'))
        return value;
    const markup = /<svg\b[^>]*\bxmlns\s*=/i.test(value) ? value : value.replace(/<svg\b/i, '<svg xmlns="' + SVG_NAMESPACE + '"');
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
};
/**
 * Loads an SVG as an image. Results are cached by source, and `null` is returned when the SVG
 * cannot be loaded.
 *
 * @param {string} source - SVG markup or URL
 * @returns {Promise<HTMLImageElement | null>} Loaded image, or `null` if it failed
 */
const loadSvg = (source) => {
    const cached = images.get(source);
    if (cached)
        return cached;
    const promise = new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = getSvgUrl(source);
    });
    images.set(source, promise);
    return promise;
};
/**
 * Loads a list of SVGs, ignoring the ones that fail.
 *
 * @param {string[]} sources - SVG markups or URLs
 * @returns {Promise<HTMLImageElement[]>} The images that were loaded successfully
 */
const loadSvgs = (sources) => __awaiter(void 0, void 0, void 0, function* () {
    const loaded = yield Promise.all(sources.map(loadSvg));
    return loaded.filter((image) => image !== null);
});
/**
 * Draws the SVG of the confetti piece, sized by its scale (the longest side is `scale * 100` pixels,
 * keeping the aspect ratio). Like the other shapes it spins and flips as it wobbles (disabled in
 * `quiet` mode). The SVG keeps its own colors, the confetti color is only used for the fade out.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on
 * @param {ConfettiProperties} fetti - Confetti piece that provides the SVG image, position, scale and wobble
 * @returns {void}
 */
const svgShape = (context, fetti) => {
    if (!fetti.svg)
        return;
    const naturalWidth = fetti.svg.naturalWidth || SVG_SIZE;
    const naturalHeight = fetti.svg.naturalHeight || SVG_SIZE;
    const ratio = (fetti.scale * SVG_SIZE) / Math.max(naturalWidth, naturalHeight);
    const width = naturalWidth * ratio;
    const height = naturalHeight * ratio;
    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1;
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.rotate(Math.PI / 10 * fetti.wobble.w);
    context.scale(1, 0.25 + 0.75 * flip);
    if (fetti.opacity)
        context.globalAlpha = Math.max(0, 1 - fetti.progress);
    context.drawImage(fetti.svg, -width / 2, -height / 2, width, height);
    context.restore();
};

/**
 * Draws the emoji of the confetti piece as text, sized by its scale. Like the other shapes it
 * spins and flips as it wobbles (disabled in `quiet` mode).
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides the emoji, position, scale and wobble
 * @returns {void}
 */
const emojiShape = (context, fetti) => {
    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1;
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.rotate(Math.PI / 10 * fetti.wobble.w);
    context.scale(1, 0.25 + 0.75 * flip);
    context.font = (fetti.scale * 100) + 'px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(fetti.emoji, 0, 0);
    context.restore();
};

/**
 * Draws an ellipse that rotates and changes proportion according to its tilt and wobble.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, scale, tilt and wobble
 * @returns {void}
 */
const ellipseShape = (context, fetti) => {
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos);
    let y1 = fetti.position.y + (fetti.random * fetti.tilt.sin);
    let x2 = fetti.wobble.x + (fetti.random * fetti.tilt.cos);
    let y2 = fetti.wobble.y + (fetti.random * fetti.tilt.sin);
    context.beginPath();
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.rotate(Math.PI / 10 * fetti.wobble.w);
    context.scale(Math.abs(x2 - x1) * fetti.scale, Math.abs(y2 - y1) * fetti.scale);
    context.arc(0, 0, 1, 0, 2 * Math.PI, true);
    context.restore();
    context.closePath();
    context.fill();
};

/**
 * Draws a square that flutters according to its tilt and wobble.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, tilt and wobble
 * @returns {void}
 */
const squareShape = (context, fetti) => {
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos);
    let x2 = fetti.wobble.x + (fetti.random * fetti.tilt.cos);
    let y2 = fetti.wobble.y + (fetti.random * fetti.tilt.sin);
    context.beginPath();
    context.moveTo(fetti.position.x, fetti.position.y);
    context.lineTo(fetti.wobble.x, fetti.position.y);
    context.lineTo(x2, y2);
    context.lineTo(x1, fetti.wobble.y);
    context.closePath();
    context.fill();
};

/**
 * Draws a five pointed star that spins and flips as it wobbles.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, scale and wobble
 * @returns {void}
 */
const starShape = (context, fetti) => {
    let rotation = (Math.PI / 2) * 3;
    let spikes = 5;
    const innerRadius = 4 * fetti.scale;
    const outerRadius = 8 * fetti.scale;
    const step = Math.PI / spikes;
    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1;
    context.beginPath();
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.rotate(Math.PI / 10 * fetti.wobble.w);
    context.scale(1, 0.25 + 0.75 * flip);
    while (spikes--) {
        context.lineTo(Math.cos(rotation) * outerRadius, Math.sin(rotation) * outerRadius);
        rotation += step;
        context.lineTo(Math.cos(rotation) * innerRadius, Math.sin(rotation) * innerRadius);
        rotation += step;
    }
    context.closePath();
    context.restore();
    context.fill();
};

/**
 * Draws a circle that spins and flips as it wobbles.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, scale and wobble
 * @returns {void}
 */
const circleShape = (context, fetti) => {
    const flip = fetti.scale > 0 ? Math.abs(fetti.wobble.y - fetti.position.y) / (10 * fetti.scale) : 1;
    context.beginPath();
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.rotate(Math.PI / 10 * fetti.wobble.w);
    context.scale(1, 0.25 + 0.75 * flip);
    context.arc(0, 0, fetti.scale * 10, 0, 2 * Math.PI);
    context.restore();
    context.closePath();
    context.fill();
};

/**
 * Draws a rectangle, wider than a square, that flutters according to its tilt and wobble.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, tilt and wobble
 * @returns {void}
 */
const rectangleShape = (context, fetti) => {
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos);
    let x2 = fetti.wobble.x + (fetti.random * fetti.tilt.cos);
    let y2 = fetti.wobble.y + (fetti.random * fetti.tilt.sin);
    context.beginPath();
    context.moveTo(fetti.position.x, fetti.position.y);
    context.lineTo(fetti.wobble.x + 12, fetti.position.y);
    context.lineTo(x2 + 12, y2);
    context.lineTo(x1, fetti.wobble.y);
    context.closePath();
    context.fill();
};

/**
 * Draws a triangle that rotates and changes proportion according to its tilt and wobble.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on, the fill style must already be set
 * @param {ConfettiProperties} fetti - Confetti piece that provides position, scale, tilt and wobble
 * @returns {void}
 */
const triangleShape = (context, fetti) => {
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos);
    let y1 = fetti.position.y + (fetti.random * fetti.tilt.sin);
    let x2 = fetti.wobble.x + (fetti.random * fetti.tilt.cos);
    let y2 = fetti.wobble.y + (fetti.random * fetti.tilt.sin);
    context.beginPath();
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.rotate(Math.PI / 10 * fetti.wobble.w);
    context.scale(Math.abs(x2 - x1) * fetti.scale, Math.abs(y2 - y1) * fetti.scale);
    context.moveTo(Math.cos(0), Math.sin(0));
    context.lineTo(Math.cos((2 * Math.PI) / 3), Math.sin((2 * Math.PI) / 3));
    context.lineTo(Math.cos((4 * Math.PI) / 3), Math.sin((4 * Math.PI) / 3));
    context.closePath();
    context.restore();
    context.fill();
};

const fettis = [];
let confettiGlobals = {
    x: 0.5,
    y: 0.7,
    z: Number.MAX_SAFE_INTEGER,
    canvas: 'confettis',
    count: 100,
    gravity: 1,
    ticks: 300,
    speed: 45,
    scale: 0.8,
    overflow: {
        left: false,
        right: false,
        top: true,
        bottom: false,
    },
    decay: 0.92,
    drift: 0,
    angle: 90,
    spread: 70,
    quiet: false,
    disableForReducedMotion: false,
    shapes: ['square', 'ellipse'],
    colors: ['#33ffdd', '#29c6ff', '#b980ff', '#ff66ff', '#ff6685', '#ffb54d', '#fcff66', '#91ff66'],
    emojis: ['🛸', '👽', '✨'],
    svgs: []
};
const canvases = new Set();
let confettiInitialized = false;
let animationFrame = null;
let lastFrameTime = null;
const FRAME_TIME = 1000 / 60;
const MAX_STEP = 3;
const shapeRenderers = {
    square: squareShape,
    ellipse: ellipseShape,
    rectangle: rectangleShape,
    circle: circleShape,
    star: starShape,
    emoji: emojiShape,
    triangle: triangleShape,
    svg: svgShape
};
/**
 * Resizes every canvas in use to the current window size. It is registered as the window `resize` listener.
 *
 * @returns {void}
 */
const resizeConfetti = () => { canvases.forEach((id) => setCanvasWindowSize(id)); };
/**
 * Starts the render loop and the window `resize` listener the first time confetti is created.
 * It does nothing on the server or if it was already started.
 *
 * @returns {void}
 */
const initConfetti = () => {
    if (isSSR)
        return;
    if (confettiInitialized)
        return;
    window.addEventListener('resize', resizeConfetti);
    animationFrame = window.requestAnimationFrame(renderConfetti);
    confettiInitialized = true;
};
/**
 * Creates a burst of confetti. The props override the global defaults, and the canvas is created
 * if it does not exist yet. It does nothing on the server, or when `disableForReducedMotion` is
 * enabled and the user prefers reduced motion.
 *
 * @param {ConfettiProps} [props] - Options of this burst (count, position, colors, shapes, physics...)
 * @returns {Promise<void>} Resolved when all the confettis of this call are gone or stopped
 */
const createConfetti = (props) => {
    var _a;
    if (isSSR)
        return Promise.resolve();
    const options = Object.assign(Object.assign({}, confettiGlobals), props);
    if (options.disableForReducedMotion && ((_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-reduced-motion: reduce)').matches))
        return Promise.resolve();
    return new Promise((resolve) => {
        const spawn = (svgs) => {
            const batch = { remaining: options.count, resolve: resolve };
            if (!canvases.has(options.canvas))
                setCanvasWindowSize(options.canvas);
            canvases.add(options.canvas);
            if (options.z < Number.MAX_SAFE_INTEGER)
                setCanvasZIndex(options.canvas, options.z);
            const position = convertPosition(options, confettiGlobals);
            const colors = convertProps(options, confettiGlobals).colors.map((color) => convertHexToRGB(color));
            for (let i = 0; i < options.count; i++) {
                fettis.push(confettiProperties(options, batch, position, colors, svgs));
            }
            if (batch.remaining <= 0)
                resolve();
            initConfetti();
        };
        const sources = convertProps(options, confettiGlobals).svgs;
        if (options.shapes.includes('svg') && sources.length > 0)
            loadSvgs(sources).then(spawn);
        else
            spawn([]);
    });
};
/**
 * Builds the initial state of a single confetti piece, resolving its random properties
 * (color, shape, emoji, launch direction, speed...).
 *
 * @param {ConfettiGlobals} options - Merged global defaults and props of the burst
 * @param {ConfettiBatch} batch - Batch of the burst the piece belongs to
 * @param {{ x: number, y: number }} position - Launch position in CSS pixels
 * @param {RGB[]} colors - Available colors, one of them is picked randomly
 * @param {HTMLImageElement[]} svgs - Loaded SVG images, one of them is picked randomly for the `svg` shape
 * @returns {ConfettiProperties} The initial properties of the confetti piece
 */
const confettiProperties = (options, batch, position, colors, svgs) => {
    const props = convertProps(options, confettiGlobals);
    const color = colors[Math.floor(randomNumber(0, colors.length))];
    const radius = {
        angle: props.angle * (Math.PI / 180),
        spread: props.spread * (Math.PI / 180)
    };
    return {
        canvas: options.canvas,
        batch: batch,
        random: Math.random() + 2,
        angle2d: -radius.angle + ((0.5 * radius.spread) - (Math.random() * radius.spread)),
        opacity: props.ticks >= 0,
        progress: props.ticks,
        lifetime: props.ticks,
        wobble: {
            w: Math.random() * 10,
            x: 0,
            y: 0,
            speed: Math.min(0.11, Math.random() * 0.1 + 0.05)
        },
        tilt: {
            angle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
            sin: 0,
            cos: 0
        },
        shape: props.shapes[Math.floor(randomNumber(0, props.shapes.length))],
        emoji: props.emojis[Math.floor(randomNumber(0, props.emojis.length))],
        svg: svgs[Math.floor(randomNumber(0, svgs.length))],
        tick: 0,
        gravity: props.gravity * 3,
        speed: (props.speed * 0.5) + (Math.random() * props.speed),
        drift: props.drift,
        decay: props.decay,
        scale: props.scale,
        quiet: props.quiet,
        overflow: props.overflow,
        color: {
            r: color.r,
            g: color.g,
            b: color.b
        },
        position: {
            x: position.x,
            y: position.y
        }
    };
};
/**
 * Advances the physics of a confetti piece (movement, speed decay, tilt and wobble) and
 * updates its progress. In `quiet` mode the tilt and wobble animation is disabled.
 *
 * @param {ConfettiProperties} fetti - Confetti piece to update, it is modified in place
 * @param {number} step - Elapsed time measured in frames of 60 per second since the last update
 * @returns {void}
 */
const updateConfetti = (fetti, step) => {
    fetti.position.x += (Math.cos(fetti.angle2d) * fetti.speed + fetti.drift) * step;
    fetti.position.y += (Math.sin(fetti.angle2d) * fetti.speed + fetti.gravity) * step;
    fetti.speed *= Math.pow(fetti.decay, step);
    if (fetti.quiet) {
        fetti.tilt.sin = 0;
        fetti.tilt.cos = 0;
        fetti.random = 1;
        fetti.wobble.w = 0;
        fetti.wobble.x = fetti.position.x + (10 * fetti.scale);
        fetti.wobble.y = fetti.position.y + (10 * fetti.scale);
    }
    else {
        fetti.tilt.angle += 0.1 * step;
        fetti.tilt.sin = Math.sin(fetti.tilt.angle);
        fetti.tilt.cos = Math.cos(fetti.tilt.angle);
        fetti.random = Math.random() + 2;
        fetti.wobble.w += fetti.wobble.speed * step;
        fetti.wobble.x = fetti.position.x + ((10 * fetti.scale) * Math.cos(fetti.wobble.w));
        fetti.wobble.y = fetti.position.y + ((10 * fetti.scale) * Math.sin(fetti.wobble.w));
    }
    fetti.progress = fetti.tick / fetti.lifetime;
    fetti.tick += step;
};
/**
 * Draws a confetti piece on the canvas, using its color (fading out over its lifetime when it has
 * opacity) and the renderer of its shape.
 *
 * @param {CanvasRenderingContext2D} context - Canvas context to draw on
 * @param {ConfettiProperties} fetti - Confetti piece to draw
 * @returns {void}
 */
const createConfettiShape = (context, fetti) => {
    var _a;
    fetti.opacity ?
        (context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - fetti.progress) + ')') :
        (context.fillStyle = 'rgb(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ')');
    (_a = shapeRenderers[fetti.shape]) === null || _a === void 0 ? void 0 : _a.call(shapeRenderers, context, fetti);
};
/**
 * Marks a confetti piece as finished in its batch, resolving the promise of the call
 * when it was the last one.
 *
 * @param {ConfettiProperties} fetti - Confetti piece that is gone or stopped
 * @returns {void}
 */
const releaseConfetti = (fetti) => {
    if (--fetti.batch.remaining <= 0)
        fetti.batch.resolve();
};
/**
 * Render loop callback. It updates every confetti piece, removes the ones that are out of bounds
 * or finished, clears unused canvases, draws the remaining ones and schedules the next frame.
 * The loop is stopped when there is no confetti left.
 *
 * @param {number} time - Timestamp of the frame, provided by `requestAnimationFrame`
 * @returns {void}
 */
const renderConfetti = (time) => {
    var _a, _b, _c, _d;
    const step = lastFrameTime === null ? 1 : Math.min((time - lastFrameTime) / FRAME_TIME, MAX_STEP);
    lastFrameTime = time;
    fettis.forEach((fetti) => updateConfetti(fetti, step));
    const sizes = new Map();
    canvases.forEach((id) => sizes.set(id, getCanvasSize(getCanvas(id))));
    for (let index = fettis.length - 1; index >= 0; index--) {
        const fetti = fettis[index];
        const size = sizes.get(fetti.canvas);
        const gone = (!((_a = fetti.overflow) === null || _a === void 0 ? void 0 : _a.left) && fetti.position.x < 0) ||
            (!((_b = fetti.overflow) === null || _b === void 0 ? void 0 : _b.right) && fetti.position.x > size.width) ||
            (!((_c = fetti.overflow) === null || _c === void 0 ? void 0 : _c.top) && fetti.position.y < 0) ||
            (!((_d = fetti.overflow) === null || _d === void 0 ? void 0 : _d.bottom) && fetti.position.y > size.height) ||
            fetti.progress >= 1;
        if (gone) {
            fettis.splice(index, 1);
            releaseConfetti(fetti);
        }
    }
    if (fettis.length === 0) {
        stop();
        return;
    }
    const used = new Set(fettis.map((fetti) => fetti.canvas));
    canvases.forEach((id) => {
        if (used.has(id))
            return;
        clearCanvas(id);
        canvases.delete(id);
    });
    const contexts = new Map();
    canvases.forEach((id) => contexts.set(id, getCanvasContext(id)));
    fettis.forEach((fetti) => createConfettiShape(contexts.get(fetti.canvas), fetti));
    animationFrame = window.requestAnimationFrame(renderConfetti);
};
/**
 * Stops the confetti and clears the canvas. When a canvas is given, only its confettis are stopped
 * and the render loop keeps running while other canvases are still in use. The promises of the
 * stopped confettis are resolved. It does nothing on the server.
 *
 * @param {string} [canvas] - Id of the canvas to stop, by default all of them
 * @returns {void}
 */
const stop = (canvas) => {
    if (isSSR)
        return;
    if (canvas !== undefined) {
        if (!canvases.has(canvas))
            return;
        for (let index = fettis.length - 1; index >= 0; index--) {
            if (fettis[index].canvas !== canvas)
                continue;
            releaseConfetti(fettis[index]);
            fettis.splice(index, 1);
        }
        clearCanvas(canvas);
        canvases.delete(canvas);
        if (canvases.size > 0)
            return;
    }
    if (animationFrame !== null)
        window.cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resizeConfetti);
    fettis.forEach((fetti) => fetti.batch.resolve());
    fettis.length = 0;
    canvases.forEach((id) => clearCanvas(id));
    canvases.clear();
    confettiInitialized = false;
    animationFrame = null;
    lastFrameTime = null;
};

export { createConfetti as create, stop };
