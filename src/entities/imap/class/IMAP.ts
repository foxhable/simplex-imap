import { Buffer } from 'node:buffer'
import { imapRawLogger as logger, LOG_LEVELS } from '@/shared/logger/index.js'
import { send } from '../lib/send.js'
import { rawSend } from '../lib/rawSend.js'
import { response } from '../lib/response.js'
import { waitStatus } from '../lib/waitStatus.js'
import { disconnect } from '../lib/disconnect.js'
import { createIMAPConfig, type IMAPConfig } from '../lib/createIMAPConfig.js'
import { createConnection, type IMAPConnection } from '../lib/createConnection.js'
import { IMAP_STATUSES, type IMAPStatus } from '../model/IMAPStatus.js'

export class IMAP {
  buffer: Buffer[] = []

  protected readonly _defaultConfig = {
    port: 993,
    tls: true,
    connectOnCreating: true,
    logLevel: LOG_LEVELS.NONE,
  } as const satisfies Partial<IMAPConfig>

  protected readonly _config: typeof this._defaultConfig & IMAPConfig
  protected _connection: IMAPConnection | null = null

  protected _tag: number = 0

  protected _status: IMAPStatus = IMAP_STATUSES.NOT_CONNECTED

  constructor(config: IMAPConfig) {
    this._config = this._createIMAPConfig(config)
    logger.setLogLevel(config.logLevel || this._defaultConfig.logLevel)

    if (this._config.connectOnCreating) {
      this._connection = this._createConnection()
    }
  }

  public get status() {
    return this._status
  }

  public disconnect = disconnect

  public async connect(this: IMAP) {
    this._connection = this._createConnection()
  }

  public rawSend = rawSend

  public send = send

  protected _waitStatus = waitStatus

  protected _createIMAPConfig = createIMAPConfig

  protected _createConnection = createConnection

  protected _getTag(this: IMAP): string {
    return String(++this._tag)
  }

  protected _response = response
}
