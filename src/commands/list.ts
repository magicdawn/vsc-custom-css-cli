import { Command, Option, Usage } from 'clipanion'
import inquirer from 'inquirer'
import { AddedAsset, CURRENT_ASSETS, write } from '../data'
import { applyData } from './common'

export class ListCommand extends Command {
  static paths = [['list'], ['ls'], ['l']]

  static usage: Usage = {
    category: '',
    description: 'manage added files',
  }

  interactive = Option.Boolean('-i,--interactive', false, {
    description: 'list & slect with an interactive prompt',
  })

  async execute() {
    if (this.interactive) {
      return this.interactiveSelect()
    } else {
      return this.normalList()
    }
  }

  interactiveSelect = async () => {
    const { selectedIndex } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'choose from list',
        name: 'selectedIndex',
        choices: CURRENT_ASSETS.map((asset, index) => {
          return { name: asset.file, value: index, checked: !asset.disabled }
        }),
      },
    ])

    const newList: AddedAsset[] = CURRENT_ASSETS.map((item, index) => {
      return { ...item, disabled: !selectedIndex.includes(index) }
    })
    write(newList)

    await applyData()
  }

  normalList = async () => {
    console.log('')
    console.log('Current added files: (✅ enabled, 🟩 disabled)')
    console.log('')

    const msgs = CURRENT_ASSETS.map((item) => {
      // const symbol = item.disabled ? logSymbols.success : logSymbols.error
      const symbol = item.disabled ? '✅' : '🟩'
      return `${symbol} ${item.file}`
    })
    console.log(msgs.join('\n'))
  }
}
