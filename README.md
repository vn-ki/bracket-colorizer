# Bracket Colorizer

Finding brackets is easier than ever now. This atom extension uniquely colors upto 10 bracket pairs after which the color repeats.

<p align="center">
<img src=".github/screenshot1.png" alt="Screenshot">
</p>

## Installation

You can use apm for install.

```
apm install bracket-colorizer
```

### Note

This extension does not declare any shortcut by default. Use the command pallete to toggle the extension.

If you want to add a shortcut, add the following line to you custom keymap.

```
'atom-workspace':
  'ctrl-alt-q': 'bracket-colorizer:toggle'
```

### TODO

- Indicate missing brackets
- Improve bracket matching
- Provide option for custom bracket matching
- Provide option to exclude files

Based on [nms-color-bracket](https://github.com/nmscholl/nms-color-bracket).
