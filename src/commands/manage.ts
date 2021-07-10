import { Command, Usage } from 'clipanion'

export default class ManageCommand extends Command {
  static paths = [['manage'], ['m']]

  static usage: Usage = {
    description: 'manage added files',
  }

  async execute() {}
}
