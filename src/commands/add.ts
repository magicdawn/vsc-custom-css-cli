import { Command, Option, Usage } from 'clipanion'
import consola from 'consola'
import debugFactory from 'debug'
import fse from 'fs-extra'
import path from 'path'
import { ALLOWED_EXT, HTML_FILE } from '../config'
import { add } from '../data'
import { isUrl } from '../utils'
import { applyData } from './common'

const debug = debugFactory('vsc-custom:add')

export class AddCommand extends Command {
  static paths = [['add']]

  static usage: Usage = {
    category: '',
    description: `Add css or js to vscode`,
    details: '',
    examples: [
      [`add css file`, `$0 add ./custom.css`],
      [`add js file`, `$0 add ./custom.js`],
    ],
  }

  file = Option.String({ required: true })

  async execute() {
    let { file } = this
    if (!isUrl(file)) file = path.resolve(file)

    const ext = path.extname(file).slice(1)
    if (!ALLOWED_EXT.includes(ext)) {
      console.error(`.${ext} is not in allowed extensions [${ALLOWED_EXT.toString()}]`)
      process.exit(1)
      return
    }

    //  backup original
    const bakFile = HTML_FILE.replace(/(\w+)\.html$/, '$1.bak.html')
    if (!fse.existsSync(bakFile)) {
      fse.copyFileSync(HTML_FILE, bakFile)
      debug('bak file writed')
    } else {
      debug('bak file already exists, skip backup')
    }

    add(file)
    await applyData()

    consola.log('[vsc-custom]: embed file success %s', file)
  }
}
