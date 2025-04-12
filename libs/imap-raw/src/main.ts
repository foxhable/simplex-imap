import { connect as createTLSConnection } from 'tls'
import { createConnection as createTCPConnection } from 'net'
import { imap as utf7imap } from 'utf7'
import { imapRawLogger as logger } from 'logger'
import { parseIMAPResponse } from './functions/parser.js'

import type {
  ExtractMethodArgs,
  IMAPConfig,
  IMAPConnection,
  IMAPMethod,
  IMAPResult,
  IMAPStatus,
  MethodWithArgs,
  MethodWithoutArgs,
  } from './types/index.js'
import { IMAP_STATUSES, LOG_LEVELS } from './types/index.js'

export default class IMAP {
  protected readonly _defaultConfig = {
    port: 993,
    tls: true,
    connectOnCreating: true,
    logLevel: LOG_LEVELS.NONE,
  } as const satisfies Partial<IMAPConfig>

  protected readonly _config: typeof this._defaultConfig & IMAPConfig
  protected _connection: IMAPConnection | null = null

  protected _tag: number = 0

  constructor(config: IMAPConfig) {
    this._config = this._createIMAPConfig(config)
    logger.setLogLevel(config.logLevel || this._defaultConfig.logLevel)

    if (this._config.connectOnCreating) {
      this._connection = this._createConnection()
    }
  }

  protected _status: IMAPStatus = IMAP_STATUSES.NOT_CONNECTED

  get status() {
    return this._status
  }

  async connect() {
    this._connection = this._createConnection()
  }

  async send<TMethod extends MethodWithoutArgs>(method: TMethod): Promise<IMAPResult>
  async send<TMethod extends MethodWithArgs>(method: TMethod, args: ExtractMethodArgs<TMethod>): Promise<IMAPResult>
  async send<TMethod extends IMAPMethod>(method: TMethod, args?: ExtractMethodArgs<TMethod>): Promise<IMAPResult> {
    if (!this._connection) throw new Error('Connection not created')
    await this._waitStatus(IMAP_STATUSES.READY)

    const _tag = this._getTag()

    const _args = args ? ` ${Object.values(args).join(' ')}` : ''
    const body = `${_tag} ${method}${_args}\r\n`

    this._connection.write(body)
    logger.log('Sent message, body:\n', body)
    return await this._response(_tag)
  }

  protected _waitStatus(targetStatus: IMAPStatus) {
    return new Promise<void>(resolve => {
      if (this._status === targetStatus) resolve()

      setTimeout(() => this._waitStatus(targetStatus).then(resolve), 50)
    })
  }

  protected _createIMAPConfig(userConfig?: IMAPConfig) {
    return Object.assign(this._defaultConfig, userConfig)
  }

  protected _createConnection(): IMAPConnection {
    const _config = {
      host: this._config.host,
      port: this._config.port,
    }

    const connection = this._config.tls ? createTLSConnection(_config) : createTCPConnection(_config)

    if (!connection) throw new Error('Error while creating connection')

    connection.once('connect', () => this._status = IMAP_STATUSES.CONNECTED)
    connection.once('data', () => this._status = IMAP_STATUSES.READY)
    connection.once('close', this.disconnect)
    connection.once('timeout', this.disconnect)

    connection.on('data', data => {
      const result = parseIMAPResponse(utf7imap.decode(data.toString()))
      logger.log('Receive message, result:\n', result)
      if (result.status === 'BYE') this.disconnect()
    })

    return connection
  }

  async disconnect() {
    const timeout = setTimeout(this._connection!.destroy, 15000)
    if (this._connection) await this.send('LOGOUT')
    clearTimeout(timeout)
    this._status = IMAP_STATUSES.DISCONNECTED
    this._connection = null
    logger.log('Connection was closed')
  }

  protected _getTag(): string {
    return String(++this._tag)
  }

  protected async _response(tag: string): Promise<IMAPResult> {
    return new Promise<IMAPResult>(resolve => {
      if (!this._connection) throw new Error('Connection not created')

      const handler = (data: any) => {
        const result = parseIMAPResponse(utf7imap.decode(data.toString()))
        if (result.tag === tag) {
          this._connection?.removeListener('data', handler)
          resolve(result)
        }
      }

      this._connection.on('data', handler)
    })
  }
}
