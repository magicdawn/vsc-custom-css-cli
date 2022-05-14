import { Command, Usage } from 'clipanion'
import inquirer from 'inquirer'
import { CURRENT_ASSETS, write } from '../data'
import { applyData } from './common'

export class ListCommand extends Command {
  static paths = [['list'], ['ls'], ['l']]

  static usage: Usage = {
    category: '',
    description: 'manage added files',
  }

  async execute() {
    const list = CURRENT_ASSETS
    const { selectedIndex } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'choose from list',
        name: 'selectedIndex',
        choices: CURRENT_ASSETS.map((item, index) => {
          return { name: item, value: index, checked: true }
        }),
      },
    ])

    const newList = CURRENT_ASSETS.filter((item, index) => {
      return selectedIndex.includes(index)
    })
    write(newList)

    await applyData()
  }
}
