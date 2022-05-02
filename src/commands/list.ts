import { Command, Usage, Option } from 'clipanion'
import inquirer from 'inquirer'
import { DATA_ATTR_NAME } from '../config'
import { prepare, save } from './common'
import pmap from 'promise.map'
import { getContent } from '../utils'

export class ListCommand extends Command {
  static paths = [['list'], ['ls'], ['l']]

  static usage: Usage = {
    description: 'manage added files',
  }

  delete = Option.Boolean('--delete,--del', {
    description: 'use delete mode, default is disabled mode',
  })

  async execute() {
    const $ = await prepare()
    const tags = $(`[${DATA_ATTR_NAME}]`)

    const listData = tags
      .map(function () {
        const file = $(this).attr(DATA_ATTR_NAME)
        const disabled = $(this).attr('data-disabled') === 'true'
        return { file, disabled }
      })
      .toArray()

    const newListData = await pmap(
      listData,
      async ({ file, disabled }) => {
        const content = await getContent(file)
        return { file, disabled, content }
      },
      5
    )

    const { selectedIndex } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'choose from list',
        name: 'selectedIndex',
        choices: newListData.map((item, index) => {
          return { name: item.file, value: index, checked: !item.disabled }
        }),
      },
    ])

    const shouldDelete = this.delete
    tags.each(function (index) {
      const keep = selectedIndex.includes(index)

      if (keep) {
        $(this)
          .text(newListData[index].content || '')
          .removeAttr('data-disabled')
        return
      }

      if (shouldDelete) {
        $(this).remove()
      } else {
        $(this).text('').attr('data-disabled', 'true')
      }
    })

    save($)
  }
}
