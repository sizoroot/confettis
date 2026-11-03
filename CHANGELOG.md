# Changelog

Release 3 nov 2026

### 0.5.1

  * Added tests and a test page
  * Update dev dependencies
  * Removed Deno instalation on README.md (obsolete runtime)
  * Added CI workflow (typecheck, tests and build) and `typecheck` script
  * Added movement to the `emoji` shape, now it spins and flips like the other shapes (disabled with `quiet`)
  * Added `svg` shape and `svgs` option, to create confetti with SVG markup or URLs
  * Added `disableForReducedMotion` option to not create confettis when the user prefers reduced motion
  * Added support for high density screens, canvas is sharp now
  * Fixed confettis being skipped (or others removed) when several leave the screen or expire in the same frame
  * Fixed `0` and `false` values being ignored (`x`, `y`, `gravity`, `drift`, `angle`, `spread`, `decay`, `quiet` and `overflow`)
  * Fixed `ticks` as a list, now the fade out and the lifetime of each confetti use the same value
  * Fixed types, added `triangle` to the shapes type and `shapes` now only accepts valid shapes
  * Fixed `resize` listener being added again each time confettis were created after `stop`
  * Fixed `setCanvasZIndex` throwing an error when the canvas does not exist
  * Added documentation of the relative `x` and `y` positions to the types
  * Improved performance, the animation loop now stops when there are no confettis and starts again when they are created
  * Improved animation, now the speed does not depend on the screen refresh rate
  * Improved performance, less objects are created for each confetti and the colors and position are calculated once per call
  * Each call now keeps its own `canvas` and `z`, so several canvases can be used at the same time
  * `stop` does nothing on the server (SSR) instead of throwing an error
  * Improved types, removed `any` and a shape map is used instead of conditions
  * `create` now returns a promise resolved when the confettis of that call are gone or stopped
  * `stop` accepts an optional canvas id to stop only that canvas
  * Fixed `require('confettis')`, added `exports` (the CJS bundle is now `lib/confettis.cjs`) and `sideEffects: false` to `package.json`
  * Renamed internal `wabble` to `wobble`

Note: 0.5.0 was skipped (version bump by mistake)

### 0.4.1

Release 14 dec 2025

  * Renamed `reset` function to `stop`
  * Fixed `stop` function, now stops animations and clear confettis

### 0.3.9

Release 6 jul 2025

  * Added `triangle` shape
  * Now `rectangle` shape has a more natural movement
  * Update dev dependencies
  * Update README.md

### 0.3.8

Release 3 jul 2025

  * Up version to republish on npm

### 0.3.7

Release 25 oct 2024

  * Fixed shape type

### 0.3.6

Release 23 oct 2024

  * Fixed canvas creation

### 0.3.5

Release 23 oct 2024

  * Fixed canvas spawn position

### 0.3.4

Release 6 mar 2024

  * Fixed init after reset

### 0.3.3

Release 6 mar 2024

  * Added `reset` function
  * Fixed canvas creation

### 0.3.0

Release 5 oct 2023

  * Added `rectangle` shape
  * Added support for multiple gravity, scale and speed values
  * Added `overflow` (`object`) prarameter to allow confetti particle exceed the canvas without being deleted
    * `overflow.left` are type `boolean` and when activating it is allowed left overflow
    * `overflow.right` are type `boolean` and when activating it is allowed right overflow
    * `overflow.top` are type `boolean` and when activating it is allowed top overflow
    * `overflow.bottom` are type `boolean` and when activating it is allowed bottom overflow
  * Now gravity, scale and speed can be a number or an array of numbers
  * Renamed `scales` option param to `scale`
  * Updated README.md
  * Code refactor

### 0.2.6

Release 3 oct 2023

  * Fix check to delete confetti particles that are not visible

### 0.2.5

Release 3 oct 2023

  * Reverts elimination prevention of confetti. It is more optimal coordinates such as 0.001 (top or left) or 1.999 (right or bottom)

### 0.2.4

Release 3 oct 2023

  * Added confeti elimination prevention if created outside of canvas (100 extra pixels)
  * Added static confetti option to readme
  * Change default confetti Y origin to 0.7
  * Code refactorization

### 0.2.3

Release 2 oct 2023

  * Added static confetti option
  * Fixed SSR checks
  * Fixed types when add confetti props

### 0.2.0

Release 2 oct 2023

  * Added option to disable ticks (opacity). Put -1 on ticks
  * Added window checks to avoid server execution errors (SSR)
  * Changed the z-index by default of the canvas. Now is Number.MAX_SAFE_INTEGER (2147483647)

### 0.1.2

Release 2 oct 2023

  * Added particle position check to delete it from array when it comes out of canvas

### 0.1.0

Release 1 oct 2023

  * First version
