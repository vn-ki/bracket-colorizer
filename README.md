# Bracket Colorizer

[![Build Status](https://travis-ci.org/vn-ki/bracket-colorizer.svg?branch=master)](https://travis-ci.org/vn-ki/bracket-colorizer)

Finding brackets is easier than ever now. This atom extension uniquely colors upto 10 bracket pairs after which the color repeats.

<p align="center">
<img src=".github/screenshot1.png" alt="Screenshot">
</p>

## Installation

You can use apm for install.

```
apm install bracket-colorizer
```

### TODO

- Indicate missing brackets

Based on [nms-color-bracket](https://github.com/nmscholl/nms-color-bracket).

### Breaking changes in 1.0

- In settings, `'{;}, [;], (;)'` format is changed to `'{}, [], ()'`
- The toggle is removed. Package now activates on startup.
