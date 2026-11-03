![Confettis](https://i.imgur.com/o9efxRG.png)

[![NPM](https://img.shields.io/npm/v/confettis.svg)](https://www.npmjs.com/package/confettis)
[![GitHub Issues](https://img.shields.io/github/issues/sizoroot/confettis)](https://github.com/sizoroot/confettis/issues)
[![GitHub Tag](https://img.shields.io/github/tag/sizoroot/confettis.svg)](https://github.com/sizoroot/confettis/tags)
[![GitHub Commits](https://img.shields.io/github/commit-activity/t/sizoroot/confettis)](https://github.com/sizoroot/confettis/commits/main/)
[![GitHub License](https://img.shields.io/github/license/sizoroot/confettis)](https://github.com/sizoroot/confettis/blob/main/LICENSE)

# 🎉 Confettis v0.5.1

Confettis is a tiny, dependency-free library to add confetti to your website. Yep, confettis! 🎉

* 😊 SSR support (safe to import on the server, it does nothing there)
* 🎉 Common shapes: square, rectangle, triangle, ellipse and circle
* 👽 Emoji confetti
* 🖼️ SVG confetti
* ⭐️ Star confetti
* 🟡 Circle confetti (snow?)
* ✨ Different sizes, colors, speeds and gravity
* 🗿 Static or moving confetti
* ⚡️ Smooth on any screen: same speed at 60, 120 or 144 Hz, and the animation loop sleeps when there are no confettis
* 🔍 Sharp on high density (retina) screens
* 🖼️ Multiple canvases at the same time
* 🧩 Written in TypeScript, types included
* 😄 Super easy to use!

### Demo
[confettis.sizo.dev](https://confettis.sizo.dev)

### Resources
- [Changelog](https://github.com/sizoroot/confettis/blob/main/CHANGELOG.md)
- [Examples](https://confettis.sizo.dev)
- [Issues](https://github.com/sizoroot/confettis/issues)

## Installation

Browser:
```html
<script src="https://cdn.jsdelivr.net/npm/confettis@0.5.1/lib/confettis.min.js"></script>
<script>
    confetti.create()
</script>
```

Node / bundlers:
```sh
npm install confettis
```
```sh
pnpm install confettis
```
```js
import * as confetti from 'confettis'
// or
import { create, stop } from 'confettis'
```

## Usage

### Basic usage
```js
confetti.create()
```

### Advanced usage
```js
confetti.create({
    x: 0.5,
    y: 0.7,
    count: 500,
    ticks: -1,
    gravity: [ 0.7, 1.2 ],
    speed: [ 35, 45 ],
    scale: [ 0.7, 0.8 ],
    decay: 0.91,
    shapes: [ 'square', 'ellipse' ]
})
```

This is just an example, but you can do anything. See more examples [here](https://confettis.sizo.dev)!

### Emoji confetti
```js
confetti.create({
    shapes: [ 'emoji' ],
    emojis: [ '🎉', '🥳', '🎈' ]
})
```

### SVG confetti
```js
confetti.create({
    shapes: [ 'svg' ],
    svgs: [
        '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#ff6685"/></svg>', // markup
        '/images/logo.svg' // or a URL
    ]
})
```

### Confetti on click
```js
button.addEventListener('click', (event) => {
    confetti.create({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
        count: 80
    })
})
```

### Stop confetti

Stops all animations and clears all confetti, in every canvas. It is not needed to wait for the confettis to finish: when there are none left, the animation stops by itself and starts again with the next `create`.

```js
confetti.stop()
```

To stop only the confettis of one canvas, pass its id:

```js
confetti.stop('my-canvas')
```

### Wait for the confettis

`create` returns a promise that is resolved when all the confettis of that call are gone (or stopped), so you can chain actions after the animation:

```js
await confetti.create({ count: 150 })
console.log('The party is over 🎉')
```

### Reduced motion

If you want to respect users who prefer reduced motion, use `disableForReducedMotion`. When their system has `prefers-reduced-motion: reduce`, `create` does nothing (and its promise is resolved right away):

```js
confetti.create({ disableForReducedMotion: true })
```

### Custom canvas

By default, a full-screen canvas with id `confettis` is created for you. To use your own, pass the id of an existing canvas:

```html
<canvas id="my-canvas"></canvas>
```
```js
confetti.create({ canvas: 'my-canvas' })
```

The canvas is resized to fit the window and it is cleared when its confettis are gone.

### Multiple canvases

Each call keeps its own `canvas` and `z`, so you can use several canvases at the same time (for example, one behind and one above your content):

```js
confetti.create({ canvas: 'behind', z: 0 })
confetti.create({ canvas: 'above', z: 100 })
```

### Server-side rendering

`create` and `stop` do nothing when there is no `window`, so you can call them from SSR frameworks without extra checks. Just make sure they are triggered by something that runs in the browser (an event handler, `useEffect`, `onMounted`, etc.).

## Parameters

When creating a new confetti you can change the parameters to change the position, particle count, angle, gravity, etc.

| Option | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `canvas` | `string` | `"confettis"` | Id of canvas where you are going to show the confetti. If you do not put anything, a canvas will be created with id "confettis". |
| `count` | `number` | 100 | Number of confetti to launch. Remember that the more particles the web performance will be worse. The recommended is between 1 and 300 particles per second. |
| `x` | `number` | 0.5 | The X position is horizontal and relative to the canvas, being 0 the left edge and 1 the right edge. |
| `y` | `number` | 0.7 | The Y position is vertical and relative to the canvas, being 0 the upper edge and 1 the lower edge. |
| `z` | `number` | `Number.MAX_SAFE_INTEGER` | The Z position on the page (z-index) of the canvas. Determine whether it is shown above or below other web elements. The higher the number, it will be shown above all (recommended). Default is Number.MAX_SAFE_INTEGER (2147483647) to overcome the height of most popular UI libs. |
| `gravity` | `number` or `number[]` | 1 | Gravity determine how quickly the confetti will fall. You can play with this parameter to make it fall faster or slower, and you can even make the confetti rise up. |
| `ticks` | `number` or `number[]` | 300 | Time that confetti will take to disappear (opacity), measured in frames at 60 frames per second (300 are 5 seconds), whatever the refresh rate of the screen is. The higher the number, it will take longer to disappear. Put it in -1 to deactivate it and make it always visible. |
| `speed` | `number` or `number[]` | 45 | Speed with which the confetti will begin to move. |
| `scale` | `number` or `number[]` | 0.8 | Scale factor for each confetti particle. Use decimals to make the confetti smaller. Example: [ 0.8, 1, 1.3 ] |
| `overflow` | `object` | | Allows confetti particles to exceed the canvas edges without being removed |
| `overflow`.`left` | `boolean` | false | When set to `true` allows the left overflow |
| `overflow`.`right` | `boolean` | false | When set to `true` allows the right overflow |
| `overflow`.`top` | `boolean` | true | When set to `true` allows the top overflow |
| `overflow`.`bottom` | `boolean` | false | When set to `true` allows the bottom overflow |
| `decay` | `number` | 0.92 | Determine the speed with which the confetti will lose speed. Keep this number between 0 and 1 so that the confetti does not go to the speed of light. |
| `drift` | `number` | 0 | Determine the side where the confetti will go. 0 indicates that it will fall down. A negative number indicates that it will go to the left, and a positive number indicates that it will go to the right. |
| `angle` | `number` | 90 | The angle at which the confetti is going to be released. In degrees (0-360) |
| `spread` | `number` | 70 | How far the confetti can come. In degrees (0-360) |
| `quiet` | `boolean` | false | It allows to create static confetti. Perfect if you want `square` or `ellipse` confetti without moving when falling. |
| `disableForReducedMotion` | `boolean` | false | When set to `true`, no confetti is created if the user prefers reduced motion (`prefers-reduced-motion: reduce`). |
| `colors` | `string[]` | 8 bright colors | Array with strings of the colors you want to show the confetti. The colors must be in Hex format (#ffffff). |
| `shapes` | `Shapes[]` | `[ 'square', 'ellipse' ]` | An array of shapes for the confetti. Only the accepted shapes below are valid, TypeScript will warn you about the others. |
| `emojis` | `string[]` | `[ '🛸', '👽', '✨' ]` | An array of emojis used by the `emoji` shape. |
| `svgs` | `string[]` | `[]` | An array of SVGs used by the `svg` shape. Each item can be SVG markup (`<svg ...>`) or a URL / data URI. The SVGs are loaded before the confetti is created, and the ones that fail to load are ignored. They keep their own colors and should have a `viewBox` or a `width` and `height`. |


### Accepted shapes

| Shape | Description |
| :---: | --- |
| `square` | Create confetti in the form of square. |
| `triangle` | Create confetti in the form of triangle. |
| `rectangle` | Create confetti in the form of rectangle. |
| `ellipse` | Create confetti in the form of ellipse. |
| `circle` | Create confetti in the form of a circle. |
| `star` | Create confetti in the form of star with five spikes. |
| `emoji` | Create confetti with emojis. |
| `svg` | Create confetti with your own SVGs (see `svgs`). |

> When a parameter accepts `number[]`, one random value from the array is picked for each particle.

> `0` and `false` are valid values (for example `x: 0`, `gravity: 0` or `quiet: false`), they are not replaced by the defaults.

## Development

This project uses [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm run build
```

The build generates the CJS, ESM, UMD and minified bundles and the type definitions in `lib/`.

### Tests

Tests use [Vitest](https://vitest.dev) (with jsdom), including type tests for the options.

```sh
pnpm test
pnpm run test:watch
```

## Contributors
All issue reports, feature requests, pull requests and github stars are welcomed and much appreciated.

## Thanks
Special thanks to catdad for [canvas-confetti](https://github.com/catdad/canvas-confetti). I have created this project as inspiration to obtain a cleaner and legible code in typescript, and add extra functions.
