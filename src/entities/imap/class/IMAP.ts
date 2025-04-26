import { Buffer } from 'node:buffer'
import { imapRawLogger as logger } from '@/shared/logger/index.js'
import { send } from '../lib/send.js'
import { rawSend } from '../lib/rawSend.js'
import { response } from '../lib/response.js'
import { waitConnStatus } from '../lib/waitConnStatus.js'
import { disconnect } from '../lib/disconnect.js'
import { createConnection, type IMAPConnection } from '../lib/createConnection.js'
import { IMAP_CONN_STATUSES, type IMAPConnStatus } from '../model/IMAPConnStatus.js'
import { defaultConfig, type IMAPConfig } from '../config/defaultConfig.js'

export class IMAP {
  buffer: Buffer[] = []

  protected readonly _config: IMAPConfig
  protected _connection: IMAPConnection | null = null

  protected _tag: number = 0

  protected _connStatus: IMAPConnStatus = IMAP_CONN_STATUSES.NOT_CONNECTED

  constructor(config: IMAPConfig) {
    this._config = Object.assign(defaultConfig, config)
    logger.setLogLevel(config.logLevel || defaultConfig.logLevel)
  }

  public get connStatus() {
    return this._connStatus
  }

  public disconnect = disconnect

  public async connect(this: IMAP) {
    this._connection = this._createConnection()
  }

  public rawSend = rawSend

  public send = send

  protected _waitConnStatus = waitConnStatus

  protected _createConnection = createConnection

  protected _getTag(this: IMAP): string {
    return String(++this._tag)
  }

  protected _response = response
}
