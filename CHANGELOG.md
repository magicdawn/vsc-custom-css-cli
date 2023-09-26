# CHANGELOG

## v0.7.0 2023-09-26

- move to tsup, require node >= 18 (current LTS

## v0.6.0 2023-03-31

- save disabled state in `vsc-custom ls` command
- new command: rm added via `vsc-custom rm` command

## v0.5.0 2022-12-08

- warn on local file not exist
- use consola for fancy log

## v0.4.0 2022-08-09

- support new version vscode 1.70.0 'out/vs/code/electron-sandbox/workbench/workbench.html'

## v0.3.0 2022-05-14

- use external data file for added assets storage, and it will keep data when updating vscode

## v0.2.0 2022-05-02

- add `vsc-custom update|up` command, for update embed file contents

## v0.1.0 2021-07-15

- add `vsc-custom list|ls|l` command, for manage & update added files

## v0.0.4 2021-07-12

- fix sudo-prompt error

## v0.0.3 2021-07-10

- add checksum support after html modified

## v0.0.2 2021-07-10

- add `package.files` field

## v0.0.1 2021-07-10

- first release, we can run `vsc-custom add file-or-url` now, and sass / less is supported
- `manage` command is under construction
- auto patch is under construction
- tired, will continue in days
