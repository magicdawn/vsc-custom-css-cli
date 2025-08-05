import { createRequire } from 'node:module'
import type { Merge, PackageJson, SetRequired } from 'type-fest'

export type CurrentPackageJson = Merge<
  SetRequired<PackageJson, 'name'>,
  {
    bin: Record<string, string>
  }
>

const require = createRequire(__filename)
export const currentPackageJson = require('../package.json') as CurrentPackageJson
