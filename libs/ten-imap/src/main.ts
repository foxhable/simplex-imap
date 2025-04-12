import IMAP from 'imap-raw'

import type { IMAPConfig } from 'imap-raw/types'

import { inboxes } from './methods/inboxes/inboxes.js'
import { login } from './methods/login/login.js'

export default class TenIMAP extends IMAP {
  constructor(config: IMAPConfig) {
    super(config)
  }

  inboxes = inboxes
  login = login
}
