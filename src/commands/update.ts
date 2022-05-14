import { Command, Usage } from 'clipanion'
import { applyData } from './common'

export class UpdateCommand extends Command {
  static paths = [['update'], ['up']]

  static usage: Usage = {
    category: '',
    description: 'update embeded file content',
  }

  execute(): Promise<number | void> {
    return applyData()
  }
}
