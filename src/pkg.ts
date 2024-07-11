import { createRequire } from 'module'
import type { CurrentPackageJson } from './utils/types'

const require = createRequire(__filename)
export const currentPackageJson = require('../package.json') as CurrentPackageJson
