# vsc-custom-css-cli

> vsc-custom-css-cli

[![Build Status](https://img.shields.io/travis/magicdawn/vsc-custom-css-cli.svg?style=flat-square)](https://travis-ci.org/magicdawn/vsc-custom-css-cli)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/vsc-custom-css-cli.svg?style=flat-square)](https://codecov.io/gh/magicdawn/vsc-custom-css-cli)
[![npm version](https://img.shields.io/npm/v/vsc-custom-css-cli.svg?style=flat-square)](https://www.npmjs.com/package/vsc-custom-css-cli)
[![npm downloads](https://img.shields.io/npm/dm/vsc-custom-css-cli.svg?style=flat-square)](https://www.npmjs.com/package/vsc-custom-css-cli)
[![npm license](https://img.shields.io/npm/l/vsc-custom-css-cli.svg?style=flat-square)](http://magicdawn.mit-license.org)

## Install

```sh
$ npm i vsc-custom-css-cli -g
```

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

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

the MIT License http://magicdawn.mit-license.org
