import cheerio, { CheerioAPI } from 'cheerio'
import consola from 'consola'
import fse from 'fs-extra'
import path from 'path'
import pmap from 'promise.map'
import { APP_DIR, DATA_ATTR_NAME, HTML_FILE } from '../config'
import { CURRENT_ASSETS } from '../data'
import { checkChecksum, chown, getContent } from '../utils'

export async function prepare() {
  let ok = true
  try {
    fse.accessSync(HTML_FILE, fse.constants.W_OK)
  } catch (e) {
    ok = false
  }

  // let's sudo
  if (!ok) {
    await chown(APP_DIR)
  }

  const htmlContent = fse.readFileSync(HTML_FILE, 'utf-8')
  const $ = cheerio.load(htmlContent, { decodeEntities: false })
  return $
}

export function save($: CheerioAPI) {
  const newHtml = $.html()
  fse.writeFileSync(HTML_FILE, newHtml)
  consola.success(`[vsc-custom]: write html file success '%s'`, HTML_FILE)

  checkChecksum()
  consola.success('[vsc-custom]: checksum applied')
}

export async function applyData() {
  const $ = await prepare()

  // remove all existing tags
  $(`[${DATA_ATTR_NAME}]`).remove()

  // update contents
  const listData = await pmap(
    CURRENT_ASSETS,
    async (file) => {
      const content = await getContent(file)
      return { file, content }
    },
    5
  )

  // create new tags
  for (let { file, content } of listData) {
    const ext = path.extname(file)
    const tagName = ext === 'js' ? 'script' : 'style'
    const tag = `\n<${tagName} ${DATA_ATTR_NAME}='${file}'>\n${content}\n</${tagName}>\n`
    $('html').append(tag)
  }

  save($)
}
