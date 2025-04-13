import IMAP from '@/low-level-imap/main.js'
import { simplexImapLogger } from './logger/main.js'
import type { IMAPConfig } from '@/low-level-imap/types/index.js'
import type { SelectedMailbox } from '@/simplex-imap/classes/Mailbox/SelectedMailbox.js'

import { mailboxes } from '@/simplex-imap/methods/mailboxes/index.js'
import { login } from '@/simplex-imap/methods/login/login.js'
import { select } from '@/simplex-imap/methods/select/index.js'
import { unselect } from '@/simplex-imap/methods/unselect/unselect.js'
import { search } from '@/simplex-imap/methods/search/search.js'
import { fetch } from './simplex-imap/methods/fetch/index.js'

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
