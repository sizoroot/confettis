# Changelog

### 0.4.1

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
