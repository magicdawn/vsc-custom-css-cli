import { Command, Option, Usage } from 'clipanion'
import fse from 'fs-extra'
import debugFactory from 'debug'
import cheerio, { CheerioAPI } from 'cheerio'
import path from 'path'
import { HTML_FILE, DATA_ATTR_NAME } from '../config'
import is from 'is_js'
import { readUrl } from 'dl-vampire'
import less from 'less'
import sass from 'sass'
import ProxyAgent from 'proxy-agent'

const debug = debugFactory('vsc-custom:add')
const ALLOWED_EXT = ['js', 'css', 'sass', 'less']

const isUrl = (u: string) => is.url(u) as boolean

export default class AddCommand extends Command {
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

    const htmlContent = fse.readFileSync(HTML_FILE, 'utf-8')
    const $ = cheerio.load(htmlContent, { decodeEntities: false })

    // first cleanup
    cleanUp($)

    // add tag or update tag content
    const fileContent = await getContent(file)
    const tagExists = $(`[${DATA_ATTR_NAME}='${file}']`)
    if (tagExists.length) {
      tagExists.text(fileContent)
    } else {
      const tagName = ext === 'js' ? 'script' : 'style'
      const tag = `\n\n<${tagName} ${DATA_ATTR_NAME}='${file}'>${fileContent}</${tagName}>\n\n`
      $('html').append(tag)
    }

    const newHtml = $.html()
    fse.writeFileSync(HTML_FILE, newHtml)
    console.log(`[vsc-custom]: htmlFile => '%s'`, HTML_FILE)
    console.log('[vsc-custom]: embed file success %s', file)
  }
}

class FileHandler {
  file: string
  $: CheerioAPI

  constructor(file: string, $: CheerioAPI) {
    this.file = file
    this.$ = $
  }

  get ext() {
    return path.extname(this.file)
  }
}

const read = (file: string) => fse.readFileSync(file, 'utf-8')

async function getRawContent(file: string) {
  if (isUrl(file)) {
    return readUrl({
      url: file,
      encoding: 'utf-8',
      requestOptions: {
        agent: new ProxyAgent(),
      },
    })
  }

  if (fse.existsSync(file)) {
    return read(file)
  }

  return ''
}

async function getContent(file: string) {
  const type = isUrl(file) ? 'remote' : 'local'
  const ext = path.extname(file).slice(1)
  let content = await getRawContent(file)

  if (type === 'local') {
    if (ext === 'less') {
      const output = await less.render(content, { filename: file })
      content = output.css
    }

    if (ext === 'sass') {
      const output = sass.renderSync({ file, outputStyle: 'expanded' })
      content = output.css.toString()
    }
  }

  if (type === 'remote') {
    if (ext === 'less') {
      const output = await less.render(content)
      content = output.css
    }
    if (ext === 'sass') {
      const o = sass.renderSync({ data: content })
      content = o.css.toString()
    }
  }

  return content
}

function cleanUp($: CheerioAPI) {
  const tags = $(`[${DATA_ATTR_NAME}]`).toArray()
  tags.forEach((t) => {
    const file = $(t).attr(DATA_ATTR_NAME)
    const remove = () => $(t).remove()

    // do not check url
    if (isUrl(file)) return

    // file not found
    if (!fse.existsSync(file)) return remove()

    // file ext illegal
    const ext = path.extname(file)
    if (!ALLOWED_EXT.includes(ext)) return remove()
  })
}
