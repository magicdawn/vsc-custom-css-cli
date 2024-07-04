import { CheerioAPI } from 'cheerio'
import consola from 'consola'
import { readUrl } from 'dl-vampire'
import fse from 'fs-extra'
import less from 'less'
import path from 'path'
import sass from 'sass'
import { ALLOWED_EXT, DATA_ATTR_NAME } from '../config'

export * from './checksum'
export * from './permission'

// clean up unexists file
export function cleanUp($: CheerioAPI) {
  const tags = $(`[${DATA_ATTR_NAME}]`).toArray()
  tags.forEach((t) => {
    const file = $(t).attr(DATA_ATTR_NAME) || ''
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

export const isUrl = (url: string) => /^https?:\/\//.test(url)

export const read = (file: string) => fse.readFileSync(file, 'utf-8')

export async function getRawContent(file: string) {
  if (isUrl(file)) {
    return readUrl({
      url: file,
      encoding: 'utf-8',
    })
  }

  if (fse.existsSync(file)) {
    return read(file)
  } else {
    consola.warn('[vsc-custom]: file %s does not exist', file)
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
      const output = await sass.compileAsync(file, { style: 'expanded' })
      content = output.css
    }
  }

  if (type === 'remote') {
    if (ext === 'less') {
      const output = await less.render(content)
      content = output.css
    }
    if (ext === 'scss') {
      const output = await sass.compileStringAsync(content, { style: 'expanded' })
      content = output.css
    }
  }

  return content
}
