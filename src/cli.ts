import { Cli, Builtins } from 'clipanion'
import { PackageJson } from 'type-fest'
const { version, name, bin } = require('../package') as PackageJson

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

import { ListCommand } from './commands/list'
cli.register(ListCommand)

cli.runExit(args, Cli.defaultContext)
