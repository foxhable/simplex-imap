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

  public mailboxes = mailboxes
  public login = login
  public select = select
  public unselect = unselect
  public search = search
  public fetch = fetch

  constructor(config: SimplexIMAPConfig) {
    const _config = Object.assign(defaultSimplexIMAPConfig, config)
    super(_config)

    simplexImapLogger.setLogLevel(_config.logLevel || defaultConfig.logLevel)

    if (_config.connectOnCreating) {
      this.connect().then(() => this._loginOnCreate())
    }
  }

  protected _loginOnCreate() {
    if (!this._config.loginOnCreating) return

    this.login()
  }
}
