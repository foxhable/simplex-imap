import type { SimplexIMAP } from '@/main.js'
import { Mailbox, type MailboxData } from './Mailbox.js'
import type { FetchConfig } from '@/methods/fetch/types.js'
import type { SearchMethodConfig } from '@/methods/search/types.js'
import type { UnselectMethodConfig } from '@/methods/unselect/types.js'
import type { SequenceSet } from '@/shared/sequence-set/types.js'

export interface SelectedMailboxData extends MailboxData {
  mailbox?: Mailbox
}

export class SelectedMailbox extends Mailbox {
  protected readonly _mailbox: Mailbox

  constructor(connection: SimplexIMAP, data: SelectedMailboxData) {
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

  public async fetch(sequenceSet: SequenceSet, config?: FetchConfig) {
    await this.connection.fetch(sequenceSet, config)
  }
}
