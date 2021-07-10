import path from 'path'
import fse from 'fs-extra'
import is from 'is_js'
import { CheerioAPI } from 'cheerio'
import less from 'less'
import sass from 'sass'
import { readUrl } from 'dl-vampire'
import ProxyAgent from 'proxy-agent'
import { DATA_ATTR_NAME, ALLOWED_EXT } from '../config'

export * from './checksum'
export * from './permission'

// clean up unexists file
export function cleanUp($: CheerioAPI) {
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

export const isUrl = (u: string) => is.url(u) as boolean

export const read = (file: string) => fse.readFileSync(file, 'utf-8')

export async function getRawContent(file: string) {
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

export async function getContent(file: string) {
  const type = isUrl(file) ? 'remote' : 'local'
  const ext = path.extname(file).slice(1)
  let content = await getRawContent(file)

  if (type === 'local') {
    if (ext === 'less') {
      const output = await less.render(content, { filename: file })
      content = output.css
    }

    if (ext === 'scss') {
      const output = sass.renderSync({ file, outputStyle: 'expanded' })
      content = output.css.toString()
    }
  }

  if (type === 'remote') {
    if (ext === 'less') {
      const output = await less.render(content)
      content = output.css
    }
    if (ext === 'scss') {
      const o = sass.renderSync({ data: content })
      content = o.css.toString()
    }
  }

  return content
}
