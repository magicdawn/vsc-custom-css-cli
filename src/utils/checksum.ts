import { createHash } from 'crypto'
import esmUtils from 'esm-utils'
import fse from 'fs-extra'
import path from 'path'
import { APP_DIR } from '../config'

const { require } = esmUtils(import.meta)

/**
 * https://github.com/lehni/vscode-fix-checksums/blob/1943e4f21251fdf2bc93479e7d391a906a00e9b1/extension.js#L27
 */

export function computeChecksum(file: string) {
  var contents = fse.readFileSync(file)
  return createHash('md5').update(contents).digest('base64').replace(/=+$/, '')
}

export function checkChecksum() {
  const productFile = path.join(APP_DIR, 'product.json')
  const product = require(productFile)
  let changed = false

  for (const [filePath, curChecksum] of Object.entries(product.checksums)) {
    const checksum = computeChecksum(path.join(APP_DIR, 'out', filePath))
    if (checksum !== curChecksum) {
      product.checksums[filePath] = checksum
      changed = true
    }
  }

  if (changed) {
    fse.writeJSONSync(productFile, product, { spaces: 0 })
  }
}
