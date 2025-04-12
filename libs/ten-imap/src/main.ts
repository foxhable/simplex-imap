import IMAP from 'imap-raw'
import { tenImapLogger } from 'logger'
import type { IMAPConfig } from 'imap-raw/types'

import { mailboxes } from './methods/mailboxes/mailboxes.js'
import { login } from './methods/login/login.js'
import { select } from './methods/select/select.js'
import { Mailbox } from './classes/Mailbox/Mailbox.js'

export default class TenIMAP extends IMAP {
  public selectedMailbox: Mailbox | null = null

  public mailboxes = mailboxes
  public login = login
  public select = select

  constructor(config: IMAPConfig) {
    super(config)
    tenImapLogger.setLogLevel(config.logLevel || this._defaultConfig.logLevel)
  }
}
