import path from 'path'
import fse from 'fs-extra'

type Platform = typeof process.platform
type IAppDirRegistry = Partial<{
  [k in Platform]: string
}>

const APP_DIR_REGISTRY: IAppDirRegistry = {
  darwin: '/Applications/Visual Studio Code.app/Contents/Resources/app/',
}

// const htmlRelativeFile =
const htmlRelativeFile = [
  // new Version: 1.70.0
  'out/vs/code/electron-sandbox/workbench/workbench.html',

  // old
  'out/vs/code/electron-browser/workbench/workbench.html',
]

export const APP_DIR = APP_DIR_REGISTRY[process.platform]
if (!APP_DIR) {
  throw new Error('unsupported platform')
}

// '/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html' on Mac
// export const HTML_FILE = path.join(APP_DIR, htmlRelativeFile)
export let HTML_FILE = ''
for (const rel of htmlRelativeFile) {
  const htmlFile = path.join(APP_DIR, rel)
  if (fse.pathExistsSync(htmlFile)) {
    HTML_FILE = htmlFile
  }
}
if (!HTML_FILE) {
  HTML_FILE = path.join(APP_DIR, htmlRelativeFile[0])
}

export const DATA_ATTR_NAME = 'data-vsc-custom-file'

export const ALLOWED_EXT = ['js', 'css', 'scss', 'less']
