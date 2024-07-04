import consola from 'consola'
import envPaths from 'env-paths'
import esmUtils from 'esm-utils'
import fse from 'fs-extra'
import path from 'path'
import type { CurrentPackageJson } from './utils/types'

const { require } = esmUtils(import.meta)
const { name } = require('../package.json') as CurrentPackageJson
const paths = envPaths(name, { suffix: '' })

export type AddedAsset = { file: string; disabled: boolean }

export const dataFile = path.join(paths.data, 'added-assets.json')

export let CURRENT_ASSETS: AddedAsset[] = []

// 兼容之前 string[] 的数据
type CompatibleJson = (string | AddedAsset)[]
function toAssets(compatibleJSON: CompatibleJson) {
  return compatibleJSON.map((item) => {
    if (typeof item === 'string') return { file: item, disabled: false }
    return item
  })
}

export function read() {
  const json = fse.readJSONSync(dataFile, { throws: false }) as CompatibleJson

  if (!json) {
    write([])
    return []
  }

  return (CURRENT_ASSETS = toAssets(json))
}

// read on start
consola.info('[vsc-custom]: using data file: %s', dataFile)
read()

export function write(data: AddedAsset[]) {
  CURRENT_ASSETS = data
  fse.outputJSONSync(dataFile, data)
}

const _remove = (file: string) => {
  const index = CURRENT_ASSETS.findIndex((i) => i.file === file)
  if (index !== -1) {
    CURRENT_ASSETS.splice(index, 1)
  }
}

export function add(file: string) {
  // rm
  _remove(file)

  // add
  CURRENT_ASSETS.push({ file, disabled: false })

  // persist
  write(CURRENT_ASSETS)
}

export function remove(file: string) {
  // rm
  _remove(file)

  // persist
  write(CURRENT_ASSETS)
}
