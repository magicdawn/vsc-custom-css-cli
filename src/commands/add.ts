import { Command, Option, Usage } from 'clipanion'
import fse from 'fs-extra'
import debugFactory from 'debug'
import cheerio from 'cheerio'
import path from 'path'
import { HTML_FILE, DATA_ATTR_NAME, ALLOWED_EXT } from '../config'
import { cleanUp, isUrl, getContent, checkChecksum } from '../utils'
import { prepare, save } from './common'

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

    const $ = await prepare()

    // add tag or update tag content
    const fileContent = await getContent(file)
    const tagExists = $(`[${DATA_ATTR_NAME}='${file}']`)
    if (tagExists.length) {
      tagExists.text(fileContent)
    } else {
      const tagName = ext === 'js' ? 'script' : 'style'
      const tag = `\n<${tagName} ${DATA_ATTR_NAME}='${file}'>\n${fileContent}\n</${tagName}>\n`
      $('html').append(tag)
    }

    save($)
    console.log('[vsc-custom]: embed file success %s', file)
  }
}
