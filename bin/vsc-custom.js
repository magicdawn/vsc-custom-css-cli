#!/usr/bin/env node

const { existsSync } = require('fs')
const isDev = existsSync(__dirname + '/.dev')

if (isDev) {
  require('ts-node/register')
  require('../src/cli')
} else {
  require('../lib/cli')
}
