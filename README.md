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

## Notice

**After add/update command, in order to make it effects, a full quit & restart of vscode is needed.**

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

### `vsc-custom update` / `vsc-custom up`

- this will update embeded file contents
- **After a vscode auto-update, everything added is lost, a `vsc-custom up` command is neeeded to get things back**

for example

- run `vsc-custom add ./local-file.css`
- modify local-file.css
- run `vsc-custom update` in order make it effects in vscode
- quit vscode & restrt vscode

### `vsc-custom list`

or `vsc-custom ls` / `vsc-custom l`

- this will list all added files
- default will disabled the unselected files. use `--delete` or `--del` flag to remove added files

## Use Case

### Big Clock

![image](https://user-images.githubusercontent.com/4067115/125153891-6ff49080-e189-11eb-8b08-42789d5c5016.png)

- install extension https://marketplace.visualstudio.com/items?itemName=rid9.datetime
- install custom css `vsc-custom add 'https://gist.githubusercontent.com/magicdawn/9a8278667c5ebdf71cb87b8504295449/raw/a47ebbf01baf0a0fab49b2f8e9ec9411b492c9cd/vscode-big-clock.less'`
- quit vscode & restart to see this screenshot happens

### more ...

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

the MIT License http://magicdawn.mit-license.org
