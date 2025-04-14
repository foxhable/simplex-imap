import { simplexImapLogger } from './logger/main.js'
import { IMAP } from '@/entities/imap/index.js'
import type { IMAPConfig } from '@/entities/imap/types.js'
import type { SelectedMailbox } from '@/entities/mailbox/index.js'

import { mailboxes } from '@/methods/mailboxes/index.js'
import { login } from '@/methods/login/index.js'
import { select } from '@/methods/select/index.js'
import { unselect } from '@/methods/unselect/index.js'
import { search } from '@/methods/search/index.js'
import { fetch } from '@/methods/fetch/index.js'

export class SimplexIMAP extends IMAP {
  public selectedMailbox: SelectedMailbox | null = null

  public mailboxes = mailboxes
  public login = login
  public select = select
  public unselect = unselect
  public search = search
  public fetch = fetch

  constructor(config: IMAPConfig) {
    super(config)
    simplexImapLogger.setLogLevel(config.logLevel || this._defaultConfig.logLevel)
  }
}
