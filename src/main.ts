import IMAP from '@/base/main.js'
import { simplexImapLogger } from './logger/main.js'
import type { IMAPConfig } from '@/base/types/index.js'
import type { SelectedMailbox } from './main/classes/Mailbox/SelectedMailbox.js'

import { mailboxes } from './main/methods/mailboxes/mailboxes.js'
import { login } from './main/methods/login/login.js'
import { select } from './main/methods/select/select.js'
import { unselect } from './main/methods/unselect/unselect.js'
import { search } from './main/methods/search/search.js'

export class SimplexIMAP extends IMAP {
  public selectedMailbox: SelectedMailbox | null = null

  public mailboxes = mailboxes
  public login = login
  public select = select
  public unselect = unselect
  public search = search

  constructor(config: IMAPConfig) {
    super(config)
    simplexImapLogger.setLogLevel(config.logLevel || this._defaultConfig.logLevel)
  }
}
