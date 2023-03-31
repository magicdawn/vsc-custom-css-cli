import { Command, Usage } from 'clipanion'
import inquirer from 'inquirer'
import { AddedAsset, CURRENT_ASSETS, write } from '../data'
import { applyData } from './common'

export class ListCommand extends Command {
  static paths = [['list'], ['ls'], ['l']]

  static usage: Usage = {
    category: '',
    description: 'manage added files',
  }

  async execute() {
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
}
