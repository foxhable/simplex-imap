import { Mailbox, type MailboxData } from './Mailbox.js'
import type { TenIMAP } from '@/main/types/index.js'
import { type SearchMethodConfig } from '@/main/methods/search/types.js'
import { type UnselectMethodConfig } from '@/main/methods/unselect/types.js'

export interface SelectedMailboxData extends MailboxData {
  mailbox?: Mailbox
}

export class SelectedMailbox extends Mailbox {
  protected readonly _mailbox: Mailbox

  constructor(connection: TenIMAP, data: SelectedMailboxData) {
    super(connection, data)
    this._mailbox = data.mailbox || new Mailbox(connection, data)
  }

  public async search(config: SearchMethodConfig) {
    return await this.connection.search(config)
  }

  public async unselect(config?: UnselectMethodConfig) {
    await this.connection.unselect(config)
    return this._mailbox
  }
}
