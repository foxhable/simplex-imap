import { simplexImapLogger } from './logger/main.js'
import { IMAP } from '@/simplex-imap/entities/imap/index.js'
import type { IMAPConfig } from '@/simplex-imap/entities/imap/types.js'
import type { SelectedMailbox } from '@/simplex-imap/entities/mailbox/index.js'

import { mailboxes } from '@/simplex-imap/methods/mailboxes/index.js'
import { login } from '@/simplex-imap/methods/login/index.js'
import { select } from '@/simplex-imap/methods/select/index.js'
import { unselect } from '@/simplex-imap/methods/unselect/index.js'
import { search } from '@/simplex-imap/methods/search/index.js'
import { fetch } from '@/simplex-imap/methods/fetch/index.js'

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
