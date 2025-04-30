import { IMAP_CONN_STATUSES } from '@/entities/imap/model/IMAPConnStatus.js'
import { defaultConfig, type IMAPConfig } from '../config/defaultConfig.js'
import { IMAP_STATES, type IMAPState } from '../model/IMAPState.js'
import { IMAPError, simplexImapLogger } from '@/shared/logger/index.js'
import { IMAP } from '@/entities/imap/index.js'
import type { SelectedMailbox } from '@/entities/mailbox/index.js'

import { mailboxes } from '@/methods/mailboxes/index.js'
import { login } from '@/methods/login/index.js'
import { select } from '@/methods/select/index.js'
import { unselect } from '@/methods/unselect/index.js'
import { search } from '@/methods/search/index.js'
import { fetch } from '@/methods/fetch/index.js'

export class SimplexIMAP extends IMAP {
  public selectedMailbox: SelectedMailbox | null = null

  protected _state: IMAPState | null = null
  public get state() {
    return this._state
  }

  constructor(config: IMAPConfig) {
    super(config)

    simplexImapLogger.setLogLevel(config.logLevel || defaultConfig.logLevel)
  }

  public async disconnect() {
    await super.disconnect()
    this._state = IMAP_STATES.LOGOUT
  }

  public async connect() {
    await super.connect()
    this._state = IMAP_STATES.NOT_AUTH
  }

  public mailboxes(...props: Parameters<typeof mailboxes>) {
    return mailboxes.apply(this, props)
  }

  public login(...props: Parameters<typeof login>) {
    return login.apply(this, props)
  }

  public select(...props: Parameters<typeof select>) {
    return select.apply(this, props)
  }

  public unselect(...props: Parameters<typeof unselect>) {
    return unselect.apply(this, props)
  }

  public search(...props: Parameters<typeof search>) {
    return search.apply(this, props)
  }

  public fetch(...props: Parameters<typeof fetch>) {
    return fetch.apply(this, props)
  }

  protected async _methodCallPreparation() {
    await this._waitConnStatus(IMAP_CONN_STATUSES.READY)

    if (this._state === IMAP_STATES.AUTH || this._state === IMAP_STATES.SELECTED) return

    if (this._state === IMAP_STATES.LOGOUT) {
      throw new IMAPError('IMAP in LOGOUT state. You need connect first by SimplexIMAP.connect()')
    } else if (this._state === IMAP_STATES.NOT_AUTH) {
      throw new IMAPError('IMAP in NOT AUTHENTICATED state. You need authenticate first by SimplexIMAP.login()')
    }
  }
}
