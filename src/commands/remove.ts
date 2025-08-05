import path from 'node:path'
import { Command, Option, type Usage } from 'clipanion'
import consola from 'consola'
import { remove } from '../data'
import { isUrl } from '../utils'
import { applyData } from './common'

export class RemoveCommand extends Command {
  static paths = [['remove'], ['rm']]

  static usage: Usage = {
    category: '',
    description: `remove previously added file or url`,
    details: '',
    examples: [[`remove file`, `$0 remove ./custom.css`]],
  }

  file = Option.String({ required: true })

  async execute() {
    let { file } = this
    if (!isUrl(file)) file = path.resolve(file)

    remove(file)
    await applyData()

    consola.success('[vsc-custom]: remove file success %s', file)
  }
}
