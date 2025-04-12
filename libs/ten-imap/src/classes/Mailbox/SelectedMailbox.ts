import { Mailbox } from './Mailbox.js'
import TenIMAP from '../../main.js'
import type { MailboxData } from './types.js'
import { type SearchMethodConfig } from '../../methods/search/types.js'

export class SelectedMailbox extends Mailbox {
  constructor(connection: TenIMAP, data: MailboxData) {
    super(connection, data)
  }

  public async search(config: SearchMethodConfig) {
    return this.connection.search(config)
  }
}