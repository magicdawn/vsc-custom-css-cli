import fse from 'fs-extra'
import cheerio, { CheerioAPI } from 'cheerio'
import { APP_DIR, HTML_FILE } from '../config'
import { checkChecksum, chown } from '../utils'

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

export async function save($: CheerioAPI) {
  const newHtml = $.html()
  fse.writeFileSync(HTML_FILE, newHtml)
  console.log(`[vsc-custom]: write html file success '%s'`, HTML_FILE)

  checkChecksum()
  console.log('[vsc-custom]: checksum applied')
}
