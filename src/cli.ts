#!/usr/bin/env node

import { Builtins, Cli } from 'clipanion'
import esmUtils from 'esm-utils'
import { PackageJson } from 'type-fest'

const { require } = esmUtils(import.meta)
const { version, name, bin } = require('../package.json') as PackageJson

const [node, app, ...args] = process.argv
const cli = new Cli({
  binaryLabel: name,
  binaryName: Object.keys(bin)[0],
  binaryVersion: version,
})

cli.register(Builtins.HelpCommand)
cli.register(Builtins.VersionCommand)
cli.register(Builtins.DefinitionsCommand)

// more commands
import { AddCommand } from './commands/add'
cli.register(AddCommand)

import { RemoveCommand } from './commands/remove'
cli.register(RemoveCommand)

import { UpdateCommand } from './commands/update'
cli.register(UpdateCommand)

import { ListCommand } from './commands/list'
cli.register(ListCommand)

cli.runExit(args, Cli.defaultContext)
