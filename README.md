![Confettis](https://i.imgur.com/kpJt6R7.png)

[![NPM](https://img.shields.io/npm/v/confettis.svg)](https://www.npmjs.com/package/confettis)
[![GitHub Issues](https://img.shields.io/github/issues/sizoroot/confettis)](https://github.com/sizoroot/confettis/issues)
[![GitHub Tag](https://img.shields.io/github/tag/sizoroot/confettis.svg)](https://github.com/sizoroot/confettis/tags)
[![GitHub Commits](https://img.shields.io/github/commit-activity/t/sizoroot/confettis)](https://github.com/sizoroot/confettis/commits/main/)
[![GitHub License](https://img.shields.io/github/license/sizoroot/confettis)](https://github.com/sizoroot/confettis/blob/main/LICENSE)

# 🎉 Confettis v0.3.8

Confettis is a small lib to add confettis to your website. Yep, confettis! 🎉

* 😊 SSR Support
* 🎉 Common confettis
* 👽 Emoji coffetis
* ⭐️ Star confettis
* 🟡 Circle confettis (snow?)
* ✨ Confettis with different sizes
* 🗿 Static or moving confettis
* 😄 Super easy to use!

### Demo
[confettis.sizo.dev](https://confettis.sizo.dev)

### Resources
- [Documentation](https://confettis.sizo.dev/docs)
- [Changelog](https://github.com/sizoroot/confettis/blob/main/CHANGELOG.md)

## Installation

Browser:
```html
<script src="https://cdn.jsdelivr.net/npm/confettis@0.3.8/lib/confettis.min.js"></script>
```

Deno:
```js
import * as confetti from 'https://esm.sh/confettis@0.3.8'
```

Node:
```sh
$ npm i confettis
```
```js
import * as confetti from 'confettis'
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

This is just an example, but you can do anything. I recommend you look at the examples I have put on the web! See more examples [here](https://confettis.ovni.dev)!

## Parameters

When creating a new confetti you can change the parameters to change the position, particle count, angle, gravity, etc.

| Option | Type | Default | Description |
| :---: | :---: | :---: | --- |
| `canvas` | `string` | confettis | Id of canvas where you are going to show the confetti. If you do not put anything, a canvas will be created with id "confettis". |
| `count` | `number` | 100 | Number of confetti to launch. Remember that the more particles the web performance will be worse. The recommended is between 1 and 300 particles per second. |
| `x` | `number` | 0.5 | The X position is horizontal, being 0 the left edge and 1 the right edge. |
| `y` | `number` | 0.7 | The Y position is vertical, being 0 the upper edge and 1 the lower edge. |
| `z` | `number` | MAX_SAFE_INTEGER | The Z position on the page (z-index). Determine whether it is shown above or below other web elements. The higher the number, it will be shown above all (recommended). Default is Number.MAX_SAFE_INTEGER (2147483647) to overcome the height of most popular UI libs. |
| `gravity` | `number` or `[number]` | 1 | Gravity determine how quickly the confetti will fall. You can play with this parameter to make it fall faster or slower, and you can even make the confetti rise up. |
| `ticks` | `number` or `[number]` | 300 | Time that confetti will take to disappear (opacity). The higher the number, it will take longer to disappear. Put it in -1 to deactivate it and make it always visible. |
| `speed` | `number` or `[number]` | 45 | Speed with which the confetti will begin to move. |
| `scale` | `number` or `[number]` | 0.8 | Scale factor for each confetti particle. Use decimals to make the confetti smaller. Example: [ 0.8, 1, 1.3 ] |
| `overflow` | `object` |  | Prarameter to allow confetti particle exceed the canvas without being deleted |
| `overflow`.`left` | `boolean` | false | When set to `true` allows the left overflow |
| `overflow`.`right` | `boolean` | false | When set to `true` allows the right overflow |
| `overflow`.`top` | `boolean` | true | When set to `true` allows the top overflow |
| `overflow`.`bottom` | `boolean` | false | When set to `true` allows the bottom overflow |
| `decay` | `number` | 0.92 | Determine the speed with which the confetti will lose speed. Keep this number between 0 and 1 so that the confetti does not go to the speed of light. |
| `drift` | `number` | 0 | Determine the side where the confetti will go. 0 indicates that it will fall down. A negative number indicates that it will go to the left, and a positive number indicates that it will go to the right. |
| `angle` | `number` | 90 | The angle at which the confetti is going to be released. In degrees (0-360) |
| `spread` | `number` | 70 | How far the confetti can come. In degrees (0-360) |
| `quiet` | `boolean` | false | It allows to create static confetti. Perfect if you want `square` or ` ellipse` confetti without moving when falling. |
| `colors` | `[string]` |  | Array with strings of the colors you want to show the confetti. The colors must be in Hex format (#ffffff). |
| `shapes` | `[string]` |  | An array of shapes for the confetti. |
| `emojis` | `[string]` |  | An array of emojis for the confetti. |


Accepted shapes

| Shape | Description |
| :---: | --- |
| `square` | Create common square confetti. |
| `ellipse` | Create confetti in the form of ellipse. |
| `circle` | Create confetti in the form of a circle. |
| `star` | Create confetti in the form of star with five spikes. |
| `emoji` | Create confetti with emojis. |


## Contributors
All issue reports, feature requests, pull requests and github stars are welcomed and much appreciated.

## Thanks
Special thanks to catdad for [canvas-confetti](https://github.com/catdad/canvas-confetti). I have created this project as inspiration to obtain a cleaner and legible code in typescript, and add extra functions.
