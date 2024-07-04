import { CheerioAPI, load as cheerioLoad } from 'cheerio'
import consola from 'consola'
import ContentSecurityPolicy, { type DirectiveDescriptor } from 'csp-dev'
import debugFactory from 'debug'
import fse from 'fs-extra'
import path from 'path'
import pmap from 'promise.map'
import { APP_DIR, DATA_ATTR_NAME, HTML_FILE } from '../config'
import { CURRENT_ASSETS } from '../data'
import { checkChecksum, chown, getContent } from '../utils'

const debug = debugFactory('vsc-custom:common')

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
  const $ = cheerioLoad(htmlContent, { decodeEntities: false })
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

  // <meta http-equiv="Content-Security-Policy" content="
  {
    const cspMeta = $(`meta[http-equiv="Content-Security-Policy"]`)
    const cspContent = cspMeta.attr('content')

    // csp-dev 没有 trim, 包含很多 `\t\t`
    const fixJson = (json: DirectiveDescriptor) => {
      Object.keys(json).forEach((key) => {
        const value = json[key] as string[]
        json[key] = value.map((x) => x.trim())
      })
      return json
    }

    debugger
    const cspModel = new ContentSecurityPolicy(cspContent)
    const parsed = fixJson(cspModel.share('json'))

    if (!parsed['script-src']?.includes(`'unsafe-inline'`)) {
      parsed['script-src'] = [...(parsed['script-src'] || []), `'unsafe-inline'`]
      const newModel = new ContentSecurityPolicy()
      newModel.load(parsed)
      const cspContentNew = newModel.share('string')
      cspMeta.attr('content', cspContentNew)
    }
  }

  // remove all existing tags
  $(`[${DATA_ATTR_NAME}]`).remove()

  // update contents
  const listData = await pmap(
    CURRENT_ASSETS.filter((x) => !x.disabled),
    async ({ file }) => {
      const content = await getContent(file)
      return { file, content }
    },
    5,
  )

  debug(
    'after filter out disabled: %O',
    listData.map((x) => x.file),
  )

  // create new tags
  for (let { file, content } of listData) {
    const ext = path.extname(file).slice(1)
    const tagName = ext === 'js' ? 'script' : 'style'
    const tag = `\n<${tagName} ${DATA_ATTR_NAME}='${file}'>\n${content}\n</${tagName}>\n`
    $('html').append(tag)
  }

  save($)
}
