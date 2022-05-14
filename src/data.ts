import envPaths from 'env-paths'
import fse from 'fs-extra'
import path from 'path'
import { PackageJson } from 'type-fest'

const { name } = require('../package.json') as PackageJson
const paths = envPaths(name, { suffix: '' })

export const dataFile = path.join(paths.data, 'added-assets.json')

type AddedAssets = string[]

export let CURRENT_ASSETS: AddedAssets = []

export function read() {
  let json = fse.readJSONSync(dataFile, { throws: false }) as AddedAssets

  if (!json) {
    json = [] as AddedAssets
    write(json)
  }

  CURRENT_ASSETS = json
  return json
}

// read on start
console.log('[vsc-custom]: using data file: %s', dataFile)
read()

export function write(data: AddedAssets) {
  CURRENT_ASSETS = data
  fse.outputJSONSync(dataFile, data)
}

export function add(item: string) {
  const items = read()

  if (items.includes(item)) {
    items.splice(items.indexOf(item), 1)
  }

  items.push(item)
  write(items)
  return items
}
