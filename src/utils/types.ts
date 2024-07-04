import type { Merge, PackageJson, SetRequired } from 'type-fest'

export type CurrentPackageJson = Merge<
  SetRequired<PackageJson, 'name'>,
  {
    bin: Record<string, string>
  }
>
