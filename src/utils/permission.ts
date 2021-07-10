import os from 'os'
import prompt from 'sudo-prompt'
import debugFactory from 'debug'

const debug = debugFactory('vsc-custom:utils:permission')

export async function chown(dir: string) {
  const username = os.userInfo().username

  const cmd = `chown -R ${username} '${dir}'`
  debug('cmd: %s', cmd)
  const result = await new Promise((resolve, reject) => {
    prompt.exec(cmd, { name: 'vsc-custom' }, (err, stdout) => {
      if (err) return reject(err)
      resolve(stdout)
    })
  })
}
