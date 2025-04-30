import { defaultConfig, defaultSimplexIMAPConfig } from '@/entities/imap/index.js'
import { simplexImapLogger } from '@/shared/logger/index.js'
import { IMAP } from '@/entities/imap/index.js'
import type { SimplexIMAPConfig } from '@/entities/imap/types.js'
import type { SelectedMailbox } from '@/entities/mailbox/index.js'

import { mailboxes } from '@/methods/mailboxes/index.js'
import { login } from '@/methods/login/index.js'
import { select } from '@/methods/select/index.js'
import { unselect } from '@/methods/unselect/index.js'
import { search } from '@/methods/search/index.js'
import { fetch } from '@/methods/fetch/index.js'

export class SimplexIMAP extends IMAP {
  public selectedMailbox: SelectedMailbox | null = null
  protected readonly _config!: SimplexIMAPConfig

  constructor(config: SimplexIMAPConfig) {
    const _config = Object.assign(defaultSimplexIMAPConfig, config)
    super(_config)

    simplexImapLogger.setLogLevel(_config.logLevel || defaultConfig.logLevel)

    if (_config.connectOnCreating) {
      this.connect().then(() => this._loginOnCreate())
    }
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

  protected _loginOnCreate() {
    if (!this._config.loginOnCreating) return

    this.login()
  }
}
