import IMAP from 'imap-raw'

import type { IMAPConfig } from 'imap-raw/types'

import { mailboxes } from './methods/mailboxes/mailboxes.js'
import { login } from './methods/login/login.js'

export default class TenIMAP extends IMAP {
  public inboxes = mailboxes
  public login = login

  constructor(config: IMAPConfig) {
    super(config)
  }
}
