#!/usr/bin/env node

import { Builtins, Cli } from 'clipanion'
import { AddCommand } from './commands/add'
import { ListCommand } from './commands/list'
import { RemoveCommand } from './commands/remove'
import { UpdateCommand } from './commands/update'
import { currentPackageJson } from './pkg'

const { version, name, bin } = currentPackageJson
const cli = new Cli({
  binaryLabel: name,
  binaryName: Object.keys(bin)[0],
  binaryVersion: version,
})

cli.register(Builtins.HelpCommand)
cli.register(Builtins.VersionCommand)
cli.register(Builtins.DefinitionsCommand)
cli.register(AddCommand)
cli.register(RemoveCommand)
cli.register(UpdateCommand)
cli.register(ListCommand)

const [node, app, ...args] = process.argv
cli.runExit(args, Cli.defaultContext)
