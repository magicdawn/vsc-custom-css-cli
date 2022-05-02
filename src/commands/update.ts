import { Command, Usage, Option } from 'clipanion'
import pmap from 'promise.map'
import { DATA_ATTR_NAME } from '../config'
import { prepare, save } from './common'
import { getContent } from '../utils'

export class UpdateCommand extends Command {
  static paths = [['update'], ['up']]

  static usage: Usage = {
    category: '',
    description: 'update embeded file content',
  }

  async execute(): Promise<number | void> {
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
        const content = disabled ? '' : await getContent(file)
        return { file, disabled, content }
      },
      5
    )

    tags.each(function (index) {
      $(this).text(newListData[index].content || '')
    })

    save($)
  }
}
