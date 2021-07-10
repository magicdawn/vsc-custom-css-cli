# vsc-custom-css-cli

> vsc-custom-css-cli

<!--
[![Build Status](https://img.shields.io/travis/magicdawn/vsc-custom-css-cli.svg?style=flat-square)](https://travis-ci.org/magicdawn/vsc-custom-css-cli)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/vsc-custom-css-cli.svg?style=flat-square)](https://codecov.io/gh/magicdawn/vsc-custom-css-cli)
-->

[![npm version](https://img.shields.io/npm/v/vsc-custom-css-cli.svg?style=flat-square)](https://www.npmjs.com/package/vsc-custom-css-cli)
[![npm downloads](https://img.shields.io/npm/dm/vsc-custom-css-cli.svg?style=flat-square)](https://www.npmjs.com/package/vsc-custom-css-cli)
[![npm license](https://img.shields.io/npm/l/vsc-custom-css-cli.svg?style=flat-square)](http://magicdawn.mit-license.org)

## Credits

- https://gist.github.com/Hendrixer/7a250a2be529cda8939de8305c9a85a1
- https://github.com/lehni/vscode-fix-checksums

## Install

```sh
$ npm i vsc-custom-css-cli -g
```

**only macOS** is supported

## Binary name = `vsc-custom`

```sh
$ vsc-custom
```

## Commands

### `vsc-custom add <file-or-url>`

- file-or-url
  local file or file url
  supports `.css` / `.less` / `.sass` & `.js` file

example

```sh
# local css
vsc-custom add ./custom.css

# remote url
vsc-custom add 'https://gist.githubusercontent.com/magicdawn/9a8278667c5ebdf71cb87b8504295449/raw/a47ebbf01baf0a0fab49b2f8e9ec9411b492c9cd/vscode-big-clock.less'
```

## Use Case

### Big Clock

![image](https://user-images.githubusercontent.com/4067115/125153891-6ff49080-e189-11eb-8b08-42789d5c5016.png)

- install extension https://marketplace.visualstudio.com/items?itemName=rid9.datetime
- install custom css `vsc-custom add 'https://gist.githubusercontent.com/magicdawn/9a8278667c5ebdf71cb87b8504295449/raw/a47ebbf01baf0a0fab49b2f8e9ec9411b492c9cd/vscode-big-clock.less'`

### more ...

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

the MIT License http://magicdawn.mit-license.org
