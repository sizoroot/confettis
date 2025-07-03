/*
 *
 *  🎉 Confettis v0.3.8
 *  https://github.com/sizoroot/confettis
 *
 *  (c) 2025 Lucas O. S.
 *  Confettis may be freely distributed under the MIT license.
 *
*/

'use strict';

/**
 * Create new canvas element
 *
 * @return {HTMLCanvasElement} HTMLCanvasElement
 */
const createCanvas = (id = "confettis") => {
    const canvas = document.createElement("canvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
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
 * Set canvas z-index
 *
 * @param {string} id `string` Default "confettis"
 * @param {string} z `string` Default Number.MAX_SAFE_INTEGER (2147483647)
 * @return {HTMLCanvasElement}  HTMLCanvasElement
 */
const setCanvasZIndex = (id = "confettis", z = Number.MAX_SAFE_INTEGER) => {
    let canvas = document.getElementById(id);
    canvas.style.zIndex = `${z}`;
};
/**
 * Get canvas confetti
 *
 * @param {string} id `string` Default "confettis"
 * @return {HTMLCanvasElement}  HTMLCanvasElement
 */
const getCanvas = (id = "confettis") => {
    let canvas = document.getElementById(id);
    if (!canvas)
        canvas = createCanvas(id);
    return canvas;
};
/**
 * Set canvas window size
 *
 * @return {void} void
 */
const setCanvasWindowSize = (id = "confettis") => {
    const canvas = getCanvas(id);
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
};
/**
 * Get canvas positions
 *
 * @return {void} void
 */
const getCanvasPos = (data) => {
    const id = data ? data.id ? data.id : 'confettis' : 'confettis';
    const x = data ? data.x ? data.x : 0.5 : 0.5;
    const y = data ? data.y ? data.y : 0.5 : 0.5;
    const canvas = getCanvas(id);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasX = Math.max(0, Math.min(x * canvasWidth, canvasWidth));
    const canvasY = Math.max(0, Math.min(y * canvasHeight, canvasHeight));
    return {
        x: canvasX,
        y: canvasY
    };
};

/**
 * Generate random number between two numbers (min/max)
 */
const randomNumber = (min, max) => Math.random() * (max - min) + min;
/**
 * Convert hex format to RGB for opacity support (RGBA)
 */
const convertHexToRGB = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
/**
 * Is SSR is a way to check if the function are running on the server.
 * When rendering on server there is no window.requestAnimationFrame(),
 * and if so we deactivate the lib so that it is not executed.
 */
const isSSR = (() => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined')
        return true;
    return false;
})();
/**
 * Checking if the parameter is a number.
 */
const isNumber = (param) => {
    return typeof param === 'number';
};
/**
 * Checks if there is a prop and if there isn't then returns a default value.
 */
const convertProps = (props, globals) => {
    let x, y, colors, shapes, emojis, angle, spread, gravity, speed, ticks, drift, decay, scale, quiet, overflow;
    if (props) {
        if (props.canvas) {
            if (props.x) {
                x = getCanvasPos({ id: props.canvas, x: props.x }).x;
            }
            else {
                x = getCanvasPos({ id: props.canvas, x: globals.x }).x;
            }
            if (props.y) {
                y = getCanvasPos({ id: props.canvas, y: props.y }).y;
            }
            else {
                y = getCanvasPos({ id: props.canvas, y: globals.y }).y;
            }
        }
        else {
            if (props.x) {
                x = getCanvasPos({ x: props.x }).x;
            }
            else {
                x = getCanvasPos({ x: globals.x }).x;
            }
            if (props.y) {
                y = getCanvasPos({ y: props.y }).y;
            }
            else {
                y = getCanvasPos({ y: globals.y }).y;
            }
        }
    }
    colors = props ? props.colors ? props.colors : globals.colors : globals.colors;
    shapes = props ? props.shapes ? props.shapes : globals.shapes : globals.shapes;
    emojis = props ? props.emojis ? props.emojis : globals.emojis : globals.emojis;
    gravity = props ? props.gravity ? isNumber(props.gravity) ? props.gravity : props.gravity[Math.floor(randomNumber(0, props.gravity.length))] : globals.gravity : globals.gravity;
    scale = props ? props.scale ? isNumber(props.scale) ? props.scale : props.scale[Math.floor(randomNumber(0, props.scale.length))] : globals.scale : globals.scale;
    speed = props ? props.speed ? isNumber(props.speed) ? props.speed : props.speed[Math.floor(randomNumber(0, props.speed.length))] : globals.speed : globals.speed;
    overflow = {
        left: props ? props.overflow ? props.overflow.left ? props.overflow.left : globals.overflow.left : globals.overflow.left : globals.overflow.left,
        right: props ? props.overflow ? props.overflow.right ? props.overflow.right : globals.overflow.right : globals.overflow.right : globals.overflow.right,
        top: props ? props.overflow ? props.overflow.top ? props.overflow.top : globals.overflow.top : globals.overflow.top : globals.overflow.top,
        bottom: props ? props.overflow ? props.overflow.bottom ? props.overflow.bottom : globals.overflow.bottom : globals.overflow.bottom : globals.overflow.bottom
    };
    spread = props ? props.spread ? props.spread : globals.spread : globals.spread;
    angle = props ? props.angle ? props.angle : globals.angle : globals.angle;
    ticks = props ? props.ticks ? props.ticks : globals.ticks : globals.ticks;
    drift = props ? props.drift ? props.drift : globals.drift : globals.drift;
    decay = props ? props.decay ? props.decay : globals.decay : globals.decay;
    quiet = props ? props.quiet ? props.quiet : globals.quiet : globals.quiet;
    return {
        x,
        y,
        colors,
        shapes,
        emojis,
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

/**
 * Emoji Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const emojiShape = (context, fetti) => {
    context.beginPath();
    context.font = (fetti.scale * 100) + 'px serif';
    context.fillText(fetti.emoji, fetti.position.x, fetti.position.y);
    context.restore();
    context.closePath();
    context.fill();
};

/**
 * Ellipse Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const ellipseShape = (context, fetti) => {
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos);
    let y1 = fetti.position.y + (fetti.random * fetti.tilt.sin);
    let x2 = fetti.wabble.x + (fetti.random * fetti.tilt.cos);
    let y2 = fetti.wabble.y + (fetti.random * fetti.tilt.sin);
    context.beginPath();
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.rotate(Math.PI / 10 * fetti.wabble.w);
    context.scale(Math.abs(x2 - x1) * fetti.scale, Math.abs(y2 - y1) * fetti.scale);
    context.arc(0, 0, 1, 0, 2 * Math.PI, true);
    context.restore();
    context.closePath();
    context.fill();
};

/**
 * Square Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const squareShape = (context, fetti) => {
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos);
    let x2 = fetti.wabble.x + (fetti.random * fetti.tilt.cos);
    let y2 = fetti.wabble.y + (fetti.random * fetti.tilt.sin);
    context.beginPath();
    context.moveTo(fetti.position.x, fetti.position.y);
    context.lineTo(fetti.wabble.x, fetti.position.y);
    context.lineTo(x2, y2);
    context.lineTo(x1, fetti.wabble.y);
    context.closePath();
    context.fill();
};

/**
 * Star Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const starShape = (context, fetti) => {
    var rotation = (Math.PI / 2) * 3;
    var spikes = 5;
    const innerRadius = 4 * fetti.scale;
    const outerRadius = 8 * fetti.scale;
    const step = Math.PI / spikes;
    context.beginPath();
    while (spikes--) {
        const x1 = fetti.position.x + (Math.cos(rotation) * outerRadius);
        const y1 = fetti.position.y + (Math.sin(rotation) * outerRadius);
        context.lineTo(x1, y1);
        rotation += step;
        const x2 = fetti.position.x + (Math.cos(rotation) * innerRadius);
        const y2 = fetti.position.y + (Math.sin(rotation) * innerRadius);
        context.lineTo(x2, y2);
        rotation += step;
    }
    context.closePath();
    context.fill();
};

/**
 * Circle Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const circleShape = (context, fetti) => {
    context.beginPath();
    context.save();
    context.translate(fetti.position.x, fetti.position.y);
    context.arc(0, 0, fetti.scale * 10, 0, 2 * Math.PI);
    context.restore();
    context.closePath();
    context.fill();
};

/**
 * Rectangle Shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const rectangleShape = (context, fetti) => {
    let x1 = fetti.position.x + (fetti.random * fetti.tilt.cos);
    let x2 = fetti.wabble.x + (fetti.random * fetti.tilt.cos);
    let y2 = fetti.wabble.y + (fetti.random * fetti.tilt.sin);
    context.beginPath();
    context.moveTo(fetti.position.x, fetti.position.y);
    context.lineTo(fetti.wabble.x + 10, fetti.position.y);
    context.lineTo(x2 + 10, y2);
    context.lineTo(x1, fetti.wabble.y);
    context.closePath();
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
    shapes: ['square', 'ellipse'],
    colors: ['#33ffdd', '#29c6ff', '#b980ff', '#ff66ff', '#ff6685', '#ffb54d', '#fcff66', '#91ff66'],
    emojis: ['🛸', '👽', '✨']
};
let fettiGlobals = confettiGlobals;
let confettiInitialized = false;
let animationFrame = null;
const initConfetti = () => {
    if (isSSR)
        return;
    if (confettiInitialized)
        return;
    window.addEventListener('resize', () => { setCanvasWindowSize(fettiGlobals.canvas); });
    animationFrame = window.requestAnimationFrame(renderConfetti);
    confettiInitialized = true;
};
/**
 * Create confetti
 *
 * @return {void}
 */
const createConfetti = (props) => {
    if (isSSR)
        return;
    fettiGlobals = Object.assign(Object.assign({}, confettiGlobals), props);
    let count = fettiGlobals.count;
    for (let i = 0; i < count; i++) {
        fettis.push(confettiProperties());
    }
    initConfetti();
};
/**
 * Confetti properties
 *
 * @return {void}
 */
const confettiProperties = () => {
    let props = convertProps(fettiGlobals, confettiGlobals);
    let color = convertHexToRGB(props.colors[Math.floor(randomNumber(0, props.colors.length))]);
    let emoji = props.emojis[Math.floor(randomNumber(0, props.emojis.length))];
    let shape = props.shapes[Math.floor(randomNumber(0, props.shapes.length))];
    let radius = {
        angle: props.angle * (Math.PI / 180),
        spread: props.spread * (Math.PI / 180)
    };
    let random = Math.random() + 2;
    let angle2d = -radius.angle + ((0.5 * radius.spread) - (Math.random() * radius.spread));
    let tilt = {
        angle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
        sin: 0,
        cos: 0
    };
    let gravity = props.gravity * 3;
    let scale = props.scale;
    let speed = (props.speed * 0.5) + (Math.random() * props.speed);
    let opacity = isNumber(props.ticks) ? props.ticks >= 0 : props.ticks[Math.floor(randomNumber(0, props.ticks.length))] >= 0;
    let progress = isNumber(props.ticks) ? props.ticks : props.ticks[Math.floor(randomNumber(0, props.ticks.length))];
    let ticks = 0;
    let drift = props.drift;
    let decay = props.decay;
    let quiet = props.quiet;
    let overflow = props.overflow;
    let x = props.x;
    let y = props.y;
    let wabble = {
        w: Math.random() * 10,
        speed: Math.min(0.11, Math.random() * 0.1 + 0.05),
        x: 0,
        y: 0
    };
    return {
        random: random,
        angle2d: angle2d,
        opacity: opacity,
        progress: progress,
        wabble: {
            w: wabble.w,
            x: wabble.x,
            y: wabble.y,
            speed: wabble.speed
        },
        tilt: {
            angle: tilt.angle,
            sin: tilt.sin,
            cos: tilt.cos
        },
        shape: shape,
        emoji: emoji,
        tick: ticks,
        gravity: gravity,
        speed: speed,
        drift: drift,
        decay: decay,
        scale: scale,
        quiet: quiet,
        overflow: overflow,
        color: {
            r: color.r,
            g: color.g,
            b: color.b
        },
        position: {
            x: x,
            y: y
        },
        update: function () {
            this.position.x += Math.cos(this.angle2d) * this.speed + this.drift;
            this.position.y += Math.sin(this.angle2d) * this.speed + this.gravity;
            this.speed *= this.decay;
            if (this.quiet) {
                this.tilt.sin = 0;
                this.tilt.cos = 0;
                this.random = 1;
                this.wabble.w = 0;
                this.wabble.x = this.position.x + (10 * scale);
                this.wabble.y = this.position.y + (10 * scale);
            }
            else {
                this.tilt.angle += 0.1;
                this.tilt.sin = Math.sin(this.tilt.angle);
                this.tilt.cos = Math.cos(this.tilt.angle);
                this.random = Math.random() + 2;
                this.wabble.w += this.wabble.speed;
                this.wabble.x = this.position.x + ((10 * scale) * Math.cos(this.wabble.w));
                this.wabble.y = this.position.y + ((10 * scale) * Math.sin(this.wabble.w));
            }
            this.progress = (this.tick++) / progress;
        }
    };
};
/**
 *  Create confetti shape
 *
 * @param {CanvasRenderingContext2D} context
 * @param {ConfettiProperties} fetti
 */
const createConfettiShape = (context, fetti) => {
    fetti.opacity ?
        (context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - fetti.progress) + ')') :
        (context.fillStyle = 'rgb(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ')');
    if (fetti.shape == 'square')
        squareShape(context, fetti);
    if (fetti.shape == 'ellipse')
        ellipseShape(context, fetti);
    if (fetti.shape == 'rectangle')
        rectangleShape(context, fetti);
    if (fetti.shape == 'circle')
        circleShape(context, fetti);
    if (fetti.shape == 'star')
        starShape(context, fetti);
    if (fetti.shape == 'emoji')
        emojiShape(context, fetti);
};
/**
 * Render confetti
 *
 * @return {void}
 */
const renderConfetti = () => {
    const canvas = getCanvas(fettiGlobals.canvas);
    if (!canvas)
        return;
    const context = canvas.getContext("2d");
    if (fettiGlobals.z < Number.MAX_SAFE_INTEGER)
        setCanvasZIndex(canvas.id, fettiGlobals.z);
    context.clearRect(0, 0, canvas.width, canvas.height);
    fettis.forEach((fetti) => {
        fetti.update();
        createConfettiShape(context, fetti);
    });
    fettis.forEach((fetti, index) => {
        var _a, _b, _c, _d;
        if (!((_a = fetti.overflow) === null || _a === void 0 ? void 0 : _a.left) && fetti.position.x < 0)
            fettis.splice(index, 1);
        if (!((_b = fetti.overflow) === null || _b === void 0 ? void 0 : _b.right) && fetti.position.x > canvas.width)
            fettis.splice(index, 1);
        if (!((_c = fetti.overflow) === null || _c === void 0 ? void 0 : _c.top) && fetti.position.y < 0)
            fettis.splice(index, 1);
        if (!((_d = fetti.overflow) === null || _d === void 0 ? void 0 : _d.bottom) && fetti.position.y > canvas.height)
            fettis.splice(index, 1);
        if (fetti.progress >= 1)
            fettis.splice(index, 1);
    });
    animationFrame = window.requestAnimationFrame(renderConfetti);
};
/**
 * Reset confetti
 *
 * @return {void}
 */
const reset = () => {
    if (confettiInitialized && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        confettiInitialized = false;
        animationFrame = null;
    }
};

exports.create = createConfetti;
exports.reset = reset;
