import { Command, Option } from 'clipanion'
import fse from 'fs-extra'
import debugFactory from 'debug'
import cheerio from 'cheerio'
import path from 'path'

const debug = debugFactory('vsc-custom:add')

export default class AddCommand extends Command {
  static paths = [['add']]

  file = Option.String({ required: true })

  async execute() {
    let { file } = this
    file = path.resolve(file)

    const htmlFile =
      '/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html'

    //  backup original
    const bakFile = htmlFile.replace(/(\w+)\.html$/, '$1.bak.html')
    if (!fse.existsSync(bakFile)) {
      fse.copyFileSync(htmlFile, bakFile)
      debug('bak file writed')
    } else {
      debug('bak file already exists, skip backup')
    }

    const htmlContent = fse.readFileSync(htmlFile, 'utf-8')
    const $ = cheerio.load(htmlContent, { decodeEntities: false })

    const styleContent = fse.readFileSync(file, 'utf-8')
    const styleInHtml = $(`style[data-file='${file}']`)
    if (styleInHtml.length) {
      styleInHtml.text(styleContent)
    } else {
      const style = `\n\n<style data-file='${file}'>${styleContent}</style>\n\n`
      $('html').append(style)
    }

    const newHtml = $.html()
    fse.writeFileSync(htmlFile, newHtml)
    console.log('[vsc-custom]: embed file success %s', file)
  }
}
